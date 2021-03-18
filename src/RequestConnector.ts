/* eslint-disable @typescript-eslint/no-explicit-any */

import { Id } from './lib/Identifiable';
import { UnsubscribeMap } from './lib/UnsubscribeMap';
import { ClosedConnector } from './ClosedConnector';
import { AnyEvent, BaseEvent } from './Events';
import { AsyncEventSenderWithId } from './EventSender.h';
import { AnyIdentifiableEvent } from './EventIdentifiable';

export type IdentifiableResponse = {
  requestId: Id;
};

export type EventResponse<P = unknown, T extends string = string> = BaseEvent<P, T> & IdentifiableResponse;
export type AnyEventResponse = EventResponse<any, string>;

type GetResponseId<E extends AnyEventResponse> = (e: E) => Id;
type GetResponseResult<E extends AnyEventResponse, Result = unknown> = (e: E) => Result;
type GetResponseTypeForRequest<E extends AnyEvent> = (e: E) => string;

type AnyResponseEventMap = {
  [key: string]: AnyEventResponse;
};

export function makeResponseEvent<
  RequestEvent extends AnyIdentifiableEvent,
  P = unknown,
  T extends string = RequestEvent['type']
>(requestEvent: RequestEvent, payload: P) {
  return {
    type: `${requestEvent.type}::response`,
    requestId: requestEvent.id,
    payload,
  } as EventResponse<P, `${T}::response`>;
}

export type InferResponseEventMap<RequestEvent extends AnyEvent, Map extends Record<RequestEvent['type'], any>> = {
  [Key in keyof Map as `${Key extends string ? Key : never}::response`]: EventResponse<
    Map[Key],
    `${Key extends string ? Key : never}::response`
  >;
};

export type RequestConnectorOptions<RequestEvent extends AnyEvent, ResponseEvent extends AnyEventResponse> = {
  responseId?: GetResponseId<ResponseEvent>;
  responseResult?: GetResponseResult<ResponseEvent, Response>;
  responseTypeForRequestEvent?: GetResponseTypeForRequest<RequestEvent>;
};

export class RequestConnector<
  RequestEvent extends AnyEvent,
  ResponseEventMap extends AnyResponseEventMap
> extends ClosedConnector<ResponseEventMap[keyof ResponseEventMap]> {
  private responseListeners = new UnsubscribeMap<ResponseEventMap[keyof ResponseEventMap]['type']>();

  protected responseId: GetResponseId<ResponseEventMap[keyof ResponseEventMap]>;
  protected responseType: GetResponseTypeForRequest<RequestEvent>;
  protected responseResult: GetResponseResult<ResponseEventMap[keyof ResponseEventMap], Response>;

  constructor(
    private bridge: AsyncEventSenderWithId<RequestEvent>,
    {
      responseId = (e) => e.requestId,
      responseResult = (e) => e.payload,
      responseTypeForRequestEvent = (e) => e.type + '::response',
    }: RequestConnectorOptions<RequestEvent, ResponseEventMap[keyof ResponseEventMap]> = {}
  ) {
    super();
    this.responseId = responseId;
    this.responseType = responseTypeForRequestEvent;
    this.responseResult = responseResult;
  }

  public async request<E extends RequestEvent>(event: E): Promise<Response> {
    const { id: eventId } = await this.bridge.send(event);
    const responseType = this.responseType(event);

    return new Promise((resolve) => {
      this.responseListeners.set(
        eventId,
        this.on(responseType, (event) => {
          if (this.responseId(event) === eventId) {
            resolve(this.responseResult(event));
            this.responseListeners.release(eventId);
          }
        })
      );
    });
  }
}

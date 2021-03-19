/* eslint-disable @typescript-eslint/no-explicit-any */

import { Id } from './lib/Identifiable';
import { UnsubscribeMap } from './lib/UnsubscribeMap';
import { ClosedConnector } from './ClosedConnector';
import { BaseEvent } from './Events';
import { AsyncRequestSender } from './EventSender.h';
import { AnyEventResponse, AnyResponseEventMap, EventResponse, getEventResponseType } from './EventResponse';

type GetResponseId<E extends EventResponse> = (e: E) => Id;
type GetResponseResult<E extends EventResponse, Result = unknown> = (e: E) => Result;
type GetResponseTypeForRequest<E extends BaseEvent> = (e: E) => string;

export type RequestConnectorOptions<RequestEvent extends BaseEvent, ResponseEvent extends AnyEventResponse> = {
  responseId?: GetResponseId<ResponseEvent>;
  responseResult?: GetResponseResult<ResponseEvent, Response>;
  responseTypeForRequestEvent?: GetResponseTypeForRequest<RequestEvent>;
};

export class RequestConnector<
  RequestEvent extends BaseEvent,
  ResponseEventMap extends AnyResponseEventMap
> extends ClosedConnector<ResponseEventMap[keyof ResponseEventMap]> {
  private responseListeners = new UnsubscribeMap<ResponseEventMap[keyof ResponseEventMap]['type']>();

  protected responseId: GetResponseId<ResponseEventMap[keyof ResponseEventMap]>;
  protected responseType: GetResponseTypeForRequest<RequestEvent> = getEventResponseType;
  protected responseResult: GetResponseResult<ResponseEventMap[keyof ResponseEventMap], Response>;

  constructor(
    private sender: AsyncRequestSender<RequestEvent>,
    {
      responseId = (e) => e.requestId,
      responseResult = (e) => e.payload,
    }: RequestConnectorOptions<RequestEvent, ResponseEventMap[keyof ResponseEventMap]> = {}
  ) {
    super();
    this.responseId = responseId;
    this.responseResult = responseResult;
  }

  public async request<E extends RequestEvent>(event: E): Promise<Response> {
    const { id: eventId } = await this.sender.send(event);
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

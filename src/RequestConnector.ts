/* eslint-disable @typescript-eslint/no-explicit-any */

import { Id } from './lib/Identifiable';
import { UnsubscribeMap } from './lib/UnsubscribeMap';
import { ClosedConnector } from './ClosedConnector';
import { BaseEvent } from './Events';
import { AsyncRequestSender } from './EventSender.h';
import {
  AnyResponseEvent,
  AnyResponseEventMap,
  ResponseEvent,
  getEventResponseType,
  ResponseTypeFromRequestType,
} from './EventResponse';
import { RequestEvent, UnwrapRequestEvent } from './EventRequest';

type GetResponseId<E extends ResponseEvent> = (e: E) => Id;
type GetResponseResult<E extends ResponseEvent> = (e: E) => E['payload'];
type GetResponseTypeForRequest<E extends BaseEvent> = (e: E) => string;

export type RequestConnectorOptions<RequestEvent extends BaseEvent, ResponseEvent extends AnyResponseEvent> = {
  responseId?: GetResponseId<ResponseEvent>;
  responseResult?: GetResponseResult<ResponseEvent>;
  responseTypeForRequestEvent?: GetResponseTypeForRequest<RequestEvent>;
};

export class RequestConnector<
  ReqEvent extends RequestEvent,
  ResponseEventMap extends AnyResponseEventMap
> extends ClosedConnector<ResponseEventMap[keyof ResponseEventMap]> {
  private responseListeners = new UnsubscribeMap<ResponseEventMap[keyof ResponseEventMap]['type']>();

  protected responseId: GetResponseId<ResponseEventMap[keyof ResponseEventMap]>;
  protected responseType: GetResponseTypeForRequest<UnwrapRequestEvent<ReqEvent>> = getEventResponseType;
  protected responseResult: GetResponseResult<ResponseEventMap[keyof ResponseEventMap]>;

  constructor(
    private sender: AsyncRequestSender<ReqEvent>,
    {
      responseId = (e) => e.requestId,
      responseResult = (e) => e.payload,
    }: RequestConnectorOptions<ReqEvent, ResponseEventMap[keyof ResponseEventMap]> = {}
  ) {
    super();
    this.responseId = responseId;
    this.responseResult = responseResult;
  }

  public async request<E extends UnwrapRequestEvent<ReqEvent>>(
    event: E
  ): Promise<ResponseEventMap[ResponseTypeFromRequestType<E['type']>]['payload']> {
    const { id: eventId } = await this.sender.send(event as any);
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

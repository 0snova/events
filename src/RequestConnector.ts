/* eslint-disable @typescript-eslint/no-explicit-any */

import { GenerateId, Id } from './lib/Identifiable';
import { UnsubscribeMap } from './lib/UnsubscribeMap';
import { ClosedConnector } from './ClosedConnector';
import { BaseEvent } from './Events';
import {
  AnyResponseEvent,
  AnyResponseEventMap,
  ResponseEvent,
  getEventResponseType,
  ResponseTypeFromRequestType,
} from './EventResponse';
import { makeRequestEvent, RequestEvent, UnwrapRequestEvent } from './EventRequest';
import { EventTransfererAsync } from './EventTransferer';

type GetResponseId<E extends ResponseEvent> = (e: E) => Id;
type GetResponseResult<E extends ResponseEvent> = (e: E) => E['payload'];
type GetResponseTypeForRequest<E extends BaseEvent> = (e: E) => string;

export type RequestConnectorOptions<ResponseEvent extends AnyResponseEvent> = {
  responseId?: GetResponseId<ResponseEvent>;
  responseResult?: GetResponseResult<ResponseEvent>;
  generateId?: GenerateId | false;
};

export class RequestConnector<
  ReqEvent extends RequestEvent,
  ResponseEventMap extends AnyResponseEventMap
> extends ClosedConnector<ResponseEventMap[keyof ResponseEventMap]> {
  private lastEventId = 0;

  private responseListeners = new UnsubscribeMap<ResponseEventMap[keyof ResponseEventMap]['type']>();

  protected responseId: GetResponseId<ResponseEventMap[keyof ResponseEventMap]>;
  protected responseType: GetResponseTypeForRequest<UnwrapRequestEvent<ReqEvent>> = getEventResponseType;
  protected responseResult: GetResponseResult<ResponseEventMap[keyof ResponseEventMap]>;
  protected generateId?: GenerateId;

  constructor(
    private transferer: EventTransfererAsync<ReqEvent>,
    {
      responseId = (e) => e.requestId,
      responseResult = (e) => e.payload,
      generateId = () => String(this.lastEventId++),
    }: RequestConnectorOptions<ResponseEventMap[keyof ResponseEventMap]> = {}
  ) {
    super();
    this.responseId = responseId;
    this.responseResult = responseResult;
    this.generateId = generateId !== false ? generateId : undefined;
  }

  public async request<E extends UnwrapRequestEvent<ReqEvent>>(
    event: E
  ): Promise<ResponseEventMap[ResponseTypeFromRequestType<E['type']>]['payload']> {
    const id = this.generateId?.() ?? undefined;
    const { id: eventId } = await this.transferer.transfer(id ? makeRequestEvent(event, id) : (event as any));

    if (!eventId) {
      throw new Error(
        `Id for RequestEvent ${JSON.stringify(
          event
        )} wasn't generated: either provide "generateId" function to RequestConnector, or use EventTransferer that adds id to the event in "send" method.`
      );
    }

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

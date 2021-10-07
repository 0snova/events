import { ClosedConnector } from './ClosedConnector';
import { IdentifiableEvent } from './EventIdentifiable';
import {
  AnyResponseEventMap,
  makeResponseEvent,
  RequestTypeFromResponseType,
  ResponseEvent,
  ResponseTypeFromRequestType,
} from './EventResponse';
import { EventTransfererAsync } from './EventTransferer';

export type ResponseCreator<
  RequestEvent extends IdentifiableEvent,
  EType extends RequestEvent['type'],
  ResponseEventMap extends AnyResponseEventMap
> = (e: RequestEvent & { type: EType }) => Promise<ResponseEventMap[ResponseTypeFromRequestType<EType>]['payload']>;

export type ResponseMap<RequestEvent extends IdentifiableEvent, ResponseEventMap extends AnyResponseEventMap> = {
  [Key in keyof ResponseEventMap as RequestTypeFromResponseType<Key>]: ResponseCreator<
    RequestEvent,
    RequestTypeFromResponseType<Key>,
    ResponseEventMap
  >;
};

export class ResponseConnector<
  RequestEvent extends IdentifiableEvent,
  ResponseEventMap extends AnyResponseEventMap
> extends ClosedConnector<RequestEvent> {
  private lastEventId = 0;
  private responseHandlers: Partial<Record<RequestEvent['type'], any>> = {};

  constructor(
    private transferer: EventTransfererAsync<ResponseEventMap[keyof ResponseEventMap]>,
    responses?: Partial<ResponseMap<RequestEvent, ResponseEventMap>>
  ) {
    super();

    if (typeof responses === 'object') {
      for (const [eventType, eventCreator] of Object.entries<any>(responses)) {
        this.registerResponse(eventType, eventCreator);
      }
    }
  }

  public registerResponse<EType extends RequestEvent['type']>(
    requestEventType: EType,
    responseCreator: ResponseCreator<RequestEvent, EType, ResponseEventMap>,
    afterResponse?: (
      response: ResponseEvent<
        ResponseEventMap[`${EType}::response`]['payload'],
        `${(RequestEvent & {
          type: EType;
        })['type']}::response`
      >
    ) => void
  ) {
    if (this.responseHandlers[requestEventType]) {
      throw new Error(`Unable to register response to event "${requestEventType}": response handler is already exist.`);
    }

    this.responseHandlers[requestEventType] = responseCreator;

    return this.on(requestEventType, async (requestEvent) => {
      const response = makeResponseEvent(
        requestEvent,
        String(`${requestEvent.id}-${this.lastEventId++}`),
        await responseCreator(requestEvent)
      );
      // TODO: fix any
      this.transferer.transfer(response as any);
      if (afterResponse) {
        afterResponse(response);
      }
    });
  }
}

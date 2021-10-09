import { RequestConnectorOptions } from '.';
import { ClosedConnector } from './ClosedConnector';
import { RequestEvent, UnwrapRequestEvent } from './EventRequest';
import { AnyResponseEventMap, isResponseEvent, ResponseEvent } from './EventResponse';
import { EventTransfererAsync } from './EventTransferer';
import { RequestConnector } from './RequestConnector';
import { ResponseConnector, ResponseCreator, ResponseMap } from './ResponseConnector';

export type DuplexConnectorOptions<OutEvents extends ResponseEvent> = {
  requestParams?: RequestConnectorOptions<OutEvents>;
};

/*
  Send outcoming requests and responses to incoming requests
*/
export class DuplexConnector<
  OutReqEvents extends RequestEvent,
  InReqEvents extends RequestEvent,
  OutResponseEventMap extends AnyResponseEventMap,
  InResponseEventMap extends AnyResponseEventMap
> extends ClosedConnector<InReqEvents | InResponseEventMap[keyof InResponseEventMap]> {
  requester: RequestConnector<OutReqEvents, InResponseEventMap>;
  responser: ResponseConnector<InReqEvents, OutResponseEventMap>;

  constructor(
    private transfererRequests: EventTransfererAsync<OutReqEvents>,
    private transfererResponses: EventTransfererAsync<OutResponseEventMap[keyof OutResponseEventMap]>,
    responses?: Partial<ResponseMap<RequestEvent, OutResponseEventMap>>,
    options?: DuplexConnectorOptions<InResponseEventMap[keyof InResponseEventMap]>
  ) {
    super();

    const { requestParams } = options ?? {};

    this.requester = new RequestConnector<OutReqEvents, InResponseEventMap>(transfererRequests, requestParams);
    this.responser = new ResponseConnector<InReqEvents, OutResponseEventMap>(transfererResponses, responses);
  }

  public accept<E extends InReqEvents | InResponseEventMap[keyof InResponseEventMap]>(event: E) {
    if (!event.type) {
      return;
    }

    if (isResponseEvent(event)) {
      this.requester.accept(event as InResponseEventMap[keyof InResponseEventMap]);
    } else {
      this.responser.accept(event as InReqEvents);
    }

    super.accept(event);
  }

  public request<E extends UnwrapRequestEvent<OutReqEvents>>(event: E) {
    return this.requester.request(event);
  }

  public response<EType extends InReqEvents['type']>(
    eventType: EType,
    responseCreator: ResponseCreator<InReqEvents, EType, OutResponseEventMap>,
    afterResponse?: (response: ResponseEvent) => void
  ) {
    return this.responser.registerResponse(eventType, responseCreator, afterResponse);
  }
}

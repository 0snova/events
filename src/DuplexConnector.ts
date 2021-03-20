import { ClosedConnector } from './ClosedConnector';
import { RequestEvent } from './EventRequest';
import { AnyResponseEventMap, isResponseEvent } from './EventResponse';
import { EventTransfererAsync } from './EventTransferer';
import { RequestConnector } from './RequestConnector';
import { ResponseConnector, ResponseMap } from './ResponseConnector';

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
    responses: ResponseMap<RequestEvent, OutResponseEventMap>
  ) {
    super();

    this.requester = new RequestConnector<OutReqEvents, InResponseEventMap>(transfererRequests);
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
}

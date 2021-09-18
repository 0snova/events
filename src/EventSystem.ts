import { DuplexConnector } from './DuplexConnector';
import { RequestEvent } from './EventRequest';
import { AnyResponseEventMap } from './EventResponse';

export interface EventSystemParams<
  OutReqEvents extends RequestEvent,
  InReqEvents extends RequestEvent,
  OutResponseEventMap extends AnyResponseEventMap,
  InResponseEventMap extends AnyResponseEventMap
> {
  onBoot(
    system: Pick<
      DuplexConnector<OutReqEvents, InReqEvents, OutResponseEventMap, InResponseEventMap>,
      'request' | 'response' | 'on'
    >
  ): void;
}

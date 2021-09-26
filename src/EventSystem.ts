import { DuplexConnector } from './DuplexConnector';
import { RequestEvent } from './EventRequest';
import { AnyResponseEventMap } from './EventResponse';

export interface EventSystem<
  OutReqEvents extends RequestEvent,
  InReqEvents extends RequestEvent,
  OutResponseEventMap extends AnyResponseEventMap,
  InResponseEventMap extends AnyResponseEventMap
> extends Pick<DuplexConnector<OutReqEvents, InReqEvents, OutResponseEventMap, InResponseEventMap>, 'request' | 'on'> {}

export interface EventSystemParams<
  OutReqEvents extends RequestEvent,
  InReqEvents extends RequestEvent,
  OutResponseEventMap extends AnyResponseEventMap,
  InResponseEventMap extends AnyResponseEventMap
> {
  onBoot(system: EventSystem<OutReqEvents, InReqEvents, OutResponseEventMap, InResponseEventMap>): void;
}

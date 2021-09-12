export type { BaseEvent, EventCreator } from './Events';
export { makeEventCreator, eventFactoryWrapper } from './Events';

export type {
  AnyIdentifiableEvent,
  CastToIdentifiableEvent,
  IdentifiableEvent,
  PickIdentifiableEvent,
} from './EventIdentifiable';
export { makeIdentifiableEvent } from './EventIdentifiable';

export type { InferResponseEventMap } from './EventResponse';
export { makeResponseEvent } from './EventResponse';

export type { CastToRequestEvent, RequestEvent, UnwrapRequestEvent } from './EventRequest';
export { makeRequestEvent } from './EventRequest';

export type { InferEventFromCreatorsMap } from './EventMap';

/* Event transfering */
export type { EnhanceEvent, EventTransferer, EventTransfererAsync } from './EventTransferer';
export { eventIdentity } from './EventTransferer';
export { LocalNextTickTransferer } from './EventTransfererLocalNextTick';
export type {
  MessageListenerProvider,
  PostMessageProvider,
  PostMessageMessageWrapper,
} from './EventTransfererPostMessage';
export { PostMessageTransferer } from './EventTransfererPostMessage';
export { createPostMessageChannel } from './ChannelPostMessage';

/* Connectors core */
export type { BaseConnector } from './Connector.h';
export { ClosedConnector } from './ClosedConnector';

/* Specific connectors */
export type { RequestConnectorOptions } from './RequestConnector';
export { RequestConnector } from './RequestConnector';
export { ResponseConnector } from './ResponseConnector';
export { DuplexConnector } from './DuplexConnector';
export type { DuplexConnectorOptions } from './DuplexConnector';

/* Utiulities */
export { propagateEvents } from './PropagateEvent';

export {
  makeWebWorkerConnector,
  makeWebWorkerPostMessageProvider,
  propagateWebWorkerEvents,
} from './WebWorkerConnector';

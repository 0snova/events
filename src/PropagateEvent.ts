import { BaseConnector } from './Connector.h';
import { Unsubscribe } from './lib/Unsubscribe';
import { AnyEvent } from './Events';

/*
  If `origin` connector will recieve any Event of `eventTypes` it will be propagated
  to the `target` connector. 
*/
export function propagateEvents<Events extends AnyEvent, E extends Events['type'] = Events['type']>(
  origin: BaseConnector<Events>,
  target: BaseConnector<Events>,
  eventTypes: E[]
): Unsubscribe {
  const unsubsribes: Unsubscribe[] = [];
  for (const eventType of eventTypes) {
    unsubsribes.push(
      origin.on(eventType, (payload) => {
        target.accept(payload);
      })
    );
  }

  return () => {
    unsubsribes.forEach((unsubscribe) => unsubscribe());
  };
}

import { Unsubscribe } from './lib/Unsubscribe';
import { ListenersMap } from './lib/ListenersMap';

import { BaseConnector } from './Connector.h';
import { AnyEvent, EventListener } from './Events';

/* Connector with no outcoming connections */
export class ClosedConnector<Event extends AnyEvent> implements BaseConnector<Event> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected listeners: ListenersMap<Event['type'], EventListener<Event, any>>;

  constructor() {
    this.listeners = new ListenersMap();
  }

  on<E extends Event['type']>(eventType: E | '*', listener: EventListener<Event, E>): Unsubscribe {
    return this.listeners.add(eventType, listener);
  }

  accept<E extends Event>(event: E) {
    const listeners = this.listeners.getExecuteList(event.type);

    if (listeners) {
      listeners.forEach((l) => l(event));
    }
  }
}

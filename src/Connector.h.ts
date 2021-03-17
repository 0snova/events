import { Unsubscribe } from './lib/Unsubscribe';

import { AnyEvent, EventListener } from './Events';

export interface BaseConnector<ListenEvent extends AnyEvent> {
  accept<E extends ListenEvent>(event: E): void;
  on<E extends ListenEvent['type']>(eventType: E, listener: EventListener<ListenEvent, E>): Unsubscribe;
}

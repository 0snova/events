import { AnyEvent } from './Events';

export interface EventSender<OutEvent extends AnyEvent, T = void> {
  send<E extends OutEvent>(event: E): T;
}

export type AsyncTransferer<Event extends AnyEvent> = EventSender<Event, Promise<Event>>;

import { AnyEvent } from './Events';
import { RequestEvent, UnwrapRequestEvent } from './EventRequest';
import { ResponseEvent } from './EventResponse';

export interface EventSender<OutEvent extends AnyEvent, T = void> {
  send<E extends OutEvent>(event: E): T;
}

export type AsyncSender<Event extends AnyEvent> = EventSender<Event, Promise<Event>>;
export type AsyncRequestSender<Event extends RequestEvent> = EventSender<UnwrapRequestEvent<Event>, Promise<Event>>;
export type AsyncResponseSender<Event extends ResponseEvent> = EventSender<Event, Promise<Event>>;

import { AnyEvent } from './Events';
import { CastToIdentifiableEvent } from './EventIdentifiable';
import { EventResponse } from './EventResponse';

export interface EventSender<OutEvent extends AnyEvent, T = void> {
  send<E extends OutEvent>(event: E): T;
}

export type AsyncRequestSender<Event extends AnyEvent> = EventSender<Event, Promise<CastToIdentifiableEvent<Event>>>;
export type AsyncResponseSender<Event extends EventResponse> = EventSender<Event, Promise<Event>>;

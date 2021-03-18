import { AnyEvent } from './Events';
import { CastToIdentifiableEvent } from './EventIdentifiable';

export interface EventSender<OutEvent extends AnyEvent, T = void> {
  send<E extends OutEvent>(event: E): T;
}

export type AsyncEventSenderWithId<OutEvent extends AnyEvent> = EventSender<
  OutEvent,
  Promise<CastToIdentifiableEvent<OutEvent>>
>;

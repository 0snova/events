import { Id } from './lib/Identifiable';
import { CastToIdentifiableEvent, makeIdentifiableEvent } from './EventIdentifiable';
import { AnyEvent } from './Events';
import { AsyncEventSenderWithId } from './EventSender.h';
import { ClosedConnector } from './ClosedConnector';

export type Send<Event extends AnyEvent> = (
  target: ClosedConnector<CastToIdentifiableEvent<Event>>,
  event: CastToIdentifiableEvent<Event>
) => void;

export function sendLocallyASAP<Event extends AnyEvent>(
  target: ClosedConnector<CastToIdentifiableEvent<Event>>,
  event: CastToIdentifiableEvent<Event>
) {
  setTimeout(() => {
    target.accept(event);
  }, 0);
}

/*
  Make Identifiable Event from Event and send it to the target.
*/
export class EventSender<Event extends AnyEvent> implements AsyncEventSenderWithId<Event> {
  private lastEventId = 0;

  constructor(
    protected target: ClosedConnector<CastToIdentifiableEvent<Event>>,
    protected sender: Send<Event> = sendLocallyASAP,
    protected generateId: () => Id = () => String(this.lastEventId++)
  ) {}

  async send<E extends Event>(event: E) {
    const id = this.generateId();
    const eventWithId = makeIdentifiableEvent(event, id);

    this.sender(this.target, eventWithId);

    return eventWithId;
  }
}

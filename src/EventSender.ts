import { Id } from './lib/Identifiable';
import { CastToIdentifiableEvent, makeIdentifiableEvent } from './EventIdentifiable';
import { AnyEvent } from './Events';
import { AsyncRequestSender, AsyncResponseSender } from './EventSender.h';
import { ClosedConnector } from './ClosedConnector';
import { EventResponse } from './EventResponse';

export type SendRequest<Event extends AnyEvent> = (
  target: ClosedConnector<CastToIdentifiableEvent<Event>>,
  event: CastToIdentifiableEvent<Event>
) => void;

export type SendResponse<Event extends EventResponse> = (target: ClosedConnector<Event>, event: Event) => void;

export function sendLocallyASAP<Event extends AnyEvent>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: ClosedConnector<any>,
  event: CastToIdentifiableEvent<Event>
) {
  setTimeout(() => {
    target.accept(event);
  }, 0);
}

/*
  Make Identifiable Event from Event and send it to the target.
*/
export class EventRequestSender<Event extends AnyEvent> implements AsyncRequestSender<Event> {
  private lastEventId = 0;

  constructor(
    protected target: ClosedConnector<CastToIdentifiableEvent<Event>>,
    protected sender: SendRequest<Event> = sendLocallyASAP,
    protected generateId: () => Id = () => String(this.lastEventId++)
  ) {}

  async send<E extends Event>(event: E) {
    const id = this.generateId();
    const eventWithId = makeIdentifiableEvent(event, id);

    this.sender(this.target, eventWithId);

    return eventWithId;
  }
}

export class EventResponseSender<Event extends EventResponse> implements AsyncResponseSender<Event> {
  private lastEventId = 0;

  constructor(
    protected target: ClosedConnector<Event>,
    protected sender: SendResponse<Event> = sendLocallyASAP,
    protected generateId: () => Id = () => String(this.lastEventId++)
  ) {}

  async send<E extends Event>(event: E) {
    this.sender(this.target, event);

    return event;
  }
}

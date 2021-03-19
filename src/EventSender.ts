import { Id } from './lib/Identifiable';
import { AnyEvent } from './Events';
import { AsyncRequestSender, AsyncResponseSender, AsyncSender } from './EventSender.h';
import { ClosedConnector } from './ClosedConnector';
import { ResponseEvent } from './EventResponse';
import { CastToRequestEvent, makeRequestEvent, RequestEvent, UnwrapRequestEvent } from './EventRequest';

export type SendRequest<Event extends RequestEvent> = (target: ClosedConnector<Event>, event: Event) => void;
export type SendResponse<Event extends ResponseEvent> = (target: ClosedConnector<Event>, event: Event) => void;
export type SendEvent<Event extends AnyEvent> = (target: ClosedConnector<Event>, event: Event) => void;

export function sendLocallyASAP<Event extends AnyEvent>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: ClosedConnector<any>,
  event: Event
) {
  setTimeout(() => {
    target.accept(event);
  }, 0);
}

/*
  Make Identifiable Event from Event and send it to the target.
*/
export class EventRequestSender<Event extends RequestEvent> implements AsyncRequestSender<Event> {
  private lastEventId = 0;

  constructor(
    protected target: ClosedConnector<Event>,
    protected sender: SendRequest<Event> = sendLocallyASAP,
    protected generateId: () => Id = () => String(this.lastEventId++)
  ) {}

  async send<E extends UnwrapRequestEvent<Event>>(event: E) {
    const id = this.generateId();
    const requestEvent = makeRequestEvent(event, id) as Event;

    this.sender(this.target, requestEvent);

    return requestEvent;
  }
}

export class EventResponseSender<Event extends ResponseEvent> implements AsyncResponseSender<Event> {
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

import { AnyEvent } from './Events';
import { AsyncTransferer } from './EventSender.h';
import { ClosedConnector } from './ClosedConnector';

export class LocalNextTickTransferer<Event extends AnyEvent> implements AsyncTransferer<Event> {
  constructor(private target: ClosedConnector<Event>) {}

  async send<E extends Event>(event: E) {
    setTimeout(() => {
      this.target.accept(event);
    }, 0);

    return event;
  }
}

export interface PostMessageProvider {
  postMessage(message: any): void;
}

export class PostMessageTransferer<Event extends AnyEvent> implements AsyncTransferer<Event> {
  constructor(private provider: PostMessageProvider) {}

  async send<E extends Event>(event: E) {
    this.provider.postMessage(event);

    return event;
  }
}

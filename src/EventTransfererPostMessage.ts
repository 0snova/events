import { AnyEvent } from './Events';
import { EnhanceEvent, eventIdentity, EventTransfererAsync } from './EventTransferer';

export type PostMessageMessageWrapper<T = any> = {
  data: T;
};

export interface PostMessageProvider<Event extends AnyEvent = AnyEvent> {
  postMessage(message: Event): void;
}

export interface MessageListenerProvider<T extends AnyEvent = AnyEvent> {
  addEventListener(type: 'message', listener: (innerMessage: PostMessageMessageWrapper<T>) => void): void;
}

export class PostMessageTransferer<Event extends AnyEvent, FinalEvent extends Event = Event>
  implements EventTransfererAsync<Event, FinalEvent> {
  constructor(
    private provider: PostMessageProvider<FinalEvent>,
    private enhanceEvent: EnhanceEvent<Event, FinalEvent> = eventIdentity as EnhanceEvent<Event, FinalEvent>
  ) {}

  async transfer<E extends Event>(event: E) {
    const finalEvent = this.enhanceEvent(event);
    this.provider.postMessage(finalEvent);

    return finalEvent;
  }

  setEnhancer(enhancer: EnhanceEvent<Event, FinalEvent>) {
    this.enhanceEvent = enhancer;
  }
}

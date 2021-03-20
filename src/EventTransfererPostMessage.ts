import { AnyEvent } from './Events';
import { EnhanceEvent, eventIdentity, EventTransfererAsync } from './EventTransferer';

export interface PostMessageProvider<T = any> {
  postMessage(message: T): void;
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

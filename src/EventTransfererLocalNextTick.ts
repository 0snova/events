import { AnyEvent } from './Events';
import { ClosedConnector } from './ClosedConnector';
import { EnhanceEvent, eventIdentity, EventTransfererAsync } from './EventTransferer';

export class LocalNextTickTransferer<Event extends AnyEvent, FinalEvent extends Event = Event>
  implements EventTransfererAsync<Event, FinalEvent> {
  constructor(
    private target: ClosedConnector<FinalEvent>,
    private enhanceEvent: EnhanceEvent<Event, FinalEvent> = eventIdentity as EnhanceEvent<Event, FinalEvent>
  ) {}

  async transfer<E extends Event>(event: E) {
    const finalEvent = this.enhanceEvent(event);
    setTimeout(() => {
      this.target.accept(finalEvent);
    }, 0);

    return finalEvent;
  }

  setEnhancer(enhancer: EnhanceEvent<Event, FinalEvent>) {
    this.enhanceEvent = enhancer;
  }
}

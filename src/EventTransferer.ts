import { AnyEvent } from './Events';

export type EnhanceEvent<E extends AnyEvent, R extends E> = (event: E) => R;

export interface EventTransferer<OriginalEvent extends AnyEvent, EnhancedEvent extends OriginalEvent = OriginalEvent> {
  transfer<E extends OriginalEvent>(event: E): EnhancedEvent;
  setEnhancer(enhancer: EnhanceEvent<OriginalEvent, EnhancedEvent>): void;
}

export interface EventTransfererAsync<
  OriginalEvent extends AnyEvent,
  EnhancedEvent extends OriginalEvent = OriginalEvent
> {
  transfer<E extends OriginalEvent>(event: E): Promise<EnhancedEvent>;
  setEnhancer(enhancer: EnhanceEvent<OriginalEvent, EnhancedEvent>): void;
}

export function eventIdentity<E extends AnyEvent>(event: E) {
  return event;
}

// TODO: add BaseEventTransferer

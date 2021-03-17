/* eslint-disable @typescript-eslint/no-explicit-any */
import { Identifiable } from './Identifiable';

export type BaseEvent<P = any, T extends string = string> = {
  type: T;
  payload: P;
};

export type AnyEvent = BaseEvent<any, string>;

export type IdentifiableEvent<P = any, T extends string = string> = BaseEvent<P, T> & Identifiable;
export type AnyIdentifiableEvent = IdentifiableEvent<any, string>;
export type PickIdentifiableEvent<Event extends AnyEvent> = Event extends AnyIdentifiableEvent ? Event : never;

export type EventListener<Event extends AnyEvent, E extends Event['type']> = (e: Event & { type: E }) => void;
export type AnyEventListener = EventListener<AnyEvent, string>;

export type EventCreator<P, T extends string> = (payload: P) => BaseEvent<P, T>;

export function eventFactoryWrapper<T extends string>(type: T) {
  function eventFactory<P = any>(): EventCreator<P, T> {
    return (payload: P) => {
      return {
        type,
        payload,
      } as const;
    };
  }

  return eventFactory;
}

export function makeEventCreator<P, T extends string = string>(type: T): EventCreator<P, T> {
  return eventFactoryWrapper<T>(type)<P>();
}

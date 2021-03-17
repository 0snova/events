import { Identifiable } from './Identifiable';

export type BaseEvent<P = unknown, T extends string = string> = {
  type: T;
  payload: P;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyEvent = BaseEvent<any, string>;

export type IdentifiableEvent<P = unknown, T extends string = string> = BaseEvent<P, T> & Identifiable;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyIdentifiableEvent = IdentifiableEvent<any, string>;

export type PickIdentifiableEvent<Event extends AnyEvent> = Event extends AnyIdentifiableEvent ? Event : never;

export type EventCreator<P, T extends string> = (payload: P) => BaseEvent<P, T>;

export function eventFactoryWrapper<T extends string>(type: T) {
  function eventFactory<P = unknown>(): EventCreator<P, T> {
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

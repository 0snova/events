/* eslint-disable @typescript-eslint/no-explicit-any */
export type BaseEvent<P = any, T extends string = string> = {
  type: T;
  payload: P;
};

export type AnyEvent = BaseEvent<any, string>;

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
  return eventFactoryWrapper(type)<P>();
}

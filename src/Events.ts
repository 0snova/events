export type Unsubscribe = () => void;

export type BaseEvent<P = unknown, T extends string = string> = {
  type: T;
  payload: P;
};

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

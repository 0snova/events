import { AnyEvent, BaseEvent } from './Events';

export type DataEvent<D = any, T extends string = string> = BaseEvent<{ value: D }, T>;

export type CastToDataEvent<E extends AnyEvent> = DataEvent<E['payload'], E['type']>;
export type UnwrapDataEvent<E extends DataEvent> = E extends DataEvent<infer P, infer T> ? BaseEvent<P, T> : E;

export function isDataEvent<E extends AnyEvent>(e: E) {
  return e.type.endsWith(`::data`);
}

export function makeDataEvent<D = any, T extends string = string>(type: T, value: D) {
  return {
    type,
    payload: {
      value,
    },
  } as DataEvent<D, T>;
}

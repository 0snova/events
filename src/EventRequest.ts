import { IdentifiableEvent, makeIdentifiableEvent } from './EventIdentifiable';
import { BaseEvent } from './Events';
import { Id } from './lib/Identifiable';

export type RequestEvent<P = any, T extends string = string> = IdentifiableEvent<P, T>;

export type CastToRequestEvent<E extends BaseEvent> = E extends BaseEvent<infer P, infer T> ? RequestEvent<P, T> : E;
export type UnwrapRequestEvent<E extends RequestEvent> = E extends RequestEvent<infer P, infer T> ? BaseEvent<P, T> : E;

export function makeRequestEvent<E extends BaseEvent>(baseEvent: E, id: Id) {
  return makeIdentifiableEvent(baseEvent, id) as CastToRequestEvent<E>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyEvent, BaseEvent } from './Events';
import { Id, Identifiable } from './lib/Identifiable';

export type IdentifiableEvent<P = any, T extends string = string> = BaseEvent<P, T> & Identifiable;
export type AnyIdentifiableEvent = IdentifiableEvent<any, string>;
export type PickIdentifiableEvent<Event extends AnyEvent> = Event extends AnyIdentifiableEvent ? Event : never;

export type CastToIdentifiableEvent<E extends AnyEvent> = E extends BaseEvent<infer P, infer T>
  ? IdentifiableEvent<P, T>
  : never;

export function makeIdentifiableEvent<E extends AnyEvent>(baseEvent: E, id: Id) {
  return ({ ...baseEvent, id } as unknown) as CastToIdentifiableEvent<E>;
}

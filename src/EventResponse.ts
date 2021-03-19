/* eslint-disable @typescript-eslint/no-explicit-any */

import { Id } from './lib/Identifiable';
import { AnyEvent, BaseEvent } from './Events';
import { AnyIdentifiableEvent, IdentifiableEvent } from './EventIdentifiable';

export type IdentifiableResponse = {
  requestId: Id;
};

export type EventResponse<P = any, T extends string = string> = IdentifiableEvent<P, T> & IdentifiableResponse;
export type AnyEventResponse = EventResponse<any, string>;

export type CastToResponseEvent<E extends AnyEvent> = E extends BaseEvent<infer P, infer T>
  ? EventResponse<P, T>
  : never;

export type InferResponseEventMap<RequestEvent extends BaseEvent, Map extends Record<RequestEvent['type'], any>> = {
  [Key in keyof Map as `${Key & string}::response`]: EventResponse<Map[Key], `${Key & string}::response`>;
};

export type AnyResponseEventMap = {
  [key: string]: AnyEventResponse;
};

export function getEventResponseType<E extends AnyEvent>(event: E) {
  return `${event.type}::response`;
}

export function makeResponseEvent<RequestEvent extends AnyIdentifiableEvent, P = unknown>(
  requestEvent: RequestEvent,
  id: Id,
  payload: P
) {
  return {
    type: getEventResponseType(requestEvent),
    id,
    requestId: requestEvent.id,
    payload,
  } as EventResponse<P, `${RequestEvent['type']}::response`>;
}

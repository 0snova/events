/* eslint-disable @typescript-eslint/no-explicit-any */

import { Id } from './lib/Identifiable';
import { AnyEvent, BaseEvent } from './Events';
import { AnyIdentifiableEvent, IdentifiableEvent } from './EventIdentifiable';

export type IdentifiableResponse = {
  requestId: Id;
};

export type ResponseEvent<P = any, T extends string = string> = IdentifiableEvent<P, T> & IdentifiableResponse;
export type AnyResponseEvent = ResponseEvent<any, string>;

export type CastToResponseEvent<E extends AnyEvent> = ResponseEvent<E['payload'], E['type']>;

export type UnwrapResponseEvent<E extends ResponseEvent> = E extends ResponseEvent<infer P, infer T>
  ? BaseEvent<P, T>
  : E;

export type InferResponseEventMap<RequestEvent extends BaseEvent, Map extends Record<RequestEvent['type'], any>> = {
  [Key in keyof Map as `${Key & string}::response`]: ResponseEvent<Map[Key], `${Key & string}::response`>;
};

export type AnyResponseEventMap = {
  [key: string]: AnyResponseEvent;
};

export type RequestTypeFromResponseType<T> = T extends `${infer U}::response` ? U : never;
export type ResponseTypeFromRequestType<T extends string> = `${T}::response`;

export function getEventResponseType<E extends AnyEvent>(event: E) {
  return `${event.type}::response`;
}

export function makeResponseEvent<RequestEvent extends AnyIdentifiableEvent, P = any>(
  requestEvent: RequestEvent,
  id: Id,
  payload: P
) {
  return {
    type: getEventResponseType(requestEvent),
    id,
    requestId: requestEvent.id,
    payload,
  } as ResponseEvent<P, `${RequestEvent['type']}::response`>;
}

import { AnyFn, InferObjectFunctionFields } from './lib/types';
import { BaseEvent, EventCreator } from './Events';

type EventCreatorsMap<AnyMap extends Record<string, AnyFn>> = {
  [key in keyof AnyMap]: AnyMap[key] extends EventCreator<infer P, infer T> ? EventCreator<P, T> : never;
};

export type EventMap<EventCreatorMap> = {
  [key in keyof EventCreatorMap]: EventCreatorMap[key] extends EventCreator<infer P, infer T> ? BaseEvent<P, T> : never;
};

export type InferEventCreatorsMap<M extends Record<string, AnyFn>> = InferObjectFunctionFields<EventCreatorsMap<M>>;

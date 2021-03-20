import { InferEventFromCreatorsMap } from '../../EventMap';
import { CastToRequestEvent } from '../../EventRequest';
import { InferResponseEventMap } from '../../EventResponse';
import { makeEventCreator } from '../../Events';
import { Command } from './command';

const pingEvent = makeEventCreator<void, 'ping'>('ping');
const commandEvent = makeEventCreator<Command<any>, 'command'>('command');

export const events = { pingEvent, commandEvent };

type _Events = InferEventFromCreatorsMap<typeof events>;
export type Events = CastToRequestEvent<_Events>;

export type ResponseEventMap = InferResponseEventMap<
  Events,
  {
    ping: { result: string };
    command: any;
  }
>;

export type ResponseEvents = ResponseEventMap[keyof ResponseEventMap];

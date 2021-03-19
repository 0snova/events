import { MessageChannel } from 'worker_threads';

import { InferEventFromCreatorsMap } from '../EventMap';
import { CastToRequestEvent } from '../EventRequest';
import { InferResponseEventMap } from '../EventResponse';
import { makeEventCreator } from '../Events';
import { PostMessageTransferer } from '../EventSender';
import { RequestConnector } from '../RequestConnector';
import { ResponseConnector } from '../ResponseConnector';

test('should use PostMessageProvider to send events', async () => {
  const eventKEK = makeEventCreator<string, 'KEK'>('KEK');
  const eventLUL = makeEventCreator<number, 'LUL'>('LUL');
  const events = { eventKEK, eventLUL };

  type BaseEvents = InferEventFromCreatorsMap<typeof events>;
  type RequestEvents = CastToRequestEvent<BaseEvents>;

  type ResponseEventMap = InferResponseEventMap<
    BaseEvents,
    {
      KEK: string;
      LUL: number;
    }
  >;

  const { port1, port2 } = new MessageChannel();

  const requester = new RequestConnector<RequestEvents, ResponseEventMap>(
    new PostMessageTransferer<RequestEvents>({
      postMessage(msg: any) {
        port2.postMessage(msg);
      },
    })
  );

  const responser = new ResponseConnector<RequestEvents, ResponseEventMap>(
    new PostMessageTransferer<ResponseEventMap[keyof ResponseEventMap]>({
      postMessage(msg: any) {
        port1.postMessage(msg);
      },
    }),
    {
      LUL: async (e) => {
        return e.payload + 69;
      },
      KEK: async (e) => {
        return `request payload: ${e.payload}`;
      },
    }
  );

  port1.on('message', (msg) => {
    responser.accept(msg);
  });

  port2.on('message', (msg) => {
    requester.accept(msg);
  });

  expect(await requester.request(events.eventKEK('a'))).toMatchInlineSnapshot(`"request payload: a"`);
  expect(await requester.request(events.eventLUL(420))).toMatchInlineSnapshot(`489`);
});

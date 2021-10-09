import { MessageChannel } from 'worker_threads';
import { DuplexConnector } from '../DuplexConnector';
import { InferEventFromCreatorsMap } from '../EventMap';
import { CastToRequestEvent } from '../EventRequest';
import { InferResponseEventMap } from '../EventResponse';
import { makeEventCreator } from '../Events';
import { PostMessageTransferer } from '../EventTransfererPostMessage';

test('should send request and recieve response', async () => {
  const conn1Event = makeEventCreator<number, 'event-1'>('event-1');
  const conn1Event2 = makeEventCreator<string, 'event-12'>('event-12');

  const conn2Event = makeEventCreator<number, 'event-2'>('event-2');
  const events1 = { conn1Event, conn1Event2 };
  const events2 = { conn2Event };

  type Events1 = InferEventFromCreatorsMap<typeof events1>;
  type SentEvents1 = CastToRequestEvent<Events1>;

  type Events2 = InferEventFromCreatorsMap<typeof events2>;
  type SentEvents2 = CastToRequestEvent<Events2>;

  type ResponseEventMap1 = InferResponseEventMap<
    Events2,
    {
      'event-2': number;
    }
  >;
  type ResponseEvent1 = ResponseEventMap1[keyof ResponseEventMap1];

  type ResponseEventMap2 = InferResponseEventMap<
    Events1,
    {
      'event-1': number;
      'event-12': string;
    }
  >;
  type ResponseEvent2 = ResponseEventMap2[keyof ResponseEventMap2];

  const { port1, port2 } = new MessageChannel();

  const connector1PMT = new PostMessageTransferer<SentEvents1 | ResponseEvent1>({
    postMessage(message) {
      port2.postMessage(message);
    },
  });

  const connector2PMT = new PostMessageTransferer<SentEvents2 | ResponseEvent2>({
    postMessage(message) {
      port1.postMessage(message);
    },
  });

  const connector1 = new DuplexConnector<SentEvents1, SentEvents2, ResponseEventMap1, ResponseEventMap2>(
    connector1PMT as PostMessageTransferer<SentEvents1>,
    connector1PMT as PostMessageTransferer<ResponseEvent1>,
    {
      'event-2'(e) {
        return Promise.resolve(e.payload + 1);
      },
    }
  );

  const connector2 = new DuplexConnector<SentEvents2, SentEvents1, ResponseEventMap2, ResponseEventMap1>(
    connector2PMT as PostMessageTransferer<SentEvents2>,
    connector2PMT as PostMessageTransferer<ResponseEvent2>,
    {
      'event-1'(e) {
        return Promise.resolve(e.payload + 1);
      },
    }
  );

  port1.on('message', (e) => {
    connector2.accept(e);
  });

  port2.on('message', (e) => {
    connector1.accept(e);
  });

  const p = connector1.requester.request({
    type: 'event-1',
    payload: 42,
  });

  const p2 = connector2.requester.request({
    type: 'event-2',
    payload: 69,
  });

  const answers = await Promise.all([p, p2]);

  expect(answers[0]).toMatchInlineSnapshot(`43`);
  expect(answers[1]).toMatchInlineSnapshot(`70`);
});

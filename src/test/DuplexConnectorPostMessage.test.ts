import { MessageChannel } from 'worker_threads';

import { createPostMessageChannel } from '../ChannelPostMessage';
import { DuplexConnector } from '../DuplexConnector';
import { MessageListenerProvider, PostMessageProvider, PostMessageTransferer } from '../EventTransfererPostMessage';
import { CommandDispatcher, initialize } from './mocks/command';
import { events, Events, ResponseEventMap, ResponseEvents } from './mocks/events';

export function createConnector(ctx: PostMessageProvider<any> & MessageListenerProvider<any>) {
  const cmdDispatcher = new CommandDispatcher({
    initialize,
  });

  const channel = createPostMessageChannel<Events | ResponseEvents, Events | ResponseEvents>(
    ctx,
    ctx,
    '_EVENT_CONNECTOR_'
  );

  channel.transferer;

  const connector = new DuplexConnector<Events, Events, ResponseEventMap, ResponseEventMap>(
    channel.transferer as PostMessageTransferer<Events>,
    channel.transferer as PostMessageTransferer<ResponseEvents>,
    {
      ping() {
        return Promise.resolve({ result: 'pong' });
      },
      async command(event) {
        const result = await cmdDispatcher.dispatch(event.payload);
        return result;
      },
    }
  );

  channel.propagateEvents(connector);

  return connector;
}

test('should send and recieve events', async () => {
  const { port1, port2 } = new MessageChannel();

  const worker1 = {
    postMessage(msg: any) {
      port2.postMessage({ data: msg });
    },
    addEventListener(event: 'message', listener: any) {
      port1.addListener('message', listener);
    },
  };

  const worker2 = {
    postMessage(msg: any) {
      port1.postMessage({ data: msg });
    },
    addEventListener(event: 'message', listener: any) {
      port2.addListener('message', listener);
    },
  };

  const connector1 = createConnector(worker1);
  const connector2 = createConnector(worker2);

  const p = [connector1.requester.request(events.pingEvent()), connector2.requester.request(events.pingEvent())];

  const [r1, r2] = await Promise.all(p);

  expect(r1).toMatchInlineSnapshot(`
    Object {
      "result": "pong",
    }
  `);
  expect(r2).toMatchInlineSnapshot(`
    Object {
      "result": "pong",
    }
  `);
});

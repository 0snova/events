import { PostMessageProvider } from '.';
import { AnyEvent } from './Events';
import { PostMessageTransferer } from './EventTransfererPostMessage';

it('should run "postMessage" on every event', () => {
  const eventQ: AnyEvent[] = [];

  const p: PostMessageProvider = {
    postMessage(message) {
      eventQ.push(message);
    },
  };
  const t = new PostMessageTransferer(p);

  t.transfer({
    type: 'POST_MESSAGE_1',
    payload: 1,
  });
  t.transfer({
    type: 'POST_MESSAGE_2',
    payload: 2,
  });

  expect(eventQ).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": 1,
        "type": "POST_MESSAGE_1",
      },
      Object {
        "payload": 2,
        "type": "POST_MESSAGE_2",
      },
    ]
  `);
});

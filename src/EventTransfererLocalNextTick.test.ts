import { ClosedConnector } from '.';
import { AnyEvent } from './Events';
import { LocalNextTickTransferer } from './EventTransfererLocalNextTick';

it('event should be recieved by connector on the next tick', () => {
  const c = new ClosedConnector();
  const t = new LocalNextTickTransferer(c);

  const executionOrder: Array<AnyEvent['type']> = [];

  return new Promise((resolve) => {
    c.on('LOCAL_NEXT_TICK_EVENT', (e) => {
      executionOrder.push(e.type);
      expect(executionOrder).toMatchInlineSnapshot(`
        Array [
          "SYNC_EVENT_AFTER_TRANSFER",
          "LOCAL_NEXT_TICK_EVENT",
        ]
      `);
      return resolve(0);
    });

    t.transfer({
      payload: 'hello',
      type: 'LOCAL_NEXT_TICK_EVENT',
    });

    executionOrder.push('SYNC_EVENT_AFTER_TRANSFER');
  });
});

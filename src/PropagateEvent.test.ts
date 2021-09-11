import { ClosedConnector } from '.';
import { AnyEvent } from './Events';
import { propagateEvents } from './PropagateEvent';

it('should propagate to the target only specified events', () => {
  const o = new ClosedConnector();
  const t = new ClosedConnector();
  propagateEvents(o, t, ['PROPAGATE_EVENT']);

  const propagatedEvents: AnyEvent[] = [];

  t.on('PROPAGATE_EVENT', (event) => propagatedEvents.push(event));
  t.on('DONT_PROPAGATE_EVENT', (event) => propagatedEvents.push(event));

  o.accept({
    type: 'PROPAGATE_EVENT',
    payload: 'PROPAGATE_EVENT_PAYLOAD_1',
  });

  o.accept({
    type: 'DONT_PROPAGATE_EVENT',
    payload: 'DONT_PROPAGATE_EVENT_PAYLOAD',
  });

  o.accept({
    type: 'PROPAGATE_EVENT',
    payload: 'PROPAGATE_EVENT_PAYLOAD_2',
  });

  expect(propagatedEvents).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": "PROPAGATE_EVENT_PAYLOAD_1",
        "type": "PROPAGATE_EVENT",
      },
      Object {
        "payload": "PROPAGATE_EVENT_PAYLOAD_2",
        "type": "PROPAGATE_EVENT",
      },
    ]
  `);
});

it('should stop propagation when unsubscriber is called', () => {
  const o = new ClosedConnector();
  const t = new ClosedConnector();
  const stopPropagation = propagateEvents(o, t, ['PROPAGATE_EVENT']);

  const propagatedEvents: AnyEvent[] = [];

  t.on('PROPAGATE_EVENT', (event) => propagatedEvents.push(event));
  t.on('DONT_PROPAGATE_EVENT', (event) => propagatedEvents.push(event));

  o.accept({
    type: 'PROPAGATE_EVENT',
    payload: 'PROPAGATE_EVENT_PAYLOAD_1',
  });

  o.accept({
    type: 'DONT_PROPAGATE_EVENT',
    payload: 'DONT_PROPAGATE_EVENT_PAYLOAD',
  });

  stopPropagation();

  o.accept({
    type: 'PROPAGATE_EVENT',
    payload: 'PROPAGATE_EVENT_PAYLOAD_2',
  });

  expect(propagatedEvents).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": "PROPAGATE_EVENT_PAYLOAD_1",
        "type": "PROPAGATE_EVENT",
      },
    ]
  `);
});

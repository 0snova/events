import { ClosedConnector } from './ClosedConnector';
import { InferEventFromCreatorsMap } from './EventMap';
import { makeEventCreator } from './Events';

const testEvent1 = makeEventCreator<{ message: string }, 'TestEvent1'>('TestEvent1');
const testEvent2 = makeEventCreator<{ value: number }, 'TestEvent2'>('TestEvent2');

const events = { testEvent1, testEvent2 };

type Events = InferEventFromCreatorsMap<typeof events>;

test('should accept listenable events', () => {
  const c = new ClosedConnector<Events>();

  const events: (string | number)[] = [];

  c.on('TestEvent1', (event) => {
    events.push(event.payload.message);
  });
  c.on('TestEvent2', (event) => {
    events.push(event.payload.value);
  });

  c.accept(testEvent1({ message: 'test message' }));
  c.accept(testEvent2({ value: 69 }));

  expect(events).toMatchInlineSnapshot(`
    Array [
      "test message",
      69,
    ]
  `);
});

test('should listen wildcard event type', () => {
  const c = new ClosedConnector<Events>();

  const events: any[] = [];

  c.on('*', (event) => {
    events.push(event.payload);
  });

  c.accept(testEvent1({ message: 'test message' }));
  c.accept(testEvent2({ value: 69 }));

  expect(events).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "test message",
      },
      Object {
        "value": 69,
      },
    ]
  `);
});

test('should release selected events', () => {
  const c = new ClosedConnector<Events>();

  const events: (string | number)[] = [];

  c.on('TestEvent2', (event) => {
    events.push(event.payload.value);
  });

  const unsubscribe = c.on('TestEvent2', (event) => {
    events.push(event.payload.value + 1);
  });

  unsubscribe();

  c.accept(testEvent2({ value: 42 }));

  expect(events).not.toMatchObject(expect.arrayContaining([43]));
  expect(events).toMatchObject(expect.arrayContaining([42]));
});

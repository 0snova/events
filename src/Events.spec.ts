import { makeEventCreator } from './Events';

test(`event type is injected`, () => {
  type Payload = {
    value: number;
  };

  const EVENT_TYPE = 'EVENT_TYPE' as const;
  type EventType = typeof EVENT_TYPE;

  const event = makeEventCreator<Payload, EventType>(EVENT_TYPE)({ value: 420 });

  expect(event.type).toBe(EVENT_TYPE);
});

test(`payload is injected into the event`, () => {
  type EventPayload = {
    value: number;
  };
  const payload: EventPayload = { value: 420 };

  const event = makeEventCreator('EVENT_TYPE')(payload);

  console.log(event);

  expect(event.payload).toEqual(payload);
});

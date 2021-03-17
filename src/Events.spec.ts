import { makeEventCreator } from './Events';

test(`event type is injected`, () => {
  const EVENT_TYPE = 'EVENT_TYPE' as const;
  type EventType = typeof EVENT_TYPE;
  type Payload = {
    value: number;
  };

  const event = makeEventCreator<Payload, EventType>(EVENT_TYPE)({ value: 420 });

  expect(event.type).toBe(EVENT_TYPE);
});

test(`payload is injected into the event`, () => {
  type EventPayload = {
    value: number;
  };
  const payload: EventPayload = { value: 420 };

  const event = makeEventCreator('EVENT_TYPE')(payload);

  expect(event.payload).toEqual(payload);
});

import { ClosedConnector } from './ClosedConnector';
import { InferEventFromCreatorsMap } from './EventMap';
import { makeEventCreator } from './Events';
import { CastToIdentifiableEvent } from './EventIdentifiable';
import { InferResponseEventMap, makeResponseEvent, RequestConnector } from './RequestConnector';
import { EventSender } from './EventSender';

test(`should wait for response`, async () => {
  const eventKEK = makeEventCreator<string, 'KEK'>('KEK');
  const eventLUL = makeEventCreator<number, 'LUL'>('LUL');
  const events = { eventKEK, eventLUL };

  type RequestEvent = InferEventFromCreatorsMap<typeof events>;
  type IdentifiableRequestEvent = CastToIdentifiableEvent<RequestEvent>;

  type ResponseEventMap = InferResponseEventMap<
    RequestEvent,
    {
      KEK: string;
      LUL: number;
    }
  >;

  const target = new ClosedConnector<IdentifiableRequestEvent>();
  const requester = new RequestConnector<RequestEvent, ResponseEventMap>(new EventSender<RequestEvent>(target));

  target.on('KEK', (event) => {
    requester.accept(makeResponseEvent(event, `request payload: ${event.payload}`));
  });

  target.on('LUL', (event) => {
    requester.accept(makeResponseEvent(event, 69 + event.payload));
  });

  expect(await requester.request(eventKEK('kekw'))).toMatchInlineSnapshot(`"request payload: kekw"`);
  expect(await requester.request(eventLUL(420))).toMatchInlineSnapshot(`489`);
});

import { ClosedConnector } from './ClosedConnector';
import { InferEventFromCreatorsMap } from './EventMap';
import { makeEventCreator } from './Events';
import { CastToIdentifiableEvent, makeIdentifiableEvent } from './EventIdentifiable';
import { InferResponseEventMap, makeResponseEvent, RequestConnector } from './RequestConnector';

test(`should wait for response`, async () => {
  let lastId = 0;

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

  const requester = new RequestConnector<RequestEvent, ResponseEventMap>({
    async send(event) {
      const id = event.type + lastId++;
      const eventWithId = makeIdentifiableEvent<RequestEvent>(event, id);

      // otherwise reponse listener to the specific request is not added yet
      // when response comes.
      setTimeout(() => {
        target.accept(eventWithId);
      }, 0);

      return eventWithId;
    },
  });

  target.on('KEK', (event) => {
    requester.accept(makeResponseEvent(event, `request payload: ${event.payload}`));
  });

  target.on('LUL', (event) => {
    requester.accept(makeResponseEvent(event, 69 + event.payload));
  });

  expect(await requester.request(eventKEK('kekw'))).toMatchInlineSnapshot(`"request payload: kekw"`);
  expect(await requester.request(eventLUL(420))).toMatchInlineSnapshot(`489`);
});

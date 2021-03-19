import { ClosedConnector } from '../ClosedConnector';
import { InferEventFromCreatorsMap } from '../EventMap';
import { makeEventCreator } from '../Events';
import { CastToIdentifiableEvent } from '../EventIdentifiable';
import { RequestConnector } from '../RequestConnector';
import { ResponseConnector } from '../ResponseConnector';
import { EventResponseSender, EventRequestSender } from '../EventSender';
import { propagateEvents } from '../PropagateEvent';
import { InferResponseEventMap } from '../EventResponse';

test(`Requests are propagated to the ResponseConnector`, async () => {
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

  type ResponseEvent = ResponseEventMap[keyof ResponseEventMap];

  const requests = new ClosedConnector<IdentifiableRequestEvent>();
  const requester = new RequestConnector<RequestEvent, ResponseEventMap>(
    new EventRequestSender<RequestEvent>(requests)
  );

  const responser = new ResponseConnector<IdentifiableRequestEvent, ResponseEventMap>(
    new EventResponseSender<ResponseEvent>(requester),
    {
      LUL: async (e) => {
        return e.payload + 69;
      },
      KEK: async (e) => {
        return `request payload: ${e.payload}`;
      },
    }
  );

  propagateEvents(requests, responser, ['KEK', 'LUL']);

  expect(await requester.request(eventKEK('kekw'))).toMatchInlineSnapshot(`"request payload: kekw"`);
  expect(await requester.request(eventLUL(420))).toMatchInlineSnapshot(`489`);
});

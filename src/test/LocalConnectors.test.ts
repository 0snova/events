import { ClosedConnector } from '../ClosedConnector';
import { InferEventFromCreatorsMap } from '../EventMap';
import { makeEventCreator } from '../Events';
import { RequestConnector } from '../RequestConnector';
import { ResponseConnector } from '../ResponseConnector';
import { LocalNextTickTransferer } from '../EventTransfererLocalNextTick';
import { propagateEvents } from '../PropagateEvent';
import { InferResponseEventMap } from '../EventResponse';
import { CastToRequestEvent } from '../EventRequest';

test(`Requests are propagated to the ResponseConnector`, async () => {
  const eventKEK = makeEventCreator<string, 'KEK'>('KEK');
  const eventLUL = makeEventCreator<number, 'LUL'>('LUL');
  const events = { eventKEK, eventLUL };

  type BaseEvents = InferEventFromCreatorsMap<typeof events>;
  type RequestEvents = CastToRequestEvent<BaseEvents>;

  type ResponseEventMap = InferResponseEventMap<
    BaseEvents,
    {
      KEK: string;
      LUL: number;
    }
  >;

  type ResponseEvent = ResponseEventMap[keyof ResponseEventMap];

  const requests = new ClosedConnector<RequestEvents>();
  const requester = new RequestConnector<RequestEvents, ResponseEventMap>(new LocalNextTickTransferer(requests));

  const responser = new ResponseConnector<RequestEvents, ResponseEventMap>(
    new LocalNextTickTransferer<ResponseEvent>(requester),
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

import { ClosedConnector, InferResponseEventMap, LocalNextTickTransferer, RequestEvent } from '.';
import { RequestConnector } from './RequestConnector';

it('shold be gucci', () => {
  type AEvent = RequestEvent<string, 'A'>;
  type BEvent = RequestEvent<{ value: number }, 'B'>;

  type RMap = InferResponseEventMap<
    AEvent | BEvent,
    {
      A: { a: string };
      B: { b: number };
    }
  >;

  const target = new ClosedConnector<AEvent | BEvent>();
  const conn = new RequestConnector<AEvent | BEvent, RMap>(new LocalNextTickTransferer(target));

  conn
    .request({
      type: 'A',
      payload: 'payload',
    })
    .then((response) => {
      response.a;
    });

  conn
    .request({
      type: 'B',
      payload: {
        value: 420,
      },
    })
    .then((response) => {
      response.b;
    });
});

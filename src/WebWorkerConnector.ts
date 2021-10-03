import { DuplexConnector, PostMessageTransferer, BaseConnector, DuplexConnectorOptions } from './';
import { RequestEvent } from './EventRequest';
import { AnyResponseEventMap } from './EventResponse';
import { ResponseMap } from './ResponseConnector';

export function makeWebWorkerPostMessageProvider<Event extends RequestEvent>(worker: Worker) {
  return {
    postMessage(message: Event) {
      worker.postMessage({ event: message });
    },
  };
}

export function propagateWebWorkerEvents<Event extends RequestEvent>(worker: Worker, target: BaseConnector<Event>) {
  worker.addEventListener('message', (msg: any) => {
    if (msg.data.event) {
      target.accept(msg.data.event);
    }
  });
}

export function makeWebWorkerConnector<
  OutReqEvents extends RequestEvent,
  InReqEvents extends RequestEvent,
  OutResponseEventMap extends AnyResponseEventMap,
  InResponseEventMap extends AnyResponseEventMap
>(
  worker: Worker,
  responses?: Partial<ResponseMap<RequestEvent, OutResponseEventMap>>,
  options?: DuplexConnectorOptions<InResponseEventMap[keyof InResponseEventMap]>
) {
  const connector = new DuplexConnector<OutReqEvents, InReqEvents, OutResponseEventMap, InResponseEventMap>(
    new PostMessageTransferer(makeWebWorkerPostMessageProvider(worker)),
    new PostMessageTransferer(makeWebWorkerPostMessageProvider(worker)),
    responses,
    options
  );

  propagateWebWorkerEvents(worker, connector);

  return { connector };
}

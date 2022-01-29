import { DuplexConnector, PostMessageTransferer, BaseConnector, DuplexConnectorOptions } from './';
import { RequestEvent } from './EventRequest';
import { AnyResponseEventMap } from './EventResponse';
import { ResponseMap } from './ResponseConnector';

export function makeWebWorkerPostMessageProvider<Event extends RequestEvent>(worker: Worker, port?: MessagePort) {
  return {
    postMessage(message: Event) {
      if (port) {
        port.postMessage({ event: message });
      } else {
        worker.postMessage({ event: message });
      }
    },
  };
}

export function propagateWebWorkerEvents<Event extends RequestEvent>(worker: Worker, target: BaseConnector<Event>) {
  worker.addEventListener('message', (msg) => {
    if (msg.data.event) {
      target.accept(msg.data.event);
    }
  });
}

export function propagatePortEvents<Event extends RequestEvent>(port: MessagePort, target: BaseConnector<Event>) {
  port.onmessage = (msg) => {
    if (msg.data.event) {
      target.accept(msg.data.event);
    }
  };
}

export function makeWebWorkerConnector<
  OutReqEvents extends RequestEvent,
  InReqEvents extends RequestEvent,
  OutResponseEventMap extends AnyResponseEventMap,
  InResponseEventMap extends AnyResponseEventMap
>(
  worker: Worker,
  responses?: Partial<ResponseMap<RequestEvent, OutResponseEventMap>>,
  options?: DuplexConnectorOptions<InResponseEventMap[keyof InResponseEventMap]> & {
    port?: MessagePort;
  }
) {
  const connector = new DuplexConnector<OutReqEvents, InReqEvents, OutResponseEventMap, InResponseEventMap>(
    new PostMessageTransferer(makeWebWorkerPostMessageProvider(worker, options?.port)),
    new PostMessageTransferer(makeWebWorkerPostMessageProvider(worker, options?.port)),
    responses,
    options
  );

  if (options?.port) {
    propagatePortEvents(options.port, connector);
  } else {
    propagateWebWorkerEvents(worker, connector);
  }

  return { connector };
}

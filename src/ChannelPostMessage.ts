import { ClosedConnector } from './ClosedConnector';
import { AnyEvent } from './Events';
import {
  MessageListenerProvider,
  PostMessageMessageWrapper,
  PostMessageProvider,
  PostMessageTransferer,
} from './EventTransfererPostMessage';

export function createPostMessageChannel<InEvent extends AnyEvent = AnyEvent, OutEvent extends AnyEvent = AnyEvent>(
  listen: MessageListenerProvider<InEvent>,
  post: PostMessageProvider<OutEvent>,
  key: string
) {
  function markMessageAsEvent(message: any) {
    message[key] = true;
    return message;
  }

  function isEventMessage(message: PostMessageMessageWrapper<any>) {
    return !!message.data[key];
  }

  function propagateEvents(connector: ClosedConnector<InEvent>) {
    listen.addEventListener('message', (msg) => {
      if (isEventMessage(msg)) {
        connector.accept(msg.data);
      }
    });
  }

  const transferer = new PostMessageTransferer<OutEvent>(post, (e) => markMessageAsEvent(e));

  return {
    transferer,
    propagateEvents,
  };
}

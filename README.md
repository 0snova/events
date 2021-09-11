# @osnova/events

Intersystem Event Messaging.

## Concepts

### Event

Event is an intention to do something or a signal that something has happened. Event has `type` and `payload` fields.

```typescript
import { makeEventCreator } from '@osnova/events';

const eventRecievedWebsocketMessage = makeEventCreator('RECIEVED_WEBSOCKET_MESSAGE');

const helloMessageEvent = eventRecievedWebsocketMessage({
  message: 'hello',
});

console.log(helloMessageEvent);
/*
{ 
  type: 'RECIEVED_WEBSOCKET_MESSAGE',
  payload: { message: 'Hello' }
}
*/
```

### Connector

Connector is an entity that listens for events, reacts to events and sends events to other connectors.

```typescript
import { makeEventCreator, ClosedConnector } from '@osnova/events';

const eventRecievedWebsocketMessage = makeEventCreator('RECIEVED_WEBSOCKET_MESSAGE');

const connector = new ClosedConnector();

connector.on('RECIEVED_WEBSOCKET_MESSAGE', (event) => {
  console.log(event); // (1)
});

connector.accept(
  eventRecievedWebsocketMessage({
    message: 'hello',
  })
);

console.log(`The connector has already accepted the event.`); // (2)

/*
  Will print:

  { 
    type: 'RECIEVED_WEBSOCKET_MESSAGE',
    payload: { message: 'Hello' }
  }

  The connector has already accepted the event.

*/
```

All listeners will be executed synchronously when the connector receives the event via `accept`. So `(1)` wil be printed before `(2)`.

#### Closed connector

`ClosedConnector` is a special connector with no-op `send` method.

#### Request/Response connectors

Request is an event that expects a response from the target connector.
Response is an event that is sent to the requesting connector.

### EventTransferer

Takes original event, prepares it and transfers it to receiving system.

#### LocalNextTick Transferer

Transfers event to `ClosedConnector` on the next tick.

#### PostMessage Transferer

Transfers events via custom provider with `postMessage` interface.

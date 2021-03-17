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

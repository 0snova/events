import { ListenersMap } from './ListenersMap';

test('should add listeners to a spectific key', () => {
  const listenersMap = new ListenersMap();
  const events: string[] = [];

  listenersMap.add('key', () => {
    events.push('event');
  });

  listenersMap.add('key', () => {
    events.push('event-2');
  });

  const listeners = listenersMap.get('key');

  listeners.forEach((listener) => {
    listener();
  });

  expect(events).toMatchObject(expect.arrayContaining(['event', 'event-2']));
});

test('should add listeners to a spectific key', () => {
  const listenersMap = new ListenersMap();
  const events: string[] = [];

  const l1 = () => {
    events.push('event');
  };

  const l2 = () => {
    events.push('event-2');
  };

  listenersMap.add('key', l1);
  listenersMap.add('key', l2);
  listenersMap.release('key', l2);

  const listeners = listenersMap.get('key');

  listeners.forEach((listener) => {
    listener();
  });

  expect(events).toMatchObject(expect.arrayContaining(['event']));
  expect(events).toMatchObject(expect.not.arrayContaining(['event-2']));
});

test('should release all listeners related to a specific key', () => {
  const listenersMap = new ListenersMap();
  const events: string[] = [];

  const l1 = () => {
    events.push('event');
  };

  const l2 = () => {
    events.push('event-2');
  };

  listenersMap.add('key', l1);
  listenersMap.add('key', l2);
  listenersMap.releaseAll('key');

  const listeners = listenersMap.get('key');

  listeners.forEach((listener) => {
    listener();
  });

  expect(listeners).toHaveLength(0);
  expect(events).toMatchObject(expect.not.arrayContaining(['event', 'event-2']));
});

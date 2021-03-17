import { UnsubscribeMap } from './UnsubscribeMap';

test('adds unsubscribe functions by a key to the list', () => {
  const map = new UnsubscribeMap();

  const keys = ['fn1', 'fn2'];
  keys.map((key) => map.set(key, () => void 0));

  expect(map.getAll()).toMatchObject({
    [keys[0]]: expect.any(Function),
    [keys[1]]: expect.any(Function),
  });
});

test(`throws an error if unsubscriber with the same key is added without releasing the previous one`, () => {
  const map = new UnsubscribeMap();

  map.set('fn1', () => void 0);
  expect(() => map.set('fn1', () => void 0)).toThrowErrorMatchingInlineSnapshot(
    `"Unable to add unsubscriber by key \\"fn1\\": existing assosiated with this key unsubscriber must be released first."`
  );
});

test('calls unsubscribe function on release', () => {
  const map = new UnsubscribeMap();

  let called = 0;

  function unsub() {
    called++;
  }

  map.set('fn1', unsub);
  expect(called).toBe(0);

  map.release('fn1');
  expect(called).toBe(1);
});

test('calls every unsubscribe function on releaseAll', () => {
  const map = new UnsubscribeMap();

  const called: Record<string, unknown> = {};

  const keys = ['fn1', 'fn2'];
  keys.map((key) => map.set(key, () => (called[key] = true)));

  map.releaseAll();

  expect(called).toMatchObject({
    [keys[0]]: true,
    [keys[1]]: true,
  });
});

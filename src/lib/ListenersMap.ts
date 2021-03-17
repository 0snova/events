import { Unsubscribe } from './Unsubscribe';

export type AnyListener = () => void;

type ListenersListMapInner<Key extends string, L extends AnyListener> = Map<Key, L[]>;

export class ListenersMap<Key extends string, Listener extends AnyListener> {
  protected listeners: ListenersListMapInner<Key, Listener> = new Map();

  public add(key: Key, listener: Listener): Unsubscribe {
    const listenersByKey = this.listeners.get(key);

    if (listenersByKey) {
      this.listeners.set(key, [...listenersByKey, listener]);
    } else {
      this.listeners.set(key, [listener]);
    }

    return () => {
      this.release(key, listener);
    };
  }

  public get(key: Key) {
    return this.listeners.get(key) ?? [];
  }

  public release(key: Key, listener: Listener) {
    const listenersByKey = this.listeners.get(key);

    if (listenersByKey) {
      this.listeners.set(
        key,
        listenersByKey.filter((l) => l !== listener)
      );
    }
  }

  public releaseAll(key: Key) {
    const listenersByKey = this.listeners.get(key);

    if (listenersByKey) {
      this.listeners.set(key, []);
    }
  }
}

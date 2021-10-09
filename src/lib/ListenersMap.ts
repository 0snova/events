import { Unsubscribe } from './Unsubscribe';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyListener = (e?: any) => void;
type ListenersListMapInner<Key extends string, L extends AnyListener> = Map<Key, L[]>;

export class ListenersMap<Key extends string, Listener extends AnyListener> {
  protected listeners: ListenersListMapInner<Key | '*', Listener> = new Map();
  // protected wildcardListeners: ListenersListMapInner<Key, Listener> = new Map();

  private registerListener(
    key: Key | '*',
    listener: Listener,
    list: ListenersListMapInner<Key | '*', Listener> = this.listeners
  ): Unsubscribe {
    const listenersByKey = list.get(key);

    if (listenersByKey) {
      list.set(key, [...listenersByKey, listener]);
    } else {
      list.set(key, [listener]);
    }

    return () => {
      this.release(key, listener, list);
    };
  }

  public add(
    key: Key | '*',
    listener: Listener,
    list: ListenersListMapInner<Key | '*', Listener> = this.listeners
  ): Unsubscribe {
    return this.registerListener(key, listener, list);
  }

  public get(key: Key | '*', list: ListenersListMapInner<Key | '*', Listener> = this.listeners) {
    return list.get(key) ?? [];
  }

  public release(
    key: Key | '*',
    listener: Listener,
    list: ListenersListMapInner<Key | '*', Listener> = this.listeners
  ) {
    const listenersByKey = list.get(key);

    if (listenersByKey) {
      list.set(
        key,
        listenersByKey.filter((l) => l !== listener)
      );
    }
  }

  public releaseAll(key: Key | '*', list: ListenersListMapInner<Key | '*', Listener> = this.listeners) {
    const listenersByKey = list.get(key);

    if (listenersByKey) {
      list.set(key, []);
    }
  }

  public getExecuteList(key: Key, list: ListenersListMapInner<Key | '*', Listener> = this.listeners) {
    const listeners = list.get(key) ?? [];
    const wildListeners = list.get('*') ?? [];

    return [...listeners, ...wildListeners];
  }
}

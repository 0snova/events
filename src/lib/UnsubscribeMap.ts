import { Unsubscribe } from './Unsubscribe';

type UnsubscribersMapInner<Key extends string> = Map<Key, Unsubscribe>;

/* One Unsubscriber per key */
export class UnsubscribeMap<Key extends string> {
  protected unsubscribers: UnsubscribersMapInner<Key> = new Map();

  public set(key: Key, unsubscribe: Unsubscribe) {
    if (this.unsubscribers.has(key)) {
      throw new Error(
        `Unable to add unsubscriber by key "${key}": existing assosiated with this key unsubscriber must be released first.`
      );
    }

    this.unsubscribers.set(key, unsubscribe);
  }

  public getAll(): Record<Key, Unsubscribe> {
    const entries = this.unsubscribers.entries();
    const result: Record<Key, Unsubscribe> = {} as Record<Key, Unsubscribe>;

    let value;
    while (!({ value } = entries.next()).done) {
      result[value[0] as Key] = value[1];
    }
    return result;
  }

  public release(key: Key) {
    const unsubscribe = this.unsubscribers.get(key);

    if (unsubscribe) {
      unsubscribe();
      this.unsubscribers.delete(key);
    }
  }

  public releaseAll() {
    const unsubscribers = this.unsubscribers.values();
    let unsubscribe;
    while (!({ value: unsubscribe } = unsubscribers.next()).done) {
      unsubscribe();
    }
  }
}

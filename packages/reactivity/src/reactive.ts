import { track, trigger } from "./effect";

const reactiveHandler = {
  get(target: object, key: PropertyKey) {
    track(target, key);
    return target[key];
  },
  set(target: object, key: PropertyKey, value: any) {
    target[key] = value;
    trigger(target, key);
    return true;
  },
};

export function reactive<T extends object>(target: T): T {
  // TODO: is there any way to represent the type of a Proxy?
  return new Proxy(target, reactiveHandler) as T;
}

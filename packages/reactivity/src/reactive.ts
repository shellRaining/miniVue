import { track, trigger } from "./effect";
import { isObject } from "../../shared/src/general";

const reactiveHandler = {
  get(target: object, key: PropertyKey) {
    const res = target[key];

    if (isObject(res)) {
      // TODO: every time create a new Proxy will cost time?
      return reactive(res);
    }
    track(target, key);
    return res;
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

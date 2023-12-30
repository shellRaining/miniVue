import { track, trigger } from "./effect";
import { isObject } from "../../shared/src/general";

const reactiveHandler = createHandler(false);
const readonlyHandler = createHandler(true);

function createHandler(isReadonly: boolean) {
  return {
    get(target: object, key: PropertyKey) {
      const res = target[key];

      if (isObject(res)) {
        // TODO: every time create a new Proxy will cost time?
        // NOTE: beacuse write value like a.b.c have a read process, so this need change too
        return isReadonly ? readonly(res) : reactive(res);
      }
      track(target, key);
      return res;
    },
    set(target: object, key: PropertyKey, value: any) {
      if (isReadonly) {
        console.warn('try to write in a readonly object');
        return true;
      }
      target[key] = value;
      trigger(target, key);
      return true;
    },
  };
}

export function reactive<T extends object>(target: T): T {
  // TODO: is there any way to represent the type of a Proxy?
  return new Proxy(target, reactiveHandler) as T;
}

export function readonly<T extends object>(target: T): T {
  return new Proxy(target, readonlyHandler) as T;
}

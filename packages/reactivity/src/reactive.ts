import { track, trigger } from "./effect";
import { isObject } from "../../shared/src/general";

const reactiveHandler = createHandler(false);
const readonlyHandler = createHandler(true);
const shallowReadonlyHandler = createHandler(true, true);

enum ReactiveFlag {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

function createHandler(isReadonly: boolean, shallow = false) {
  return {
    get(target: object, key: PropertyKey) {
      if (key === ReactiveFlag.IS_READONLY) {
        return isReadonly;
      } else if (key === ReactiveFlag.IS_REACTIVE) {
        return !isReadonly;
      }

      const res = Reflect.get(target, key);

      // TODO: why shallow opts deal like this... record this in diary
      if (shallow) {
        return res;
      }

      if (isObject(res)) {
        // TODO: every time create a new Proxy will cost time?
        // NOTE: beacuse write value like a.b.c have a read process, so this need change too
        return isReadonly ? readonly(res) : reactive(res);
      }

      if (!isReadonly) {
        track(target, key);
      }
      return res;
    },
    set(target: object, key: PropertyKey, value: any) {
      if (isReadonly) {
        console.warn("try to write in a readonly object");
        return true;
      }
      const res = Reflect.set(target, key, value);
      trigger(target, key);
      return res;
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

export function shallowReadonly<T extends object>(target: T): T {
  return new Proxy(target, shallowReadonlyHandler) as T;
}

export function isReactive(target: unknown) {
  return isObject(target) && target[ReactiveFlag.IS_REACTIVE];
}

export function isReadonly(target: unknown) {
  return isObject(target) && target[ReactiveFlag.IS_READONLY];
}

export function isProxy(target: unknown) {
  if (!isObject(target)) {
    return false;
  }
  return isReactive(target) || isReadonly(target);
}

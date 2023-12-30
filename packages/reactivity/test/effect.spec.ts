import { effect, stop } from "../src/effect";
import { reactive } from "../src/reactive";

describe("reactive", () => {
  type ShallowType = { a: number };
  type DeepType = { a: { b: number } };
  type MultType = { a: number; b: number };

  let shallow: ShallowType;
  let deep: DeepType;
  let mult: MultType;
  let shallowProxy: ShallowType;
  let deepProxy: DeepType;
  let multProxy: MultType;

  beforeEach(() => {
    shallow = { a: 1 };
    deep = { a: { b: 1 } };
    mult = { a: 1, b: 2 };
    shallowProxy = reactive(shallow);
    deepProxy = reactive(deep);
    multProxy = reactive(mult);
  });

  it("should run passed fn", () => {
    const fn = jest.fn();
    effect(fn);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should get scheduler opts", () => {
    const scheduler = jest.fn();
    effect(() => shallowProxy.a, { scheduler });

    expect(scheduler).toHaveBeenCalledTimes(0);
    shallowProxy.a++;
    expect(scheduler).toHaveBeenCalledTimes(1);
  });

  it("should return a runner function", () => {
    const fn = jest.fn();
    const runner = effect(fn);

    expect(fn).toHaveBeenCalledTimes(1);
    runner();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should not track when stop", () => {
    const fn = jest.fn(() => shallowProxy.a);
    const runner = effect(fn);

    expect(fn).toHaveBeenCalledTimes(1);
    stop(runner);
    shallowProxy.a++;
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should have deep reactivity", () => {
    const fn = jest.fn(() => {
      deepProxy.a.b;
    });
    effect(fn);

    expect(fn).toHaveBeenCalledTimes(1);
    deepProxy.a.b++;
    expect(fn).toHaveBeenCalledTimes(2);
    expect(deepProxy.a.b).toBe(2);
  });
});

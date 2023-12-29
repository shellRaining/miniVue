import { effect } from "../src/effect";
import { reactive } from "../src/reactive";

describe("reactive", () => {
  it("should run passed fn", () => {
    const fn = jest.fn();
    effect(fn);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should get scheduler opts", () => {
    const a = reactive({ a: 1 });
    const scheduler = jest.fn();
    effect(() => a.a, { scheduler });

    expect(scheduler).toHaveBeenCalledTimes(0);
    a.a++;
    expect(scheduler).toHaveBeenCalledTimes(1);
  });

  it("should return a runner function", () => {
    const fn = jest.fn();
    const runner = effect(fn);

    expect(fn).toHaveBeenCalledTimes(1);
    runner();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

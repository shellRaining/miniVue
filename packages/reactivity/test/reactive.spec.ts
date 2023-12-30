import { isReactive, isReadonly, reactive, readonly } from "../src/reactive";
import { effect } from "../src/effect";

describe("reactive", () => {
  it("should return a proxy", () => {
    const target = { foo: "bar" };
    const proxy = reactive(target);

    expect(proxy).not.toBe(target);
    expect(proxy.foo).toBe("bar");
  });

  it("should have reactivity", () => {
    const user = reactive({
      age: 10,
    });

    let nextAge = 0;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("should have readonly", () => {
    const user = readonly({
      age: 10,
    });

    user.age++;
    expect(user.age).toBe(10);
  });

  it("should have isReactive and isReadonly", () => {
    const ra = reactive({ a: 1 });
    const ro = readonly({ a: 1 });
    const r = { a: 1 };

    expect(isReactive(ra)).toBeTruthy();
    expect(isReadonly(ro)).toBeTruthy();
    expect(isReactive(r)).toBeFalsy();
    expect(isReadonly(r)).toBeFalsy();
  });
});

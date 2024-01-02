import { isProxy, isReactive, isReadonly, reactive, readonly, shallowReadonly } from "../src/reactive";
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

  it('should have shallowReadonly', () => {
    const sro = shallowReadonly({ a: { b: 1 } })

    sro.a.b = 2
    expect(sro.a.b).toBe(2)
    sro.a = { b: 3 }
    expect(sro.a.b).toBe(2)
  });

  it('should have isProxy', () => {
    const sro = shallowReadonly({ a: { b: 1 } })

    expect(isProxy(sro)).toBeTruthy()
    expect(isProxy(sro.a)).toBeFalsy()
    expect(isProxy(sro.a.b)).toBeFalsy()
  });
});

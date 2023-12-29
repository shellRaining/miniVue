import { reactive } from "../src/reactive";
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
});

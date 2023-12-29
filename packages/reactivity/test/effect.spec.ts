import { effect } from "../src/effect";

describe("reactive", () => {
  it("should run passed fn", () => {
    const fn = jest.fn();
    effect(fn);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

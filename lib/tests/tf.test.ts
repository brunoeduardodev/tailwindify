import { describe, expect, it } from "vitest";
import { tf } from "../tf";

describe("TailwindyFlat Tests", () => {
  it("Should join classes", () => {
    const final = tf("some-class", "another-class");

    expect(final).toEqual("some-class another-class");
  });

  it("Should be able too deeply join classes", () => {
    const final = tf("some-class", "another-class", [
      "deep",
      "example-class",
      ["depth-2", "another-example"],
    ]);

    expect(final).toEqual(
      "some-class another-class deep example-class depth-2 another-example"
    );
  });

  it("Should not add 'undefined', 'false', 'null', '0', values", () => {
    const final = tf("some-class", [
      undefined,
      "test",
      0,
      [null, "should-appear", false, "should-appear-as-well"],
    ]);

    expect(final).toEqual(
      "some-class test should-appear should-appear-as-well"
    );
  });

  it("Should apply styles on Record definitions, when property value is truthy", () => {
    const isEven = 4 % 2 === 0;

    const classDefinition = {
      "is-even": isEven,
      "is-odd": !isEven,
    };

    const final = tf(classDefinition);
    expect(final).toBe("is-even");
  });

  it("Should accept record styles deeply nested", () => {
    const final = tf("1", "2", ["3", "4", ["5", { "6": false, "7": true }]]);

    expect(final).toBe("1 2 3 4 5 7");
  });
});

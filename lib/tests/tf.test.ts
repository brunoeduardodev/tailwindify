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
});

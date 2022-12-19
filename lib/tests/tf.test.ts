import { describe, expect, it } from "vitest";
import { tf } from "../tf";

describe("TailwindyFlat Tests", () => {
  it("Should join classes", () => {
    const final = tf("some-class", "another-class");

    expect(final).toEqual("some-class another-class");
  });
});

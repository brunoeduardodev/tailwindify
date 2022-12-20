import { describe, expect, it } from "vitest";
import { tv } from "../tv";

describe("TailwindifyVariants test cases", () => {
  it("Should concat class definition lists", () => {
    expect(
      tv("mt-1", ["mt-2 mt-3"], { variants: {}, defaultVariants: {} })
    ).toBe("mt-1 mt-2 mt-3");
  });
});

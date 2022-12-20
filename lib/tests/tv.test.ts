import { describe, expect, it, test } from "vitest";
import { tv } from "../tv";

describe("TailwindifyVariants test cases", () => {
  it("Should concat class definition lists", () => {
    const styles = tv("mt-1", ["mt-2 mt-3"], {
      variants: {},
      defaultVariants: {},
    });

    expect(styles({})).toBe("mt-1 mt-2 mt-3");
  });

  it("Should add only selected classes", () => {
    const styles = tv({
      variants: {
        color: {
          red: "text-red-500",
          blue: "text-blue-500",
        },
      },
      defaultVariants: { color: "red" },
    });

    styles({ color: "red" });
  });
});

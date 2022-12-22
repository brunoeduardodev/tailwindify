import { describe, expect, it, test } from "vitest";
import { tv } from "../tv";

describe("TailwindifyVariants test cases", () => {
  it("Should concat class definition lists", () => {
    const styles = tv("mt-1", ["mt-2 mt-3"], {
      variants: {},
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
    });

    styles({ color: "red" });
  });

  it("Should concat selected classes and base classes", () => {
    const styles = tv("mt-1", [[["mt-2"], undefined, 0, "mt-3"]], {
      variants: {
        example: {
          1: "mb-1",
          2: "mb-2",
        },
      },
    });

    expect(styles({ example: 2 })).toBe("mt-1 mt-2 mt-3 mb-2");
  });

  it("Should use default variant if some variant is not given", () => {
    const styles = tv({
      variants: {
        color: {
          red: "text-red-500",
          blue: "text-blue-500",
        },
        size: {
          sm: "text-md",
          md: "text-lg",
        },
      },
      defaultVariants: {
        size: "md",
      },
    });

    expect(styles({ color: "red" })).toBe("text-red-500 text-lg");
  });
});
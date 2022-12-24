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

  it("Should work having base classes & default variants & selected variant", () => {
    const styles = tv(
      "font-bold",
      undefined,
      "mb-2",
      0,
      null,
      [[null, ["mt-3"]]],
      {
        variants: {
          color: {
            red: "text-red-500",
            blue: "text-blue-500",
          },
          size: {
            sm: "font-sm",
            md: "font-md",
          },
        },
        defaultVariants: {
          color: "red",
        },
      }
    );

    expect(styles({ size: "sm" })).toBe(
      "font-bold mb-2 mt-3 text-red-500 font-sm"
    );
  });

  it("Should add compound variants classes", () => {
    const styles = tv({
      variants: {
        color: {
          red: "text-red-500",
          blue: "text-blue-500",
        },
        size: {
          sm: "font-sm",
          md: "font-md",
        },
      },
      compoundVariants: [
        { color: "red", size: "sm", classes: "font-bold" },
        { color: "blue", size: "md", classes: "font-semibold" },
      ],
    });

    expect(styles({ color: "red", size: "sm" })).toBe(
      "text-red-500 font-sm font-bold"
    );

    expect(styles({ color: "blue", size: "md" })).toBe(
      "text-blue-500 font-md font-semibold"
    );
  });

  it("Should support an list of variants to compound", () => {
    const styles = tv({
      variants: {
        shadow: {
          none: "",
          sm: "shadow-sm",
          md: "shadow-md",
          lg: "shadow-lg",
        },
        rounded: {
          none: "",
          sm: "rounded",
          md: "rounded-md",
        },
      },
      compoundVariants: [
        {
          rounded: ["sm", "md"],
          shadow: ["sm", "md", "lg"],
          classes: "bg-red-500",
        },
        {
          rounded: "none",
          shadow: "none",
          classes: "bg-blue-500",
        },
      ],
    });

    expect(styles({ shadow: "lg", rounded: "sm" })).toBe(
      "shadow-lg rounded bg-red-500"
    );

    expect(styles({ shadow: "none", rounded: "none" })).toBe("bg-blue-500");
  });

  it("Should set compounded variants by default variants", () => {
    const styles = tv({
      variants: {
        shadow: {
          none: "",
          sm: "shadow-sm",
          md: "shadow-md",
          lg: "shadow-lg",
        },
        rounded: {
          none: "",
          sm: "rounded",
          md: "rounded-md",
        },
      },
      compoundVariants: [
        {
          rounded: ["sm", "md"],
          shadow: ["sm", "md", "lg"],
          classes: "bg-red-500",
        },
        {
          rounded: "none",
          shadow: "none",
          classes: "bg-blue-500",
        },
      ],
      defaultVariants: {
        rounded: "none",
        shadow: "none",
      },
    });

    expect(styles({})).toBe("bg-blue-500");
    expect(styles({ rounded: "md", shadow: "md" })).toBe(
      "shadow-md rounded-md bg-red-500"
    );
  });
});

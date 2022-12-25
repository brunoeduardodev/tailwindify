import { describe, expect, it } from "vitest";
import { ts } from "../ts";

describe("TailwindifyStyled", () => {
  it("Should be able to create an React component", () => {
    const Component = ts("div", "mt-2", {
      variants: {
        color: {
          red: "text-red-500",
        },
      },
    });

    expect(Component).toBeTruthy();
  });
});

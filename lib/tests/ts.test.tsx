import type { ComponentProps, FC } from "react";
import React from "react";
import { describe, expect, it } from "vitest";
import { ts } from "../ts";
import { render } from "@testing-library/react";

describe("TailwindifyStyled", () => {
  it("Should be able to create a React component", () => {
    const id = "some-id";

    const MyText = ts("p", "mt-2", {
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
        size: "md",
      },
      compoundVariants: [
        {
          color: "blue",
          size: "md",
          classes: "font-bold",
        },
      ],
    });

    expect(MyText).toBeTruthy();

    render(<MyText id={id} color="blue" />);
    const element = document.getElementById(id);

    expect(element).toBeTruthy();
    expect(element?.tagName.toLowerCase()).toBe("p");
    expect(element?.className).toBe("mt-2 text-blue-500 font-md font-bold");
  });

  it("Should pass displayName", () => {
    expect(ts("div", { variants: {} }).displayName).toBe("T.div");

    const MyComponent: FC<ComponentProps<"input">> = (props) => {
      return <input type={"text"} {...props} />;
    };
    MyComponent.displayName = "MyComponent";

    const StyledText = ts(MyComponent, { variants: {} });
    expect(StyledText.displayName).toBe("MyComponent");
  });
});

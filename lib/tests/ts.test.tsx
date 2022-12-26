import type { FC } from "react";
import type { ComponentProps } from "react";
import React from "react";
import { describe, expect, it } from "vitest";
import { ts } from "../ts";
import { render } from "@testing-library/react";
import { tf } from "../tf";

let currentID = 0;

const getID = () => `testing-id-${++currentID}`;

describe("TailwindifyStyled", () => {
  it("Should be able to create a React component", () => {
    const id = getID();

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

  it("Should work with custom components", () => {
    const id = getID();
    const MyComponent: FC<ComponentProps<"div">> = (props) => {
      return <div {...props} />;
    };

    MyComponent.displayName = "MyComponent";

    const StyledComponent = ts(MyComponent, "font-bold", {
      variants: {
        size: {
          sm: "font-sm p-1",
          md: "font-md p-2",
          lg: "font-lg p-3",
        },
        color: {
          red: "text-red-500",
          blue: "text-blue-500",
        },
      },
      defaultVariants: {
        color: "red",
      },
    });

    render(<StyledComponent id={id} size="lg" className="mb-2" />);

    const element = document.getElementById(id);

    expect(StyledComponent.displayName).toBe("MyComponent");
    expect(element).toBeTruthy();
    expect(element?.className).toBe("font-bold font-lg p-3 text-red-500 mb-2");
    expect(element?.tagName.toLowerCase()).toBe("div");
  });

  const flat = tf;
  const styled = ts;

  it("Should require base props", () => {
    const id = getID();

    /** SomeFile.tsx */
    type MyProps = {
      id: string;
      className?: string;
      color: "transparent" | "solid";
      size?: "big" | "normal";
    };

    const MyComponent = ({
      className,
      color,
      size = "normal",
      id,
    }: MyProps) => {
      return (
        <div
          id={id}
          className={flat(className, color === "transparent" && "opacity-50", {
            "font-bold": size === "big",
            "font-semibold": size === "normal",
          })}
        >
          {color}
        </div>
      );
    };

    /** SomeOtherFile.styles.ts */
    const MyStyledComponent = styled(MyComponent, "mb-2", {
      variants: {
        size: {
          sm: "font-sm p-1",
          md: "font-md p-2",
          lg: "font-lg p-3",
        },
        color: {
          red: "text-red-500",
          blue: "text-blue-500",
        },
      },
      defaultVariants: {
        size: "md",
      },
    });

    /** The Usage */
    render(
      <MyStyledComponent
        id={id}
        color="blue"
        __base={{ color: "transparent" }}
      />
    );

    expect(document.getElementById(id)?.className).toBe(
      "mb-2 font-md p-2 text-blue-500 opacity-50 font-semibold"
    );
  });

  it("base props should be able to work nested", () => {
    const id = getID();

    const StyledInput = ts("input", {
      variants: {
        size: {
          sm: "text-sm",
          md: "text-md",
        },
        color: {
          red: "text-red-500",
          blue: "text-blue-500",
        },
      },
    });

    const MyInput = styled(StyledInput, {
      variants: {
        size: {
          sm: "placeholder:text-xs",
          md: "placeholder:text-sm",
        },
        color: {
          red: "placeholder:text-red-500",
          blue: "placeholder:text-blue-500",
        },
      },
    });

    const MyStyledInput = styled(MyInput, {
      variants: {
        color: {
          red: "hover:text-red-600",
          blue: "hover:text-blue-600",
        },
      },
    });

    render(
      <MyStyledInput
        id={id}
        size="md"
        color="blue"
        __base={{
          color: "red",
          __base: { size: "md", color: "blue", __base: { size: 123 } },
        }}
      />
    );

    const element = document.getElementById(id) as HTMLInputElement;

    expect(element.size).toBe(123);
    expect(element.className).toBe(
      "font-md text-blue-500 placeholder:font-sm placeholder:text-red-500 hover:text-blue-600"
    );
  });
});

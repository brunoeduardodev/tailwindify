import type { ClassDefinition } from "./tf";

type ValidComponent =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

/** TailwindStyle */
export const ts = (
  Component: ValidComponent,
  classDefinition: ClassDefinition
) => {
  return Component;
};

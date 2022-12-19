type ClassDefinition =
  | string
  | string[]
  | Record<"true" | "false", string | undefined>
  | Record<string, boolean | undefined | null>;

//** Tailwind Flat */
export const tf = (...classes: ClassDefinition[]) => {
  return classes.join(" ");
};

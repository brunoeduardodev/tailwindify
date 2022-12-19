type ClassDefinition =
  | string
  | string[]
  | Record<"true" | "false", string | undefined>
  | Record<string, boolean | undefined | null>
  | ClassDefinition[];

export const flatClass = (className: ClassDefinition): string => {
  if (typeof className === "string") return className;

  if (Array.isArray(className)) {
    return className.map(flatClass).join(" ");
  }

  return "";
};

//** Tailwind Flat */
export const tf = (...classes: ClassDefinition[]) => {
  return classes.map(flatClass).join(" ");
};

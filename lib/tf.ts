type ClassDefinition =
  | string
  | Record<"true" | "false", string | undefined>
  | Record<string, boolean | undefined | null>
  | undefined
  | null
  | 0
  | false
  | ClassDefinition[];

export const flatClass = (classDefinition: ClassDefinition): string => {
  if (typeof classDefinition === "string") return classDefinition;

  if (Array.isArray(classDefinition)) {
    return classDefinition.map(flatClass).filter(Boolean).join(" ");
  }

  return "";
};

//** Tailwind Flat */
export const tf = (...classes: ClassDefinition[]) => {
  return classes.map(flatClass).join(" ");
};

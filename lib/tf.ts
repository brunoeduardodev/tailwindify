import type { ClassDefinition } from "./types";

export const flatClass = (classDefinition: ClassDefinition): string => {
  if (typeof classDefinition === "string") return classDefinition;

  if (Array.isArray(classDefinition)) {
    return classDefinition.map(flatClass).filter(Boolean).join(" ");
  }

  if (!classDefinition) return "";
  return flatClass(
    Object.entries(classDefinition).map(([key, value]) => {
      if (!value) return "";
      return key;
    }, [])
  );
};

//** Tailwind Flat */
export const tf = (...classes: ClassDefinition[]) => {
  return classes.map(flatClass).join(" ");
};

import type { ClassDefinition } from "./types";

export const flatClass = (classDefinition: ClassDefinition): string => {
  if (typeof classDefinition === "string") return classDefinition;

  if (Array.isArray(classDefinition)) {
    return classDefinition.map(flatClass).filter(Boolean).join(" ");
  }

  if (!classDefinition) return "";

  // if ("base" in classDefinition) {
  //   const { base, ...fields } = classDefinition;

  //   const fieldsValues = Object.entries(fields).map(
  //     ([key, value]) => {`${key}:${flatClass(value)}`}
  //   );

  //   return flatClass(base, fieldsValues);
  // }

  return flatClass(
    Object.entries(classDefinition).map(([key, value]) => {
      if (!value) return "";
      if (key === "base") return value;
      if (value === true) return key;

      const valueClasses = flatClass(value).split(" ");

      return valueClasses.map((value) => `${key}:${value}`).join(" ");
    }, [])
  );
};

//** Tailwind Flat */
export const tf = (...classes: ClassDefinition[]) => {
  return classes.map(flatClass).filter(Boolean).join(" ");
};

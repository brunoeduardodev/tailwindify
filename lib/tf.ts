type Falsy = "" | 0 | false | null | undefined;

type ClassDefinition =
  | string
  | Record<string, Falsy | true>
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

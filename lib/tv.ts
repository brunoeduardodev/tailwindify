/**
 * Tailwind Variants
 */

import type { ClassDefinition } from "./tf";

type VariantsDefinition = Record<
  string,
  Record<string, ClassDefinition | { base: ClassDefinition }>
>;

type VariantOptions<Variants extends VariantsDefinition> = {
  variants: Variants;

  defaultVariants: {
    [variant in keyof Variants]: keyof Variants[variant];
  };
};

type Options<Variants extends VariantsDefinition> = [
  ...classes: ClassDefinition[],
  variantsOptions: VariantOptions<Variants>
];

const parseOptions = <Variants extends VariantsDefinition>(
  ...options: Options<Variants>
) => {
  if (!options.length) {
    throw new Error("Invalid options");
  }

  const variantsOptions = options.pop() as VariantOptions<Variants>;

  return { variantsOptions, classes: options as ClassDefinition[] };
};

export const tv = <Variants extends VariantsDefinition>(
  ...options: Options<Variants>
) => {
  if (!options.length) {
    throw new Error("Invalid options");
  }

  const { variantsOptions, classes } = parseOptions(...options);

  console.log({ variantsOptions, classes });
};

tv(["a"], {
  variants: {
    intent: {
      primary: {
        base: [""],
      },
      secondary: "mt-2",
    },
  },
  defaultVariants: {
    intent: "secondary",
  },
});

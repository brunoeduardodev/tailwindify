/**
 * Tailwind Variants
 */

import type { ClassDefinition } from "./tf";
import { flatClass } from "./tf";
import { tf } from "./tf";

type VariantsDefinition = Record<string, Record<string, ClassDefinition>>;

type VariantOptions<Variants extends VariantsDefinition> = {
  variants: Variants;

  defaultVariants?: {
    [variant in keyof Variants]?: keyof Variants[variant];
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

type VariantsSelection<Variants extends VariantsDefinition> = {
  [key in keyof Variants]?: keyof Variants[key];
};

const getVariantsClassNames = <Variants extends VariantsDefinition>(
  { variants, defaultVariants }: VariantOptions<Variants>,
  selection: VariantsSelection<Variants>
) => {
  const variantKeys = Object.keys(variants);

  const classes = variantKeys.flatMap((variant: keyof typeof variants) => {
    const selectedVariant = selection[variant] ?? defaultVariants?.[variant];
    if (!selectedVariant) return [];

    const selected = variants[variant][selectedVariant];
    return flatClass(selected);
  });

  return flatClass(classes);
};

export const tv = <Variants extends VariantsDefinition>(
  ...options: Options<Variants>
) => {
  if (!options.length) {
    throw new Error("Invalid options");
  }

  const { variantsOptions, classes } = parseOptions(...options);

  return (selection: VariantsSelection<Variants>) => {
    return flatClass([
      ...classes,
      getVariantsClassNames(variantsOptions, selection),
    ]);
  };
};

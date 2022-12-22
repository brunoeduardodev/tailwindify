/**
 * Tailwind Variants
 */

import type { ClassDefinition } from "./tf";
import { flatClass } from "./tf";

type VariantsDefinition = Record<string, Record<string, ClassDefinition>>;

type VariantsSelection<Variants extends VariantsDefinition> = {
  [key in keyof Variants]: keyof Variants[key];
};

type DefaultVariantsSelection<Variants extends VariantsDefinition> = Partial<
  VariantsSelection<Variants>
>;

type VariantOptions<
  Variants extends VariantsDefinition,
  DefaultVariants extends DefaultVariantsSelection<Variants>
> = {
  variants: Variants;
  defaultVariants?: DefaultVariants;
};

type Options<
  Variants extends VariantsDefinition,
  DefaultVariants extends DefaultVariantsSelection<Variants>
> = [
  ...classes: ClassDefinition[],
  variantsOptions: VariantOptions<Variants, DefaultVariants>
];

export const tv = <
  Variants extends VariantsDefinition,
  DefaultVariants extends DefaultVariantsSelection<Variants>
>(
  ...options: Options<Variants, DefaultVariants>
) => {
  if (!options.length) {
    throw new Error("Invalid options");
  }

  const variantsOptions = options.pop() as VariantOptions<
    Variants,
    DefaultVariants
  >;
  const defaultClasses = [...options] as ClassDefinition[];

  return (
    selection: Omit<VariantsSelection<Variants>, keyof DefaultVariants> & {
      [key in keyof DefaultVariants]?: key extends keyof Variants
        ? keyof Variants[key]
        : never;
    }
  ) => {
    const { variants, defaultVariants } = variantsOptions;
    const variantKeys = Object.keys(variants);

    const variantClasses = variantKeys.flatMap(
      (variant: keyof typeof variants) => {
        const defaultVariant = defaultVariants?.[variant];

        const selectedVariant = selection[variant] ?? defaultVariant;
        if (!selectedVariant) return [];

        const variantsOptions = variants[variant];

        const selected =
          variantsOptions[selectedVariant as keyof typeof variantsOptions];

        return flatClass(selected);
      }
    );

    return flatClass([...defaultClasses, ...variantClasses]);
  };
};

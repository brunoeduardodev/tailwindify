/**
 * Tailwind Variants
 */

import { flatClass } from "./tf";

import type {
  BaseDefaultVariantsSelection,
  ClassDefinition,
  Options,
  VariantOptions,
  VariantsDefinition,
  VariantsSelection,
} from "./types";

export const tv = <
  V extends VariantsDefinition,
  DV extends BaseDefaultVariantsSelection<V>
>(
  ...options: Options<V, DV>
) => {
  if (!options.length) {
    throw new Error("Invalid options");
  }

  const variantsOptions = options.pop() as VariantOptions<V, DV>;
  const defaultClasses = [...options] as ClassDefinition[];

  return (selection: VariantsSelection<V, DV>) => {
    const { variants, defaultVariants, compoundVariants } = variantsOptions;

    const variantKeys = Object.keys(variants);

    const variantClasses = variantKeys.flatMap(
      (variant: keyof typeof variants) => {
        const defaultVariant = defaultVariants?.[variant];
        const selectedVariant =
          selection[variant as keyof typeof selection] ?? defaultVariant;
        if (!selectedVariant) return [];

        const variantsOptions = variants[variant];

        const selected =
          variantsOptions[selectedVariant as keyof typeof variantsOptions];

        return flatClass(selected);
      }
    );

    const compoundVariantsClasses = compoundVariants?.map((compound) => {
      const { classes, ...variants } = compound;
      const variantEntries = Object.entries(variants) as Array<
        [key: keyof V, value: keyof V[keyof V] | Array<keyof V[keyof V]>]
      >;

      const unmatched = variantEntries.reduce((unmatched, [key, value]) => {
        const selectedValue = selection[key] || defaultVariants?.[key];

        if (Array.isArray(value)) {
          if (!selection[key]) return true;

          return (
            unmatched || !value.includes(selectedValue as keyof V[keyof V])
          );
        }

        return unmatched || selectedValue !== value;
      }, false);

      return !unmatched && classes;
    });

    return flatClass([
      ...defaultClasses,
      ...variantClasses,
      compoundVariantsClasses,
    ]);
  };
};

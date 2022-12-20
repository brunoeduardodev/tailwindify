/**
 * Tailwind Variants
 */

import type { ClassDefinition } from "./tf";

type VariantOptions = {
  test: true;
};

type Options = [...classes: ClassDefinition[], variantsOptions: VariantOptions];

const parseOptions = (...options: Options) => {
  if (!options.length) {
    throw new Error("Invalid options");
  }

  const variantsOptions = options.pop() as VariantOptions;

  return { variantsOptions, classes: options as ClassDefinition[] };
};

export const tv = (...options: Options) => {
  if (!options.length) {
    throw new Error("Invalid options");
  }

  const { variantsOptions, classes } = parseOptions(...options);

  console.log({ variantsOptions, classes });
};

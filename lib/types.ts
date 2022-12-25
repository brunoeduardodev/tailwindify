type GetRequired<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P];
};

type RequiredKeys<T> = keyof GetRequired<T>;

type Falsy = "" | 0 | false | null | undefined;

export type ClassDefinition =
  | string
  | Record<string, Falsy | true>
  | undefined
  | null
  | 0
  | false
  | ClassDefinition[];

export type VariantsDefinition = Record<
  string,
  Record<string, ClassDefinition>
>;

export type BaseVariantsSelection<Variants extends VariantsDefinition> = {
  [key in keyof Variants]: keyof Variants[key];
};

export type BaseDefaultVariantsSelection<Variants extends VariantsDefinition> =
  Partial<BaseVariantsSelection<Variants>>;

export type VariantOptions<
  Variants extends VariantsDefinition,
  DefaultVariants extends BaseDefaultVariantsSelection<Variants>
> = {
  variants: Variants;
  defaultVariants?: DefaultVariants;
  compoundVariants?: Array<
    { classes: ClassDefinition } & {
      [Key in keyof Variants]?:
        | keyof Variants[Key]
        | Array<keyof Variants[Key]>;
    }
  >;
};

export type Options<
  Variants extends VariantsDefinition,
  DefaultVariants extends BaseDefaultVariantsSelection<Variants>
> = [
  ...classes: ClassDefinition[],
  variantsOptions: VariantOptions<Variants, DefaultVariants>
];

export type VariantsSelection<
  Variants extends VariantsDefinition,
  DefaultVariants extends BaseDefaultVariantsSelection<Variants>
> = RequiredKeys<DefaultVariants> extends never
  ? BaseVariantsSelection<Variants>
  : Omit<BaseVariantsSelection<Variants>, keyof DefaultVariants> & {
      [key in keyof DefaultVariants]?: key extends keyof Variants
        ? keyof Variants[key]
        : never;
    };

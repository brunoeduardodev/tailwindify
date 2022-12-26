export type GetRequired<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P];
};

export type GetOptional<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P];
};

export type RequiredKeys<T> = keyof GetRequired<T>;
export type OptionalKeys<T> = keyof GetOptional<T>;

export type KeyToAny<Key extends string | number | symbol> = {
  [key in Key]: any;
};

export type GetOverlappingKeys<A, B> = keyof {
  [P in keyof A as Required<B> extends KeyToAny<P> ? P : never]: any;
};

type Falsy = "" | 0 | false | null | undefined;

export type ClassDefinition =
  | string
  | Record<string, Falsy | true>
  | undefined
  | null
  | 0
  | false
  | ClassDefinition[]
  | { [key: string]: ClassDefinition };

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

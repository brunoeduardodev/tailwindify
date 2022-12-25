import React from "react";
import type { ComponentProps, ElementRef } from "react";
import { forwardRef } from "react";
import type { ClassDefinition } from "./tf";
import { tf } from "./tf";
import type {
  DefaultVariantsSelection,
  Options,
  VariantOptions,
  VariantsDefinition,
  VariantsSelection,
} from "./tv";
import { tv } from "./tv";

type GetRequired<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P];
};

type RequiredKeys<T> = keyof GetRequired<T>;

type ValidComponent =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

const separateProps = <Variants extends VariantsDefinition>(
  allProps: object,
  variants: Variants
) => {
  const props: Record<string, any> = {};
  const variantsProps: {
    [key in keyof Variants]?: keyof Variants[key];
  } = {};

  Object.entries(allProps).forEach(([key, value]) => {
    if (key in variants) {
      variantsProps[key as keyof Variants] = value;
      return;
    }

    props[key] = value;
  });

  return { props, variants: variantsProps };
};

/** TailwindStyle */
export const ts = <
  ComponentType extends ValidComponent,
  Variants extends VariantsDefinition,
  DefaultVariants extends DefaultVariantsSelection<Variants>
>(
  Component: ComponentType,
  ...options: Options<Variants, DefaultVariants>
) => {
  const variantsOptions = options.pop() as VariantOptions<
    Variants,
    DefaultVariants
  >;
  const defaultClasses = [...options] as ClassDefinition[];

  type Selection = RequiredKeys<DefaultVariants> extends never
    ? VariantsSelection<Variants>
    : Omit<VariantsSelection<Variants>, keyof DefaultVariants> & {
        [key in keyof DefaultVariants]?: key extends keyof Variants
          ? keyof Variants[key]
          : never;
      };

  const StyledComponent = forwardRef<
    ElementRef<ComponentType>,
    ComponentProps<ComponentType> & Selection & { className?: string }
  >((allProps, ref) => {
    const { props, variants } = separateProps(
      allProps,
      variantsOptions.variants
    );

    const styles = tv(defaultClasses, props.className, variantsOptions);
    console.log(variants);
    console.log(styles(variants as any));

    return React.createElement(Component, {
      ...props,
      className: styles(variants as any),
    });
  });

  return StyledComponent;
};

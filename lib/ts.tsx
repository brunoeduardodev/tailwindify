import React from "react";
import type { ComponentProps, ElementRef } from "react";
import { forwardRef } from "react";
import { tv } from "./tv";
import type {
  BaseDefaultVariantsSelection,
  ClassDefinition,
  Options,
  VariantOptions,
  VariantsDefinition,
  VariantsSelection,
} from "./types";

type ValidComponent =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

const separateProps = <V extends VariantsDefinition>(
  allProps: object,
  variants: V
) => {
  const props: Record<string, any> = {};
  const variantsProps: {
    [key in keyof V]?: keyof V[key];
  } = {};

  Object.entries(allProps).forEach(([key, value]) => {
    if (key in variants) {
      variantsProps[key as keyof V] = value;
      return;
    }

    props[key] = value;
  });

  return { props, variants: variantsProps };
};

/** TailwindStyle */
export const ts = <
  C extends ValidComponent,
  V extends VariantsDefinition,
  DV extends BaseDefaultVariantsSelection<V>
>(
  Component: C,
  ...options: Options<V, DV>
) => {
  const variantsOptions = options.pop() as VariantOptions<V, DV>;
  const defaultClasses = [...options] as ClassDefinition[];

  const StyledComponent = forwardRef<
    ElementRef<C>,
    ComponentProps<C> & VariantsSelection<V, DV>
  >((allProps, ref) => {
    const { props, variants } = separateProps(
      allProps,
      variantsOptions.variants
    );

    const styles = tv(defaultClasses, props.className, variantsOptions);

    return React.createElement(Component, {
      ...props,
      className: styles(variants as VariantsSelection<V, DV>),
    });
  });

  return StyledComponent;
};

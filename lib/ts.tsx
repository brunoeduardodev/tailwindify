import React, { createElement } from "react";
import type {
  ElementRef,
  JSXElementConstructor,
  ComponentPropsWithoutRef,
  ComponentProps,
} from "react";
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
import { tf } from "./tf";

type ValidComponent = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;

const separateProps = <P extends object, V extends VariantsDefinition>(
  allProps: P,
  variants: V
) => {
  allProps;

  const props: Partial<P> = {};
  const variantsProps: {
    [key in keyof V]?: keyof V[key];
  } = {};

  Object.entries(allProps).forEach(([key, value]) => {
    if (key in variants) {
      variantsProps[key as keyof V] = value;
      return;
    }

    props[key as keyof P] = value;
  });

  return { props: props as P, variants: variantsProps };
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
    C,
    ComponentProps<C> & VariantsSelection<V, DV>
  >((allProps, ref) => {
    const { props, variants } = separateProps(
      allProps,
      variantsOptions.variants
    );

    const styles = tv(defaultClasses, variantsOptions);

    return createElement<ComponentProps<C> & VariantsSelection<V, DV>>(
      Component,
      {
        ...props,
        className: tf(
          styles(variants as VariantsSelection<V, DV>),
          props.className
        ),
        ref,
      }
    );
  });

  const displayName =
    typeof Component === "string"
      ? `T.${Component}`
      : "displayName" in Component
      ? (Component as any).displayName
      : undefined;

  if (displayName) {
    StyledComponent.displayName = displayName;
  }

  return StyledComponent;
};

import { createElement } from "react";
import type { JSXElementConstructor, ComponentProps } from "react";
import { forwardRef } from "react";
import { tv } from "./tv";
import type {
  BaseDefaultVariantsSelection,
  ClassDefinition,
  GetOverlappingKeys,
  KeyToAny,
  Options,
  RequiredKeys,
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
  const propsPool: Partial<P> = {};

  if ("__base" in allProps) {
    Object.assign(propsPool, (allProps as any).__base);
  }

  const variantsProps: {
    [key in keyof V]?: keyof V[key];
  } = {};

  Object.entries(allProps).forEach(([key, value]) => {
    if (key === "__base") return;

    if (key in variants) {
      variantsProps[key as keyof V] = value;
      return;
    }

    propsPool[key as keyof P] = value;
  });

  return { props: propsPool as P, variants: variantsProps };
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

  type BaseOverlappingKeys = GetOverlappingKeys<
    ComponentProps<C>,
    KeyToAny<keyof VariantsSelection<V, DV>>
  >;

  type OverlappingKeys = BaseOverlappingKeys extends never
    ? never
    : GetOverlappingKeys<
        ComponentProps<C>,
        KeyToAny<keyof VariantsSelection<V, DV> | "__base">
      >;

  type OverlappingProperties = Pick<ComponentProps<C>, OverlappingKeys>;
  type BaseProperty = RequiredKeys<OverlappingProperties> extends never
    ? {
        __base?: OverlappingProperties;
      }
    : { __base: OverlappingProperties };

  type Props = OverlappingKeys extends never
    ? ComponentProps<C> & VariantsSelection<V, DV>
    : Omit<ComponentProps<C>, OverlappingKeys> &
        VariantsSelection<V, DV> &
        BaseProperty;

  const StyledComponent = forwardRef<C, Props>((allProps, ref) => {
    const { props, variants } = separateProps(
      allProps,
      variantsOptions.variants
    );

    const styles = tv(defaultClasses, variantsOptions);

    return createElement<Props>(Component, {
      ...(props as ComponentProps<C>),
      className: tf(
        styles(variants as VariantsSelection<V, DV>),
        props.className
      ),
      ref,
    });
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

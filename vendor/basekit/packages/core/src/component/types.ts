import type { ComponentType } from "react";
import type { UIChild, UINode } from "../node/types";

/**
 * Props accepted by any declarative factory: its own props (minus `children`,
 * which is widened to accept declarative nodes) plus an optional `key`.
 *
 * Overriding `children` rather than intersecting it lets a React view declare
 * `children?: ReactNode` while the factory still accepts `UIChild` trees.
 */
export type WithChildren<Props> = Omit<Props, "children"> & {
  children?: UIChild | UIChild[];
  key?: string | number;
};

/**
 * A declarative component factory. Call it like a function to get a
 * {@link UINode}; it also carries its registry name for tooling and rendering.
 *
 * @example const node = Button({ text: "Save", tone: "primary" });
 */
export type DeclarativeComponent<Props extends Record<string, unknown>> = ((
  props?: WithChildren<Props>,
) => UINode<Props>) & {
  readonly componentName: string;
};

/**
 * The renderer registry: maps a component name to the React implementation
 * used to render its nodes (or to an intrinsic tag name like "div").
 */
export type ComponentRegistry = Record<
  string,
  ComponentType<Record<string, unknown>> | string
>;

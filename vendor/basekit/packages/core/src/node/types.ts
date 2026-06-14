import type { ReactNode } from "react";

/** Primitive values that may appear directly as children. */
export type UIPrimitive = string | number | boolean | null | undefined;

/**
 * Anything that can be a child of a declarative node: another node, a
 * primitive, or a raw React element (the escape hatch into JSX).
 */
export type UIChild = UINode | UIPrimitive | ReactNode;

/**
 * The atom of the declarative layer. Produced by component factories
 * (`Button(...)`, `Card(...)`) and consumed by the renderer.
 *
 * It is a plain serialisable-ish object: `component` is the registry key,
 * `props` the resolved props, and `children` the normalised child list.
 */
export interface UINode<
  Props extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Discriminator used by guards and tooling. */
  readonly $$basekit: "node";
  /** Registry key, e.g. "Button". */
  readonly component: string;
  readonly props: Props;
  readonly children: UIChild[];
  /** Optional stable key for list rendering. */
  readonly key?: string | number;
}

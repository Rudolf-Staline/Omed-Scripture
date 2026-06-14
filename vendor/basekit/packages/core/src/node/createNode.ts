import { normalizeChildren } from "./normalizeChildren";
import type { UIChild, UINode } from "./types";

/**
 * Creates a {@link UINode}. Children may be passed explicitly or via a
 * `children` prop; explicit children win. The `key` prop, if present, is
 * lifted onto the node for stable list rendering.
 */
export const createNode = <Props extends Record<string, unknown>>(
  component: string,
  props: Props = {} as Props,
  children?: UIChild | UIChild[],
): UINode<Props> => {
  const resolvedChildren =
    children !== undefined
      ? children
      : (props as { children?: UIChild | UIChild[] }).children;

  const key = (props as { key?: string | number }).key;

  return {
    $$basekit: "node",
    component,
    props,
    children: normalizeChildren(resolvedChildren),
    ...(key !== undefined ? { key } : {}),
  };
};

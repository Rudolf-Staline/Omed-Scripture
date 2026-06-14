import type { UIChild, UINode } from "./types";
/**
 * Creates a {@link UINode}. Children may be passed explicitly or via a
 * `children` prop; explicit children win. The `key` prop, if present, is
 * lifted onto the node for stable list rendering.
 */
export declare const createNode: <Props extends Record<string, unknown>>(component: string, props?: Props, children?: UIChild | UIChild[]) => UINode<Props>;
//# sourceMappingURL=createNode.d.ts.map
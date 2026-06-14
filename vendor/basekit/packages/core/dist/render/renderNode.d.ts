import { type ReactNode } from "react";
import type { ComponentRegistry } from "../component/types";
import type { UIChild, UINode } from "../node/types";
export type RenderFallback = (componentName: string, node: UINode) => ReactNode;
/**
 * Renders a single declarative child into React.
 *
 * Handles every {@link UIChild} shape: text (string/number) renders as-is,
 * empty values (`null`/`false`/`undefined`/`true`) render nothing, arrays are
 * fragment-wrapped, raw React elements pass through untouched, and
 * {@link UINode}s are looked up in the registry. Unknown components fall back
 * to a visible marker instead of crashing the tree.
 */
export declare const renderNode: (node: UIChild, registry: ComponentRegistry, fallback?: RenderFallback) => ReactNode;
/**
 * Renders a list of children, assigning stable keys (a child's own `key` wins,
 * otherwise the index) so React reconciliation stays predictable.
 */
export declare const renderChildren: (children: UIChild | UIChild[] | undefined, registry: ComponentRegistry, fallback?: RenderFallback) => ReactNode[];
//# sourceMappingURL=renderNode.d.ts.map
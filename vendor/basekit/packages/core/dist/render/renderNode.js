import { createElement, Fragment, isValidElement } from "react";
import { isEmptyChild, isRenderableText, isUINode } from "../node/guards";
import { normalizeChildren } from "../node/normalizeChildren";
import { warnOnce } from "../utils/invariant";
const defaultFallback = (componentName) => {
    warnOnce(`Unknown component "${componentName}" — did you register it?`);
    return createElement("span", {
        "data-basekit-unknown": componentName,
        style: { color: "var(--bk-danger)", fontFamily: "monospace" },
    }, `⚠ Unknown component: ${componentName}`);
};
/**
 * Renders a single declarative child into React.
 *
 * Handles every {@link UIChild} shape: text (string/number) renders as-is,
 * empty values (`null`/`false`/`undefined`/`true`) render nothing, arrays are
 * fragment-wrapped, raw React elements pass through untouched, and
 * {@link UINode}s are looked up in the registry. Unknown components fall back
 * to a visible marker instead of crashing the tree.
 */
export const renderNode = (node, registry, fallback = defaultFallback) => {
    if (isEmptyChild(node))
        return null;
    if (isRenderableText(node))
        return node;
    if (Array.isArray(node)) {
        return renderChildren(node, registry, fallback);
    }
    if (isUINode(node)) {
        const uiNode = node;
        const Component = registry[uiNode.component];
        if (Component === undefined) {
            return fallback(uiNode.component, uiNode);
        }
        const { children: _ignored, key, ...props } = uiNode.props;
        void _ignored;
        void key;
        const rendered = renderChildren(uiNode.children, registry, fallback);
        return createElement(Component, uiNode.key !== undefined ? { ...props, key: uiNode.key } : props, ...rendered);
    }
    // Already a valid React element (the JSX escape hatch) — render directly.
    if (isValidElement(node))
        return node;
    return node;
};
/**
 * Renders a list of children, assigning stable keys (a child's own `key` wins,
 * otherwise the index) so React reconciliation stays predictable.
 */
export const renderChildren = (children, registry, fallback) => normalizeChildren(children).map((child, index) => {
    const key = isUINode(child) && child.key !== undefined ? child.key : index;
    return createElement(Fragment, { key }, renderNode(child, registry, fallback));
});
//# sourceMappingURL=renderNode.js.map
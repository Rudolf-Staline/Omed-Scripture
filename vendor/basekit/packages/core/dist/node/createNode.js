import { normalizeChildren } from "./normalizeChildren";
/**
 * Creates a {@link UINode}. Children may be passed explicitly or via a
 * `children` prop; explicit children win. The `key` prop, if present, is
 * lifted onto the node for stable list rendering.
 */
export const createNode = (component, props = {}, children) => {
    const resolvedChildren = children !== undefined
        ? children
        : props.children;
    const key = props.key;
    return {
        $$basekit: "node",
        component,
        props,
        children: normalizeChildren(resolvedChildren),
        ...(key !== undefined ? { key } : {}),
    };
};
//# sourceMappingURL=createNode.js.map
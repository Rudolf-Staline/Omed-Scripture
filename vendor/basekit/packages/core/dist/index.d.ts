/**
 * @basekit/core — the declarative engine.
 *
 * Provides the node model (`UINode`, `createNode`, `normalizeChildren`), the
 * component factory + registry, the React renderer (`renderNode`), the page
 * builder (`createPage`, `Page`, `usePageRuntime`) and a handful of styling
 * utilities (`cn`, `variants`). It is renderer-agnostic at the model level: a
 * future non-React renderer could consume the same `UINode` trees.
 */
export * from "./node";
export * from "./component";
export * from "./render";
export * from "./page";
export * from "./utils";
//# sourceMappingURL=index.d.ts.map
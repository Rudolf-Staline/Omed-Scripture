import { createElement, Fragment, isValidElement, type ReactNode } from "react";
import type { ComponentRegistry } from "../component/types";
import { isEmptyChild, isRenderableText, isUINode } from "../node/guards";
import { normalizeChildren } from "../node/normalizeChildren";
import type { UIChild, UINode } from "../node/types";
import { warnOnce } from "../utils/invariant";

export type RenderFallback = (componentName: string, node: UINode) => ReactNode;

const defaultFallback: RenderFallback = (componentName) => {
  warnOnce(`Unknown component "${componentName}" — did you register it?`);
  return createElement(
    "span",
    {
      "data-basekit-unknown": componentName,
      style: { color: "var(--bk-danger)", fontFamily: "monospace" },
    },
    `⚠ Unknown component: ${componentName}`,
  );
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
export const renderNode = (
  node: UIChild,
  registry: ComponentRegistry,
  fallback: RenderFallback = defaultFallback,
): ReactNode => {
  if (isEmptyChild(node)) return null;
  if (isRenderableText(node)) return node;

  if (Array.isArray(node)) {
    return renderChildren(node, registry, fallback);
  }

  if (isUINode(node)) {
    const uiNode = node as UINode;
    const Component = registry[uiNode.component];
    if (Component === undefined) {
      return fallback(uiNode.component, uiNode);
    }
    const {
      children: _ignored,
      key,
      ...props
    } = uiNode.props as {
      children?: unknown;
      key?: unknown;
    } & Record<string, unknown>;
    void _ignored;
    void key;
    const rendered = renderChildren(uiNode.children, registry, fallback);
    return createElement(
      Component,
      uiNode.key !== undefined ? { ...props, key: uiNode.key } : props,
      ...rendered,
    );
  }

  // Already a valid React element (the JSX escape hatch) — render directly.
  if (isValidElement(node)) return node;

  return node as ReactNode;
};

/**
 * Renders a list of children, assigning stable keys (a child's own `key` wins,
 * otherwise the index) so React reconciliation stays predictable.
 */
export const renderChildren = (
  children: UIChild | UIChild[] | undefined,
  registry: ComponentRegistry,
  fallback?: RenderFallback,
): ReactNode[] =>
  normalizeChildren(children).map((child, index) => {
    const key = isUINode(child) && child.key !== undefined ? child.key : index;
    return createElement(
      Fragment,
      { key },
      renderNode(child, registry, fallback),
    );
  });

import type { UIChild, UINode } from "./types";

/** Narrows an arbitrary child to a Basekit {@link UINode}. */
export const isUINode = (value: unknown): value is UINode =>
  typeof value === "object" &&
  value !== null &&
  (value as { $$basekit?: unknown }).$$basekit === "node";

/** True for values the renderer turns into text (string / number). */
export const isRenderableText = (value: UIChild): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** True for values the renderer should skip entirely. */
export const isEmptyChild = (value: UIChild): boolean =>
  value === null || value === undefined || value === false || value === true;

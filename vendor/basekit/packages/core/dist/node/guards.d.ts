import type { UIChild, UINode } from "./types";
/** Narrows an arbitrary child to a Basekit {@link UINode}. */
export declare const isUINode: (value: unknown) => value is UINode;
/** True for values the renderer turns into text (string / number). */
export declare const isRenderableText: (value: UIChild) => value is string | number;
/** True for values the renderer should skip entirely. */
export declare const isEmptyChild: (value: UIChild) => boolean;
//# sourceMappingURL=guards.d.ts.map
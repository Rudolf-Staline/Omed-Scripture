/** Narrows an arbitrary child to a Basekit {@link UINode}. */
export const isUINode = (value) => typeof value === "object" &&
    value !== null &&
    value.$$basekit === "node";
/** True for values the renderer turns into text (string / number). */
export const isRenderableText = (value) => typeof value === "string" || typeof value === "number";
/** True for values the renderer should skip entirely. */
export const isEmptyChild = (value) => value === null || value === undefined || value === false || value === true;
//# sourceMappingURL=guards.js.map
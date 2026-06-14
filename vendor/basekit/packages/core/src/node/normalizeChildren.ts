import type { UIChild } from "./types";

/**
 * Flattens a children prop (single value or array, possibly nested) into a flat
 * list, dropping nothing-y values (`null`, `undefined`, `false`, `true`) so the
 * renderer never has to special-case them. `0` and `""` are kept on purpose.
 */
export const normalizeChildren = (
  children?: UIChild | UIChild[],
): UIChild[] => {
  if (children === undefined || children === null) return [];
  const list = Array.isArray(children) ? children : [children];
  const out: UIChild[] = [];
  for (const child of list) {
    if (
      child === null ||
      child === undefined ||
      child === false ||
      child === true
    ) {
      continue;
    }
    if (Array.isArray(child)) {
      out.push(...normalizeChildren(child));
    } else {
      out.push(child);
    }
  }
  return out;
};

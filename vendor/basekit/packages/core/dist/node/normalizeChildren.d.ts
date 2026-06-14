import type { UIChild } from "./types";
/**
 * Flattens a children prop (single value or array, possibly nested) into a flat
 * list, dropping nothing-y values (`null`, `undefined`, `false`, `true`) so the
 * renderer never has to special-case them. `0` and `""` are kept on purpose.
 */
export declare const normalizeChildren: (children?: UIChild | UIChild[]) => UIChild[];
//# sourceMappingURL=normalizeChildren.d.ts.map
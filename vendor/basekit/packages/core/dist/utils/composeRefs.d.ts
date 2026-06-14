import type { Ref } from "react";
/** Assigns a value to a callback or object ref. */
export declare const setRef: <T>(ref: Ref<T> | undefined, value: T) => void;
/** Merges several refs into one, so a component can forward and keep a ref. */
export declare const composeRefs: <T>(...refs: Array<Ref<T> | undefined>) => Ref<T>;
//# sourceMappingURL=composeRefs.d.ts.map
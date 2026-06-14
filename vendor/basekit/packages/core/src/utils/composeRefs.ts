import type { MutableRefObject, Ref } from "react";

/** Assigns a value to a callback or object ref. */
export const setRef = <T>(ref: Ref<T> | undefined, value: T): void => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && typeof ref === "object") {
    (ref as MutableRefObject<T>).current = value;
  }
};

/** Merges several refs into one, so a component can forward and keep a ref. */
export const composeRefs =
  <T>(...refs: Array<Ref<T> | undefined>): Ref<T> =>
  (value: T | null) => {
    refs.forEach((ref) => setRef(ref, value as T));
  };

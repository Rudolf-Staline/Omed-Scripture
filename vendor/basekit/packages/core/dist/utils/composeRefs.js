/** Assigns a value to a callback or object ref. */
export const setRef = (ref, value) => {
    if (typeof ref === "function") {
        ref(value);
    }
    else if (ref && typeof ref === "object") {
        ref.current = value;
    }
};
/** Merges several refs into one, so a component can forward and keep a ref. */
export const composeRefs = (...refs) => (value) => {
    refs.forEach((ref) => setRef(ref, value));
};
//# sourceMappingURL=composeRefs.js.map
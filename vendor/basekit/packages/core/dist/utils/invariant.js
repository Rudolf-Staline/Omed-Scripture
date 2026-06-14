/** Throws a namespaced error when `condition` is falsy. */
export function invariant(condition, message) {
    if (!condition) {
        throw new Error(`[basekit] ${message}`);
    }
}
/** Logs a namespaced warning once per unique message (dev ergonomics). */
const warned = new Set();
export const warnOnce = (message) => {
    if (warned.has(message))
        return;
    warned.add(message);
    if (typeof console !== "undefined") {
        console.warn(`[basekit] ${message}`);
    }
};
//# sourceMappingURL=invariant.js.map
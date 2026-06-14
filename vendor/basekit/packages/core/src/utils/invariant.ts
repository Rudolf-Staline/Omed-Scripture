/** Throws a namespaced error when `condition` is falsy. */
export function invariant(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(`[basekit] ${message}`);
  }
}

/** Logs a namespaced warning once per unique message (dev ergonomics). */
const warned = new Set<string>();
export const warnOnce = (message: string): void => {
  if (warned.has(message)) return;
  warned.add(message);
  if (typeof console !== "undefined") {
    console.warn(`[basekit] ${message}`);
  }
};

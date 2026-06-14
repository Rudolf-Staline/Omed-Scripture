/**
 * Tiny, dependency-free class name joiner. Flattens arrays and drops falsy
 * values so conditional classes read cleanly: `cn("base", active && "on")`.
 */
export const cn = (...inputs) => {
    const out = [];
    for (const input of inputs) {
        if (!input)
            continue;
        if (typeof input === "string" || typeof input === "number") {
            out.push(String(input));
        }
        else if (Array.isArray(input)) {
            const inner = cn(...input);
            if (inner)
                out.push(inner);
        }
    }
    return out.join(" ");
};
//# sourceMappingURL=cn.js.map
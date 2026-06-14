import { jsx as _jsx } from "react/jsx-runtime";
import { isValidElement } from "react";
import { Icon } from "./Icon";
export * from "./props";
export * from "./styles";
export { Icon } from "./Icon";
const iconNames = new Set([
    "filter",
    "undo",
    "close",
    "check",
    "check-circle",
    "info",
    "warning",
    "error",
    "search",
    "plus",
    "calendar",
    "chevron-down",
    "chevron-right",
    "chevron-left",
    "menu",
    "arrow-right",
    "trash",
    "settings",
    "user",
    "external",
    "spinner",
]);
/** Renders an {@link IconSlot}: string → built-in glyph, otherwise pass-through. */
export const renderIcon = (slot, size) => {
    if (slot == null || slot === false)
        return null;
    if (typeof slot === "string" && iconNames.has(slot)) {
        return _jsx(Icon, { name: slot, size: size });
    }
    if (isValidElement(slot))
        return slot;
    return slot;
};
//# sourceMappingURL=index.js.map
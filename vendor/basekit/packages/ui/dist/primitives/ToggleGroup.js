import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useState } from "react";
import { cn, createComponent } from "@basekit/core";
import { controlSizeStyles, focusRing, interactiveToneStyles, radiusStyles, renderIcon, } from "../internal";
const base = "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium " +
    "transition-colors select-none disabled:pointer-events-none disabled:opacity-55";
export const ToggleView = forwardRef(function ToggleView({ id, className, children, text, icon, pressed, defaultPressed = false, disabled, hidden, tone = "neutral", variant = "ghost", size = "md", testId, onPressedChange, ...rest }, ref) {
    const [internal, setInternal] = useState(defaultPressed);
    const isPressed = pressed ?? internal;
    if (hidden)
        return null;
    const label = children ?? text;
    // When on, render the segment as a solid/active surface of the same tone.
    const activeStyles = interactiveToneStyles[variant === "ghost" ? "soft" : variant][tone];
    const inactiveStyles = interactiveToneStyles[variant][tone];
    return (_jsxs("button", { ref: ref, id: id, type: "button", "aria-pressed": isPressed, "aria-label": rest["aria-label"], disabled: disabled, "data-testid": testId, "data-state": isPressed ? "on" : "off", onClick: () => {
            const next = !isPressed;
            setInternal(next);
            onPressedChange?.(next);
        }, className: cn(base, focusRing, controlSizeStyles[size], radiusStyles.md, isPressed ? activeStyles : cn(inactiveStyles, "text-muted-foreground"), className), children: [renderIcon(icon), label != null && _jsx("span", { children: label })] }));
});
export const Toggle = createComponent("Toggle");
export const ToggleGroupView = ({ id, className, type = "single", options, value, defaultValue, values, defaultValues, orientation = "horizontal", disabled, hidden, tone = "neutral", variant = "outline", size = "sm", testId, onValueChange, onValuesChange, ...rest }) => {
    const [internalSingle, setInternalSingle] = useState(defaultValue ?? "");
    const [internalMultiple, setInternalMultiple] = useState(defaultValues ?? []);
    const currentSingle = value ?? internalSingle;
    const currentMultiple = values ?? internalMultiple;
    if (hidden)
        return null;
    const isOn = (optionValue) => type === "multiple"
        ? currentMultiple.includes(optionValue)
        : currentSingle === optionValue;
    const toggle = (optionValue) => {
        if (type === "multiple") {
            const next = currentMultiple.includes(optionValue)
                ? currentMultiple.filter((v) => v !== optionValue)
                : [...currentMultiple, optionValue];
            setInternalMultiple(next);
            onValuesChange?.(next);
        }
        else {
            // Single mode toggles the value off when re-selected.
            const next = currentSingle === optionValue ? "" : optionValue;
            setInternalSingle(next);
            onValueChange?.(next);
        }
    };
    return (_jsx("div", { id: id, role: "group", "aria-label": rest["aria-label"], "data-testid": testId, className: cn("inline-flex gap-1", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap", className), children: options.map((option) => (_jsx(ToggleView, { tone: tone, variant: variant, size: size, icon: option.icon, text: option.label ?? option.value, "aria-label": option["aria-label"], pressed: isOn(option.value), disabled: disabled || option.disabled, onPressedChange: () => toggle(option.value) }, option.value))) }));
};
export const ToggleGroup = createComponent("ToggleGroup");
//# sourceMappingURL=ToggleGroup.js.map
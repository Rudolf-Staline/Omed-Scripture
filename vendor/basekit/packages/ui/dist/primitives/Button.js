import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, cloneElement, forwardRef, isValidElement, } from "react";
import { cn, createComponent } from "@basekit/core";
import { controlSizeStyles, focusRing, Icon, iconButtonSizeStyles, interactiveToneStyles, radiusStyles, renderIcon, } from "../internal";
const base = "relative inline-flex items-center justify-center whitespace-nowrap font-medium " +
    "transition-colors select-none disabled:pointer-events-none disabled:opacity-55";
export const ButtonView = forwardRef(function ButtonView({ id, className, children, text, type = "button", tone = "primary", variant = "solid", size = "md", radius = "md", disabled, loading, fullWidth, hidden, iconLeft, iconRight, square, testId, title, onClick, ...rest }, ref) {
    if (hidden)
        return null;
    const label = children ?? text;
    return (_jsxs("button", { ref: ref, id: id, type: type, title: title, "data-testid": testId, "data-loading": loading || undefined, disabled: disabled || loading, "aria-busy": loading || undefined, "aria-label": rest["aria-label"], onClick: onClick, onMouseDown: rest.onMouseDown, onMouseEnter: rest.onMouseEnter, onMouseLeave: rest.onMouseLeave, onFocus: rest.onFocus, onBlur: rest.onBlur, className: cn(base, focusRing, square ? iconButtonSizeStyles[size] : controlSizeStyles[size], radiusStyles[radius], interactiveToneStyles[variant][tone], fullWidth && "w-full", className), children: [loading && (_jsx(Icon, { name: "spinner", className: "absolute animate-spin", "aria-hidden": true })), _jsxs("span", { className: cn("inline-flex items-center gap-2", loading && "invisible"), children: [renderIcon(iconLeft), label != null && _jsx("span", { children: label }), renderIcon(iconRight)] })] }));
});
export const Button = createComponent("Button");
export const IconButtonView = forwardRef(function IconButtonView({ icon, tone = "neutral", variant = "ghost", size = "md", radius = "md", className, loading, ...rest }, ref) {
    return (_jsx(ButtonView, { ref: ref, tone: tone, variant: variant, size: size, radius: radius, loading: loading, square: true, className: className, ...rest, children: renderIcon(icon) }));
});
export const IconButton = createComponent("IconButton");
export const ButtonGroupView = forwardRef(function ButtonGroupView({ id, className, children, orientation = "horizontal", attached, size, variant, tone, disabled, hidden, ...rest }, ref) {
    if (hidden)
        return null;
    const vertical = orientation === "vertical";
    // Forward group-level defaults to children that haven't set their own.
    const enhanced = Children.map(children, (child) => {
        if (!isValidElement(child))
            return child;
        const childProps = child.props;
        const next = {};
        if (size != null && childProps.size == null)
            next.size = size;
        if (variant != null && childProps.variant == null)
            next.variant = variant;
        if (tone != null && childProps.tone == null)
            next.tone = tone;
        if (disabled && childProps.disabled == null)
            next.disabled = true;
        return Object.keys(next).length > 0 ? cloneElement(child, next) : child;
    });
    return (_jsx("div", { ref: ref, id: id, role: "group", "aria-label": rest["aria-label"], className: cn("isolate inline-flex", vertical ? "flex-col" : "flex-row", attached
            ? cn("[&>button]:rounded-none", vertical
                ? "[&>button:first-child]:rounded-t-md [&>button:last-child]:rounded-b-md [&>button+button]:-mt-px"
                : "[&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button+button]:-ml-px", "[&>button]:focus-visible:z-10")
            : "gap-2", className), children: enhanced }));
});
export const ButtonGroup = createComponent("ButtonGroup");
//# sourceMappingURL=Button.js.map
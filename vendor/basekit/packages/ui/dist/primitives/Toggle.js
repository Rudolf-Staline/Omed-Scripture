import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useId } from "react";
import { cn, createComponent } from "@basekit/core";
import { Icon } from "../internal";
export const CheckboxView = forwardRef(function CheckboxView({ id, name, label, description, helperText, error, indeterminate, checked, defaultChecked, disabled, required, hidden, className, testId, onChange, onCheckedChange, }, ref) {
    const generatedId = useId();
    const id_ = id ?? name ?? generatedId;
    if (hidden)
        return null;
    return (_jsxs("label", { htmlFor: id_, className: cn("flex cursor-pointer items-start gap-2.5", disabled && "cursor-not-allowed opacity-60", className), children: [_jsxs("span", { className: "relative mt-0.5 inline-flex h-5 w-5", children: [_jsx("input", { ref: ref, id: id_, name: name, type: "checkbox", checked: checked, defaultChecked: defaultChecked, disabled: disabled, required: required, "data-testid": testId, "data-indeterminate": indeterminate ? true : undefined, className: "peer sr-only", onChange: (event) => { onChange?.(event.target.checked); onCheckedChange?.(event.target.checked); } }), _jsx("span", { className: cn("h-5 w-5 rounded-md border border-input bg-surface transition-colors", "peer-checked:border-primary peer-checked:bg-primary peer-data-[indeterminate=true]:border-primary peer-data-[indeterminate=true]:bg-primary", "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"), "aria-hidden": true }), _jsx(Icon, { name: "check", size: 14, className: "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100 peer-data-[indeterminate=true]:opacity-100", "aria-hidden": true })] }), (label != null || description != null || helperText != null || error != null) && (_jsxs("span", { className: "flex flex-col", children: [label != null && (_jsx("span", { className: "text-bk-sm font-medium text-foreground", children: label })), error != null ? (_jsx("span", { className: "text-bk-sm text-danger", children: error })) : (description != null || helperText != null) ? (_jsx("span", { className: "text-bk-sm text-muted-foreground", children: description ?? helperText })) : null] }))] }));
});
export const Checkbox = createComponent("Checkbox");
export const SwitchView = forwardRef(function SwitchView({ id, name, label, checked, defaultChecked, disabled, hidden, className, testId, onChange, onCheckedChange, }, ref) {
    const generatedId = useId();
    const id_ = id ?? name ?? generatedId;
    if (hidden)
        return null;
    return (_jsxs("label", { htmlFor: id_, className: cn("flex cursor-pointer items-center gap-2.5", disabled && "cursor-not-allowed opacity-60", className), children: [_jsxs("span", { className: "relative inline-flex", children: [_jsx("input", { ref: ref, id: id_, name: name, type: "checkbox", role: "switch", checked: checked, defaultChecked: defaultChecked, disabled: disabled, "data-testid": testId, className: "peer sr-only", onChange: (event) => { onChange?.(event.target.checked); onCheckedChange?.(event.target.checked); } }), _jsx("span", { className: cn("h-6 w-10 rounded-full bg-input transition-colors peer-checked:bg-primary", "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"), "aria-hidden": true }), _jsx("span", { className: "pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-surface shadow-sm transition-transform peer-checked:translate-x-4" })] }), label != null && (_jsx("span", { className: "text-bk-sm font-medium text-foreground", children: label }))] }));
});
export const Switch = createComponent("Switch");
//# sourceMappingURL=Toggle.js.map
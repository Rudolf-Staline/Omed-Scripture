import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useId, useState } from "react";
import { cn, createComponent } from "@basekit/core";
import { FieldShell } from "./Input";
export const RadioView = forwardRef(function RadioView({ id, name, value, checked, defaultChecked, disabled, required, label, helperText, error, onChange, onCheckedChange, testId, className }, ref) {
    const generated = useId();
    const id_ = id ?? `${name ?? "radio"}-${generated}`;
    return _jsxs("label", { htmlFor: id_, className: cn("flex cursor-pointer items-start gap-2.5", disabled && "cursor-not-allowed opacity-60", className), children: [_jsxs("span", { className: "relative mt-0.5 inline-flex h-5 w-5", children: [_jsx("input", { ref: ref, id: id_, name: name, value: value, type: "radio", checked: checked, defaultChecked: defaultChecked, disabled: disabled, required: required, "data-testid": testId, className: "peer sr-only", "aria-invalid": error ? true : undefined, onChange: (e) => { onChange?.(e); onCheckedChange?.(e.target.checked); } }), _jsx("span", { className: "h-5 w-5 rounded-full border border-input bg-surface transition-colors peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring" }), _jsx("span", { className: "absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 peer-checked:opacity-100" })] }), (label || helperText || error) && _jsxs("span", { className: "flex flex-col", children: [_jsx("span", { className: "text-bk-sm font-medium text-foreground", children: label }), error ? _jsx("span", { className: "text-bk-sm text-danger", children: error }) : helperText ? _jsx("span", { className: "text-bk-sm text-muted-foreground", children: helperText }) : null] })] });
});
export const Radio = createComponent("Radio");
export const RadioGroupView = ({ id, name, label, value, defaultValue, options, orientation = "vertical", disabled, required, error, helperText, onValueChange, testId, className }) => {
    const generated = useId();
    const name_ = name ?? id ?? generated;
    const [internal, setInternal] = useState(defaultValue ?? "");
    const current = value ?? internal;
    return _jsx(FieldShell, { id: id ?? name_, label: label, error: error, helperText: helperText, required: required, className: className, children: _jsx("div", { role: "radiogroup", "data-testid": testId, className: cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"), children: options.map((o) => _jsx(RadioView, { name: name_, value: o.value, checked: current === o.value, disabled: disabled || o.disabled, required: required, label: o.label, helperText: o.helperText, onCheckedChange: (checked) => { if (checked) {
                    setInternal(o.value);
                    onValueChange?.(o.value);
                } } }, o.value)) }) });
};
export const RadioGroup = createComponent("RadioGroup");
export const CheckboxGroupView = ({ label, values, defaultValues = [], options, orientation = "vertical", disabled, error, helperText, onValuesChange, testId, className }) => {
    const id = useId();
    const [internal, setInternal] = useState(defaultValues);
    const current = values ?? internal;
    const update = (v, checked) => { const next = checked ? Array.from(new Set([...current, v])) : current.filter((x) => x !== v); setInternal(next); onValuesChange?.(next); };
    return _jsx(FieldShell, { id: id, label: label, error: error, helperText: helperText, className: className, children: _jsx("div", { "data-testid": testId, className: cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"), children: options.map((o) => _jsxs("label", { className: cn("flex cursor-pointer items-start gap-2.5", (disabled || o.disabled) && "cursor-not-allowed opacity-60"), children: [_jsx("input", { type: "checkbox", className: "mt-1 h-4 w-4 accent-primary", checked: current.includes(o.value), disabled: disabled || o.disabled, onChange: (e) => update(o.value, e.target.checked) }), _jsx("span", { className: "text-bk-sm text-foreground", children: o.label })] }, o.value)) }) });
};
export const CheckboxGroup = createComponent("CheckboxGroup");
//# sourceMappingURL=Selection.js.map
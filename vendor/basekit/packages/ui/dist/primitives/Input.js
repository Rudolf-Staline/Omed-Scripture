import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useId, } from "react";
import { cn, createComponent } from "@basekit/core";
import { focusRing } from "../internal";
export const FieldShell = ({ id, label, error, helperText, required, className, hidden, children, }) => {
    if (hidden)
        return null;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    return (_jsxs("div", { className: cn("flex flex-col gap-1.5", className), children: [label != null && (_jsxs("label", { htmlFor: id, className: "text-bk-sm font-medium text-foreground", children: [label, required && (_jsxs("span", { className: "text-danger", "aria-hidden": true, children: [" ", "*"] }))] })), children, error ? (_jsx("p", { id: errorId, className: "text-bk-sm text-danger", role: "alert", children: error })) : helperText ? (_jsx("p", { id: helperId, className: "text-bk-sm text-muted-foreground", children: helperText })) : null] }));
};
export const fieldControl = "flex w-full items-center gap-2 rounded-md border bg-surface px-3 text-bk-sm text-foreground " +
    "transition-colors placeholder:text-muted-foreground " +
    "disabled:cursor-not-allowed disabled:opacity-60";
export const fieldBorder = (hasError) => hasError
    ? "border-danger focus-within:border-danger focus-within:ring-2 focus-within:ring-danger/40"
    : "border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/40";
export const InputView = forwardRef(function InputView({ id, name, label, type = "text", value, defaultValue, placeholder, minValue, maxValue, error, helperText, disabled, required, readOnly, hidden, className, leftSlot, rightSlot, autoComplete, accept, multiple, step, testId, onChange, onChangeValue, onValueChange, onFocus, onBlur, }, ref) {
    const generatedId = useId();
    const id_ = id ?? name ?? generatedId;
    const describedBy = error
        ? `${id_}-error`
        : helperText
            ? `${id_}-helper`
            : undefined;
    return (_jsx(FieldShell, { id: id_, label: label, error: error, helperText: helperText, required: required, className: className, hidden: hidden, children: _jsxs("span", { className: cn(fieldControl, fieldBorder(Boolean(error))), children: [leftSlot, _jsx("input", { ref: ref, id: id_, name: name, type: type, value: value, defaultValue: defaultValue, placeholder: placeholder, min: minValue, max: maxValue, disabled: disabled, required: required, readOnly: readOnly, autoComplete: autoComplete, accept: accept, multiple: multiple, step: step, "data-testid": testId, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, className: "h-10 w-full bg-transparent outline-none", onChange: (event) => {
                        onChange?.(event);
                        onChangeValue?.(event.target.value);
                        onValueChange?.(event.target.value);
                    }, onFocus: onFocus, onBlur: onBlur }), rightSlot] }) }));
});
export const Input = createComponent("Input");
export const TextareaView = forwardRef(function TextareaView({ id, name, label, value, defaultValue, placeholder, error, helperText, disabled, required, readOnly, hidden, className, rows = 4, minRows, maxLength, showCount, resize = "vertical", testId, onChange, onChangeValue, onValueChange, onFocus, onBlur, }, ref) {
    const generatedId = useId();
    const id_ = id ?? name ?? generatedId;
    const describedBy = error
        ? `${id_}-error`
        : helperText
            ? `${id_}-helper`
            : undefined;
    return (_jsxs(FieldShell, { id: id_, label: label, error: error, helperText: helperText, required: required, className: className, hidden: hidden, children: [_jsx("textarea", { ref: ref, id: id_, name: name, rows: minRows ?? rows, maxLength: maxLength, value: value, defaultValue: defaultValue, placeholder: placeholder, disabled: disabled, required: required, readOnly: readOnly, "data-testid": testId, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, className: cn(fieldControl, fieldBorder(Boolean(error)), focusRing, "py-2 leading-relaxed", resize === "none" && "resize-none", resize === "vertical" && "resize-y", resize === "horizontal" && "resize-x"), onChange: (event) => {
                    onChange?.(event);
                    onChangeValue?.(event.target.value);
                    onValueChange?.(event.target.value);
                }, onFocus: onFocus, onBlur: onBlur }), showCount && maxLength ? _jsxs("p", { className: "text-right text-bk-xs text-muted-foreground", children: [String(value ?? defaultValue ?? "").length, "/", maxLength] }) : null] }));
});
export const Textarea = createComponent("Textarea");
//# sourceMappingURL=Input.js.map
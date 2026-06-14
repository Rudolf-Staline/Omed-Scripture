import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useId } from "react";
import { cn, createComponent } from "@basekit/core";
import { Icon } from "../internal";
import { FieldShell, fieldBorder } from "./Input";
export const SelectView = forwardRef(function SelectView({ id, name, label, value, defaultValue, options, placeholder, error, helperText, disabled, required, hidden, className, testId, onChange, onValueChange, }, ref) {
    const generatedId = useId();
    const id_ = id ?? name ?? generatedId;
    return (_jsx(FieldShell, { id: id_, label: label, error: error, helperText: helperText, required: required, className: className, hidden: hidden, children: _jsxs("span", { className: cn("relative flex items-center rounded-md border bg-surface", fieldBorder(Boolean(error))), children: [_jsxs("select", { ref: ref, id: id_, name: name, value: value, defaultValue: defaultValue, disabled: disabled, required: required, "data-testid": testId, "aria-invalid": error ? true : undefined, className: "h-10 w-full appearance-none bg-transparent px-3 pr-9 text-bk-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-60", onChange: (event) => {
                        onChange?.(event);
                        onValueChange?.(event.target.value);
                    }, children: [placeholder != null && (_jsx("option", { value: "", disabled: true, children: placeholder })), options.map((option) => (_jsx("option", { value: option.value, disabled: option.disabled, children: option.label }, option.value)))] }), _jsx(Icon, { name: "chevron-down", className: "pointer-events-none absolute right-3 text-muted-foreground" })] }) }));
});
export const Select = createComponent("Select");
//# sourceMappingURL=Select.js.map
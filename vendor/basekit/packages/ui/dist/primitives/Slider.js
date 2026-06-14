import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useState } from "react";
import { createComponent } from "@basekit/core";
import { FieldShell } from "./Input";
export const SliderView = ({ id, name, label, helperText, error, showValue, onValueChange, testId, className, min = 0, max = 100, step = 1, value, defaultValue, disabled, }) => {
    const generatedId = useId();
    const id_ = id ?? name ?? generatedId;
    const displayValue = value ?? defaultValue ?? min;
    return (_jsx(FieldShell, { id: id_, label: label, helperText: helperText, error: error, className: className, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { id: id_, name: name, "data-testid": testId, type: "range", className: "w-full accent-primary", min: min, max: max, step: step, value: value, defaultValue: defaultValue, disabled: disabled, "aria-invalid": error ? true : undefined, onChange: (event) => onValueChange?.(Number(event.currentTarget.value)) }), showValue && _jsx("output", { className: "min-w-10 text-right text-bk-sm text-muted-foreground", children: displayValue })] }) }));
};
export const Slider = createComponent("Slider");
export const RangeSliderView = ({ label, minLabel, maxLabel, value, defaultValue = [0, 100], min = 0, max = 100, error, onValueChange, ...props }) => {
    const [internal, setInternal] = useState(defaultValue);
    const current = value ?? internal;
    const minName = minLabel ?? (label != null ? `${String(label)} — minimum` : "Minimum");
    const maxName = maxLabel ?? (label != null ? `${String(label)} — maximum` : "Maximum");
    const update = (index, nextRaw) => {
        const next = [...current];
        next[index] = nextRaw;
        // Keep the thumbs ordered: a thumb can't cross its sibling.
        if (next[0] > next[1])
            next[index === 0 ? 1 : 0] = nextRaw;
        setInternal(next);
        onValueChange?.(next);
    };
    return (_jsxs("div", { role: "group", "aria-label": typeof label === "string" ? label : undefined, className: "space-y-2", children: [label != null && (_jsx("span", { className: "text-bk-sm font-medium text-foreground", children: label })), _jsx(SliderView, { ...props, label: minName, min: min, max: current[1], value: current[0], onValueChange: (next) => update(0, next) }), _jsx(SliderView, { ...props, label: maxName, min: current[0], max: max, value: current[1], onValueChange: (next) => update(1, next) }), error != null && _jsx("p", { className: "text-bk-sm text-danger", role: "alert", children: error })] }));
};
export const RangeSlider = createComponent("RangeSlider");
//# sourceMappingURL=Slider.js.map
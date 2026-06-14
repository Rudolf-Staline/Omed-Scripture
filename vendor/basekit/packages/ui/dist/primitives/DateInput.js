import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { createComponent } from "@basekit/core";
import { Icon } from "../internal";
import { InputView } from "./Input";
export const DateInputView = forwardRef(function DateInputView({ clearable, value, disabled, onValueChange, onChangeValue, ...props }, ref) {
    const emit = (next) => {
        onValueChange?.(next);
        onChangeValue?.(next);
    };
    // Clear button only when clearable && a value exists && not disabled.
    const showClear = clearable === true && Boolean(value) && disabled !== true;
    return (_jsx(InputView, { ref: ref, type: "date", value: value, disabled: disabled, onValueChange: emit, rightSlot: showClear ? (_jsx("button", { type: "button", "aria-label": "Effacer la date", className: "rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", onClick: () => emit(""), children: _jsx(Icon, { name: "close" }) })) : undefined, ...props }));
});
export const DateInput = createComponent("DateInput");
//# sourceMappingURL=DateInput.js.map
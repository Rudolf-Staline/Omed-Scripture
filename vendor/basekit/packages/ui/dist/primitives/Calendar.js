import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { cn, createComponent } from "@basekit/core";
import { ButtonView } from "./Button";
import { InputView } from "./Input";
const toIsoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const parseDate = (value) => {
    if (value instanceof Date)
        return value;
    if (!value)
        return undefined;
    return new Date(`${value}T00:00:00`);
};
export const CalendarView = ({ value, defaultValue, selectedDate, minDate, maxDate, disabledDates = [], onDateSelect, month, onMonthChange, locale, firstDayOfWeek = 1, disabled, className, testId, }) => {
    const initial = parseDate(selectedDate ?? value ?? defaultValue) ?? new Date();
    const [internalSelected, setInternalSelected] = useState(parseDate(defaultValue));
    const [visibleMonth, setVisibleMonth] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
    const shown = month ?? visibleMonth;
    const selected = parseDate(selectedDate ?? value) ?? internalSelected;
    const min = parseDate(minDate);
    const max = parseDate(maxDate);
    const disabledSet = new Set(disabledDates.map((date) => toIsoDate(parseDate(date) ?? new Date(NaN))));
    const days = useMemo(() => {
        const first = new Date(shown.getFullYear(), shown.getMonth(), 1);
        const offset = (first.getDay() - firstDayOfWeek + 7) % 7;
        const start = new Date(first);
        start.setDate(first.getDate() - offset);
        return Array.from({ length: 42 }, (_, index) => {
            const day = new Date(start);
            day.setDate(start.getDate() + index);
            return day;
        });
    }, [shown, firstDayOfWeek]);
    const changeMonth = (delta) => {
        const next = new Date(shown.getFullYear(), shown.getMonth() + delta, 1);
        setVisibleMonth(next);
        onMonthChange?.(next);
    };
    return (_jsxs("div", { "data-testid": testId, className: cn("w-72 rounded-lg border border-border bg-surface p-3 shadow-sm", className), children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsx(ButtonView, { type: "button", size: "xs", variant: "ghost", text: "\u2039", "aria-label": "Mois pr\u00E9c\u00E9dent", onClick: () => changeMonth(-1) }), _jsx("strong", { className: "text-bk-sm", children: shown.toLocaleDateString(locale, { month: "long", year: "numeric" }) }), _jsx(ButtonView, { type: "button", size: "xs", variant: "ghost", text: "\u203A", "aria-label": "Mois suivant", onClick: () => changeMonth(1) })] }), _jsx("div", { className: "grid grid-cols-7 gap-1 text-center text-bk-xs text-muted-foreground", children: ["L", "M", "M", "J", "V", "S", "D"].map((day, index) => _jsx("span", { children: day }, `${day}-${index}`)) }), _jsx("div", { className: "mt-1 grid grid-cols-7 gap-1", children: days.map((day) => {
                    const isoValue = toIsoDate(day);
                    const outsideMonth = day.getMonth() !== shown.getMonth();
                    const blocked = Boolean(disabled || (min && day < min) || (max && day > max) || disabledSet.has(isoValue));
                    const active = selected != null && toIsoDate(selected) === isoValue;
                    return (_jsx("button", { type: "button", disabled: blocked, "aria-label": day.toLocaleDateString(locale, { dateStyle: "long" }), "aria-pressed": active, className: cn("h-8 rounded-md text-bk-sm hover:bg-muted disabled:opacity-40", outsideMonth && "text-muted-foreground", active && "bg-primary text-primary-foreground hover:bg-primary"), onClick: () => {
                            setInternalSelected(day);
                            onDateSelect?.(isoValue, day);
                        }, children: day.getDate() }, isoValue));
                }) })] }));
};
export const Calendar = createComponent("Calendar");
export const DatePickerView = ({ id, name, label, placeholder = "YYYY-MM-DD", clearable, error, helperText, onValueChange, onOpenChange, value, defaultValue, minDate, maxDate, disabledDates, disabled, ...props }) => {
    const [open, setInternalOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(typeof defaultValue === "string" ? defaultValue : defaultValue ? toIsoDate(defaultValue) : "");
    const currentValue = typeof value === "string" ? value : value ? toIsoDate(value) : internalValue;
    const setOpen = (next) => {
        setInternalOpen(next);
        onOpenChange?.(next);
    };
    const setValue = (next) => {
        setInternalValue(next);
        onValueChange?.(next);
    };
    return (_jsxs("div", { className: "relative", children: [_jsx(InputView, { id: id, name: name, label: label, placeholder: placeholder, value: currentValue, error: error, helperText: helperText, readOnly: true, disabled: disabled, onFocus: () => setOpen(true), rightSlot: clearable && currentValue ? (_jsx(ButtonView, { type: "button", size: "xs", variant: "ghost", text: "Effacer", "aria-label": "Effacer la date", onMouseDown: (event) => event.preventDefault(), onClick: () => { setValue(""); setOpen(false); } })) : (_jsx(ButtonView, { type: "button", size: "xs", variant: "ghost", text: "Calendrier", "aria-label": "Ouvrir le calendrier", onMouseDown: (event) => event.preventDefault(), onClick: () => setOpen(!open) })) }), open && !disabled && (_jsx("div", { className: "absolute z-20 mt-2", children: _jsx(CalendarView, { ...props, value: currentValue, minDate: minDate, maxDate: maxDate, disabledDates: disabledDates, onDateSelect: (next, date) => {
                        setValue(next);
                        props.onDateSelect?.(next, date);
                        setOpen(false);
                    } }) }))] }));
};
export const DatePicker = createComponent("DatePicker");
export const TimePickerView = ({ min, max, step, onValueChange, ...props }) => (_jsx(InputView, { type: "time", ...props, minValue: min, maxValue: max, onValueChange: onValueChange, rightSlot: step ? _jsxs("span", { className: "text-bk-xs text-muted-foreground", children: [step, "s"] }) : props.rightSlot }));
export const TimePicker = createComponent("TimePicker");
//# sourceMappingURL=Calendar.js.map
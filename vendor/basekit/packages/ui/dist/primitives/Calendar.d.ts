import { type ReactNode } from "react";
import { type InputProps } from "./Input";
export type CalendarProps = {
    value?: string | Date;
    defaultValue?: string | Date;
    selectedDate?: string | Date;
    minDate?: string | Date;
    maxDate?: string | Date;
    disabledDates?: (string | Date)[];
    onDateSelect?: (value: string, date: Date) => void;
    month?: Date;
    onMonthChange?: (month: Date) => void;
    locale?: string;
    firstDayOfWeek?: number;
    disabled?: boolean;
    className?: string;
    testId?: string;
};
export declare const CalendarView: ({ value, defaultValue, selectedDate, minDate, maxDate, disabledDates, onDateSelect, month, onMonthChange, locale, firstDayOfWeek, disabled, className, testId, }: CalendarProps) => import("react").JSX.Element;
export declare const Calendar: import("@basekit/core").DeclarativeComponent<CalendarProps>;
export type DatePickerProps = CalendarProps & {
    id?: string;
    name?: string;
    label?: ReactNode;
    placeholder?: string;
    clearable?: boolean;
    error?: ReactNode;
    helperText?: ReactNode;
    onValueChange?: (value: string) => void;
    onOpenChange?: (open: boolean) => void;
};
export declare const DatePickerView: ({ id, name, label, placeholder, clearable, error, helperText, onValueChange, onOpenChange, value, defaultValue, minDate, maxDate, disabledDates, disabled, ...props }: DatePickerProps) => import("react").JSX.Element;
export declare const DatePicker: import("@basekit/core").DeclarativeComponent<DatePickerProps>;
export type TimePickerProps = Omit<InputProps, "type" | "onChangeValue" | "onValueChange"> & {
    value?: string;
    defaultValue?: string;
    min?: string;
    max?: string;
    step?: number;
    onValueChange?: (value: string) => void;
};
export declare const TimePickerView: ({ min, max, step, onValueChange, ...props }: TimePickerProps) => import("react").JSX.Element;
export declare const TimePicker: import("@basekit/core").DeclarativeComponent<TimePickerProps>;
//# sourceMappingURL=Calendar.d.ts.map
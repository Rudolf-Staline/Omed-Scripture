import { useMemo, useState, type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";
import { ButtonView } from "./Button";
import { InputView, type InputProps } from "./Input";

const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const parseDate = (value?: string | Date) => {
  if (value instanceof Date) return value;
  if (!value) return undefined;
  return new Date(`${value}T00:00:00`);
};

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

export const CalendarView = ({
  value,
  defaultValue,
  selectedDate,
  minDate,
  maxDate,
  disabledDates = [],
  onDateSelect,
  month,
  onMonthChange,
  locale,
  firstDayOfWeek = 1,
  disabled,
  className,
  testId,
}: CalendarProps) => {
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

  const changeMonth = (delta: number) => {
    const next = new Date(shown.getFullYear(), shown.getMonth() + delta, 1);
    setVisibleMonth(next);
    onMonthChange?.(next);
  };

  return (
    <div data-testid={testId} className={cn("w-72 rounded-lg border border-border bg-surface p-3 shadow-sm", className)}>
      <div className="mb-2 flex items-center justify-between">
        <ButtonView type="button" size="xs" variant="ghost" text="‹" aria-label="Mois précédent" onClick={() => changeMonth(-1)} />
        <strong className="text-bk-sm">{shown.toLocaleDateString(locale, { month: "long", year: "numeric" })}</strong>
        <ButtonView type="button" size="xs" variant="ghost" text="›" aria-label="Mois suivant" onClick={() => changeMonth(1)} />
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-bk-xs text-muted-foreground">
        {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isoValue = toIsoDate(day);
          const outsideMonth = day.getMonth() !== shown.getMonth();
          const blocked = Boolean(disabled || (min && day < min) || (max && day > max) || disabledSet.has(isoValue));
          const active = selected != null && toIsoDate(selected) === isoValue;
          return (
            <button
              key={isoValue}
              type="button"
              disabled={blocked}
              aria-label={day.toLocaleDateString(locale, { dateStyle: "long" })}
              aria-pressed={active}
              className={cn("h-8 rounded-md text-bk-sm hover:bg-muted disabled:opacity-40", outsideMonth && "text-muted-foreground", active && "bg-primary text-primary-foreground hover:bg-primary")}
              onClick={() => {
                setInternalSelected(day);
                onDateSelect?.(isoValue, day);
              }}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export const Calendar = createComponent<CalendarProps>("Calendar");

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

export const DatePickerView = ({ id, name, label, placeholder = "YYYY-MM-DD", clearable, error, helperText, onValueChange, onOpenChange, value, defaultValue, minDate, maxDate, disabledDates, disabled, ...props }: DatePickerProps) => {
  const [open, setInternalOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(typeof defaultValue === "string" ? defaultValue : defaultValue ? toIsoDate(defaultValue) : "");
  const currentValue = typeof value === "string" ? value : value ? toIsoDate(value) : internalValue;
  const setOpen = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };
  const setValue = (next: string) => {
    setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <div className="relative">
      <InputView
        id={id}
        name={name}
        label={label}
        placeholder={placeholder}
        value={currentValue}
        error={error}
        helperText={helperText}
        readOnly
        disabled={disabled}
        onFocus={() => setOpen(true)}
        rightSlot={
          clearable && currentValue ? (
            // Clearing must not open the calendar — close it explicitly.
            <ButtonView type="button" size="xs" variant="ghost" text="Effacer" aria-label="Effacer la date" onMouseDown={(event) => event.preventDefault()} onClick={() => { setValue(""); setOpen(false); }} />
          ) : (
            <ButtonView type="button" size="xs" variant="ghost" text="Calendrier" aria-label="Ouvrir le calendrier" onMouseDown={(event) => event.preventDefault()} onClick={() => setOpen(!open)} />
          )
        }
      />
      {open && !disabled && (
        <div className="absolute z-20 mt-2">
          <CalendarView
            {...props}
            value={currentValue}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            onDateSelect={(next, date) => {
              setValue(next);
              props.onDateSelect?.(next, date);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};
export const DatePicker = createComponent<DatePickerProps>("DatePicker");

export type TimePickerProps = Omit<InputProps, "type" | "onChangeValue" | "onValueChange"> & {
  value?: string;
  defaultValue?: string;
  min?: string;
  max?: string;
  step?: number;
  onValueChange?: (value: string) => void;
};

export const TimePickerView = ({ min, max, step, onValueChange, ...props }: TimePickerProps) => (
  <InputView
    type="time"
    {...props}
    minValue={min}
    maxValue={max}
    onValueChange={onValueChange}
    rightSlot={step ? <span className="text-bk-xs text-muted-foreground">{step}s</span> : props.rightSlot}
  />
);
export const TimePicker = createComponent<TimePickerProps>("TimePicker");

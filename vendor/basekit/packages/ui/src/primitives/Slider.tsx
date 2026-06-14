import { useId, useState, type ReactNode } from "react";
import { createComponent } from "@basekit/core";
import { FieldShell } from "./Input";

export type SliderProps = {
  id?: string;
  name?: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  showValue?: boolean;
  onValueChange?: (value: number) => void;
  testId?: string;
  className?: string;
};

export const SliderView = ({
  id,
  name,
  label,
  helperText,
  error,
  showValue,
  onValueChange,
  testId,
  className,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  disabled,
}: SliderProps) => {
  const generatedId = useId();
  const id_ = id ?? name ?? generatedId;
  const displayValue = value ?? defaultValue ?? min;

  return (
    <FieldShell id={id_} label={label} helperText={helperText} error={error} className={className}>
      <div className="flex items-center gap-3">
        <input
          id={id_}
          name={name}
          data-testid={testId}
          type="range"
          className="w-full accent-primary"
          min={min}
          max={max}
          step={step}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          onChange={(event) => onValueChange?.(Number(event.currentTarget.value))}
        />
        {showValue && <output className="min-w-10 text-right text-bk-sm text-muted-foreground">{displayValue}</output>}
      </div>
    </FieldShell>
  );
};
export const Slider = createComponent<SliderProps>("Slider");

export type RangeSliderValue = [number, number];
export type RangeSliderProps = Omit<SliderProps, "value" | "defaultValue" | "onValueChange" | "label"> & {
  label?: ReactNode;
  /** Distinct labels for each thumb so the two sliders aren't named alike. */
  minLabel?: ReactNode;
  maxLabel?: ReactNode;
  value?: RangeSliderValue;
  defaultValue?: RangeSliderValue;
  onValueChange?: (value: RangeSliderValue) => void;
};

export const RangeSliderView = ({
  label,
  minLabel,
  maxLabel,
  value,
  defaultValue = [0, 100],
  min = 0,
  max = 100,
  error,
  onValueChange,
  ...props
}: RangeSliderProps) => {
  const [internal, setInternal] = useState<RangeSliderValue>(defaultValue);
  const current = value ?? internal;
  const minName = minLabel ?? (label != null ? `${String(label)} — minimum` : "Minimum");
  const maxName = maxLabel ?? (label != null ? `${String(label)} — maximum` : "Maximum");

  const update = (index: 0 | 1, nextRaw: number) => {
    const next: RangeSliderValue = [...current] as RangeSliderValue;
    next[index] = nextRaw;
    // Keep the thumbs ordered: a thumb can't cross its sibling.
    if (next[0] > next[1]) next[index === 0 ? 1 : 0] = nextRaw;
    setInternal(next);
    onValueChange?.(next);
  };

  return (
    <div
      role="group"
      aria-label={typeof label === "string" ? label : undefined}
      className="space-y-2"
    >
      {label != null && (
        <span className="text-bk-sm font-medium text-foreground">{label}</span>
      )}
      <SliderView {...props} label={minName} min={min} max={current[1]} value={current[0]} onValueChange={(next) => update(0, next)} />
      <SliderView {...props} label={maxName} min={current[0]} max={max} value={current[1]} onValueChange={(next) => update(1, next)} />
      {error != null && <p className="text-bk-sm text-danger" role="alert">{error}</p>}
    </div>
  );
};
export const RangeSlider = createComponent<RangeSliderProps>("RangeSlider");

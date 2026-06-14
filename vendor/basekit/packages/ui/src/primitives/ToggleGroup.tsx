import { forwardRef, useState, type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";
import type { Size, Tone, Variant } from "@basekit/tokens";
import {
  controlSizeStyles,
  focusRing,
  interactiveToneStyles,
  radiusStyles,
  renderIcon,
  type IconSlot,
} from "../internal";

/* ------------------------------------------------------------------ */
/* Toggle — a two-state pressable button (aria-pressed)               */
/* ------------------------------------------------------------------ */

export type ToggleProps = {
  id?: string;
  className?: string;
  children?: ReactNode;
  text?: ReactNode;
  icon?: IconSlot;
  pressed?: boolean;
  defaultPressed?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  tone?: Tone;
  variant?: Variant;
  size?: Size;
  testId?: string;
  "aria-label"?: string;
  onPressedChange?: (pressed: boolean) => void;
};

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium " +
  "transition-colors select-none disabled:pointer-events-none disabled:opacity-55";

export const ToggleView = forwardRef<HTMLButtonElement, ToggleProps>(
  function ToggleView(
    {
      id,
      className,
      children,
      text,
      icon,
      pressed,
      defaultPressed = false,
      disabled,
      hidden,
      tone = "neutral",
      variant = "ghost",
      size = "md",
      testId,
      onPressedChange,
      ...rest
    },
    ref,
  ) {
    const [internal, setInternal] = useState(defaultPressed);
    const isPressed = pressed ?? internal;
    if (hidden) return null;

    const label = children ?? text;
    // When on, render the segment as a solid/active surface of the same tone.
    const activeStyles = interactiveToneStyles[variant === "ghost" ? "soft" : variant][tone];
    const inactiveStyles = interactiveToneStyles[variant][tone];

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        aria-pressed={isPressed}
        aria-label={rest["aria-label"]}
        disabled={disabled}
        data-testid={testId}
        data-state={isPressed ? "on" : "off"}
        onClick={() => {
          const next = !isPressed;
          setInternal(next);
          onPressedChange?.(next);
        }}
        className={cn(
          base,
          focusRing,
          controlSizeStyles[size],
          radiusStyles.md,
          isPressed ? activeStyles : cn(inactiveStyles, "text-muted-foreground"),
          className,
        )}
      >
        {renderIcon(icon)}
        {label != null && <span>{label}</span>}
      </button>
    );
  },
);

export const Toggle = createComponent<ToggleProps>("Toggle");

/* ------------------------------------------------------------------ */
/* ToggleGroup — single or multiple selection of toggle options       */
/* ------------------------------------------------------------------ */

export type ToggleGroupOption = {
  value: string;
  label?: ReactNode;
  icon?: IconSlot;
  disabled?: boolean;
  "aria-label"?: string;
};

export type ToggleGroupProps = {
  id?: string;
  className?: string;
  type?: "single" | "multiple";
  options: ToggleGroupOption[];
  /** Selected value in `single` mode. */
  value?: string;
  defaultValue?: string;
  /** Selected values in `multiple` mode. */
  values?: string[];
  defaultValues?: string[];
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  hidden?: boolean;
  tone?: Tone;
  variant?: Variant;
  size?: Size;
  testId?: string;
  "aria-label"?: string;
  onValueChange?: (value: string) => void;
  onValuesChange?: (values: string[]) => void;
};

export const ToggleGroupView = ({
  id,
  className,
  type = "single",
  options,
  value,
  defaultValue,
  values,
  defaultValues,
  orientation = "horizontal",
  disabled,
  hidden,
  tone = "neutral",
  variant = "outline",
  size = "sm",
  testId,
  onValueChange,
  onValuesChange,
  ...rest
}: ToggleGroupProps) => {
  const [internalSingle, setInternalSingle] = useState(defaultValue ?? "");
  const [internalMultiple, setInternalMultiple] = useState<string[]>(
    defaultValues ?? [],
  );
  const currentSingle = value ?? internalSingle;
  const currentMultiple = values ?? internalMultiple;
  if (hidden) return null;

  const isOn = (optionValue: string) =>
    type === "multiple"
      ? currentMultiple.includes(optionValue)
      : currentSingle === optionValue;

  const toggle = (optionValue: string) => {
    if (type === "multiple") {
      const next = currentMultiple.includes(optionValue)
        ? currentMultiple.filter((v) => v !== optionValue)
        : [...currentMultiple, optionValue];
      setInternalMultiple(next);
      onValuesChange?.(next);
    } else {
      // Single mode toggles the value off when re-selected.
      const next = currentSingle === optionValue ? "" : optionValue;
      setInternalSingle(next);
      onValueChange?.(next);
    }
  };

  return (
    <div
      id={id}
      role="group"
      aria-label={rest["aria-label"]}
      data-testid={testId}
      className={cn(
        "inline-flex gap-1",
        orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        className,
      )}
    >
      {options.map((option) => (
        <ToggleView
          key={option.value}
          tone={tone}
          variant={variant}
          size={size}
          icon={option.icon}
          text={option.label ?? option.value}
          aria-label={option["aria-label"]}
          pressed={isOn(option.value)}
          disabled={disabled || option.disabled}
          onPressedChange={() => toggle(option.value)}
        />
      ))}
    </div>
  );
};

export const ToggleGroup = createComponent<ToggleGroupProps>("ToggleGroup");

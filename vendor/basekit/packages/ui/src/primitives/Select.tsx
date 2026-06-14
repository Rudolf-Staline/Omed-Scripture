import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn, createComponent } from "@basekit/core";
import { Icon } from "../internal";
import { FieldShell, fieldBorder } from "./Input";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectProps = {
  id?: string;
  name?: string;
  label?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: React.ReactNode;
  helperText?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  hidden?: boolean;
  className?: string;
  testId?: string;
  onChange?: SelectHTMLAttributes<HTMLSelectElement>["onChange"];
  onValueChange?: (value: string) => void;
};

export const SelectView = forwardRef<HTMLSelectElement, SelectProps>(
  function SelectView(
    {
      id,
      name,
      label,
      value,
      defaultValue,
      options,
      placeholder,
      error,
      helperText,
      disabled,
      required,
      hidden,
      className,
      testId,
      onChange,
      onValueChange,
    },
    ref,
  ) {
    const generatedId = useId();
    const id_ = id ?? name ?? generatedId;
    return (
      <FieldShell
        id={id_}
        label={label}
        error={error}
        helperText={helperText}
        required={required}
        className={className}
        hidden={hidden}
      >
        <span
          className={cn(
            "relative flex items-center rounded-md border bg-surface",
            fieldBorder(Boolean(error)),
          )}
        >
          <select
            ref={ref}
            id={id_}
            name={name}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            required={required}
            data-testid={testId}
            aria-invalid={error ? true : undefined}
            className="h-10 w-full appearance-none bg-transparent px-3 pr-9 text-bk-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-60"
            onChange={(event) => {
              onChange?.(event);
              onValueChange?.(event.target.value);
            }}
          >
            {placeholder != null && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <Icon
            name="chevron-down"
            className="pointer-events-none absolute right-3 text-muted-foreground"
          />
        </span>
      </FieldShell>
    );
  },
);

export const Select = createComponent<SelectProps>("Select");

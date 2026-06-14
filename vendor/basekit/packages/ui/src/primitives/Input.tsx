import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn, createComponent } from "@basekit/core";
import { focusRing } from "../internal";

/** Field chrome shared by Input, Textarea, Select and DateInput. */
export type FieldShellProps = {
  id: string;
  label?: ReactNode;
  error?: ReactNode;
  helperText?: ReactNode;
  required?: boolean;
  className?: string;
  hidden?: boolean;
  children: ReactNode;
  /** Ids of the helper/error nodes, for aria-describedby. */
  describedBy?: string;
};

export const FieldShell = ({
  id,
  label,
  error,
  helperText,
  required,
  className,
  hidden,
  children,
}: FieldShellProps) => {
  if (hidden) return null;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label != null && (
        <label htmlFor={id} className="text-bk-sm font-medium text-foreground">
          {label}
          {required && (
            <span className="text-danger" aria-hidden>
              {" "}
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p id={errorId} className="text-bk-sm text-danger" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-bk-sm text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export const fieldControl =
  "flex w-full items-center gap-2 rounded-md border bg-surface px-3 text-bk-sm text-foreground " +
  "transition-colors placeholder:text-muted-foreground " +
  "disabled:cursor-not-allowed disabled:opacity-60";

export const fieldBorder = (hasError?: boolean) =>
  hasError
    ? "border-danger focus-within:border-danger focus-within:ring-2 focus-within:ring-danger/40"
    : "border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/40";

export type InputProps = {
  id?: string;
  name?: string;
  label?: ReactNode;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  minValue?: number | string;
  maxValue?: number | string;
  error?: ReactNode;
  helperText?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  className?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  autoComplete?: string;
  accept?: string;
  multiple?: boolean;
  step?: number | string;
  testId?: string;
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  /** Value-first change handler — the ergonomic default. */
  onChangeValue?: (value: string) => void;
  /** Alias of onChangeValue, kept for readability in declarative trees. */
  onValueChange?: (value: string) => void;
  onFocus?: InputHTMLAttributes<HTMLInputElement>["onFocus"];
  onBlur?: InputHTMLAttributes<HTMLInputElement>["onBlur"];
};

export const InputView = forwardRef<HTMLInputElement, InputProps>(
  function InputView(
    {
      id,
      name,
      label,
      type = "text",
      value,
      defaultValue,
      placeholder,
      minValue,
      maxValue,
      error,
      helperText,
      disabled,
      required,
      readOnly,
      hidden,
      className,
      leftSlot,
      rightSlot,
      autoComplete,
      accept,
      multiple,
      step,
      testId,
      onChange,
      onChangeValue,
      onValueChange,
      onFocus,
      onBlur,
    },
    ref,
  ) {
    const generatedId = useId();
    const id_ = id ?? name ?? generatedId;
    const describedBy = error
      ? `${id_}-error`
      : helperText
        ? `${id_}-helper`
        : undefined;
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
        <span className={cn(fieldControl, fieldBorder(Boolean(error)))}>
          {leftSlot}
          <input
            ref={ref}
            id={id_}
            name={name}
            type={type}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            min={minValue}
            max={maxValue}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            autoComplete={autoComplete}
            accept={accept}
            multiple={multiple}
            step={step}
            data-testid={testId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className="h-10 w-full bg-transparent outline-none"
            onChange={(event) => {
              onChange?.(event);
              onChangeValue?.(event.target.value);
              onValueChange?.(event.target.value);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {rightSlot}
        </span>
      </FieldShell>
    );
  },
);

export const Input = createComponent<InputProps>("Input");

/* ------------------------------------------------------------------ */
/* Textarea                                                            */
/* ------------------------------------------------------------------ */

export type TextareaProps = Omit<
  InputProps,
  "type" | "leftSlot" | "rightSlot" | "minValue" | "maxValue"
> & { rows?: number; minRows?: number; maxLength?: number; showCount?: boolean; resize?: "none" | "vertical" | "horizontal" | "both" };

export const TextareaView = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function TextareaView(
    {
      id,
      name,
      label,
      value,
      defaultValue,
      placeholder,
      error,
      helperText,
      disabled,
      required,
      readOnly,
      hidden,
      className,
      rows = 4,
      minRows,
      maxLength,
      showCount,
      resize = "vertical",
      testId,
      onChange,
      onChangeValue,
      onValueChange,
      onFocus,
      onBlur,
    },
    ref,
  ) {
    const generatedId = useId();
    const id_ = id ?? name ?? generatedId;
    const describedBy = error
      ? `${id_}-error`
      : helperText
        ? `${id_}-helper`
        : undefined;
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
        <textarea
          ref={ref}
          id={id_}
          name={name}
          rows={minRows ?? rows}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          data-testid={testId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            fieldControl,
            fieldBorder(Boolean(error)),
            focusRing,
            "py-2 leading-relaxed",
            resize === "none" && "resize-none",
            resize === "vertical" && "resize-y",
            resize === "horizontal" && "resize-x",
          )}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange?.(event as unknown as React.ChangeEvent<HTMLInputElement>);
            onChangeValue?.(event.target.value);
            onValueChange?.(event.target.value);
          }}
          onFocus={
            onFocus as unknown as TextareaHTMLAttributes<HTMLTextAreaElement>["onFocus"]
          }
          onBlur={
            onBlur as unknown as TextareaHTMLAttributes<HTMLTextAreaElement>["onBlur"]
          }
        />
        {showCount && maxLength ? <p className="text-right text-bk-xs text-muted-foreground">{String(value ?? defaultValue ?? "").length}/{maxLength}</p> : null}
      </FieldShell>
    );
  },
);

export const Textarea = createComponent<TextareaProps>("Textarea");

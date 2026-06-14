import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
} from "react";
import { cn, createComponent } from "@basekit/core";
import { Icon } from "../internal";
import { ButtonView } from "./Button";
import { InputView, type InputProps } from "./Input";

export type TextInputProps = InputProps;
export const TextInputView = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInputView(props, ref) {
    return <InputView ref={ref} type="text" {...props} />;
  },
);
export const TextInput = createComponent<TextInputProps>("TextInput");

export type NumberInputProps = Omit<
  InputProps,
  "type" | "value" | "defaultValue" | "onChangeValue" | "onValueChange" | "minValue" | "maxValue"
> & {
  value?: number | string;
  defaultValue?: number | string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  clampOnBlur?: boolean;
  onNumberChange?: (value: number | null) => void;
  onValueChange?: (value: string) => void;
};

const parseNumberValue = (value: string) => (value === "" ? null : Number(value));

export const NumberInputView = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInputView(
    { minValue, maxValue, step, clampOnBlur, onNumberChange, onValueChange, onBlur, ...props },
    ref,
  ) {
    return (
      <InputView
        ref={ref}
        type="number"
        minValue={minValue}
        maxValue={maxValue}
        step={step}
        {...props}
        onChangeValue={(nextValue) => {
          onValueChange?.(nextValue);
          const parsed = parseNumberValue(nextValue);
          onNumberChange?.(parsed == null || Number.isNaN(parsed) ? null : parsed);
        }}
        onBlur={(event) => {
          if (clampOnBlur && event.currentTarget.value !== "") {
            const parsed = Number(event.currentTarget.value);
            if (!Number.isNaN(parsed)) {
              const clamped = Math.min(maxValue ?? parsed, Math.max(minValue ?? parsed, parsed));
              if (clamped !== parsed) {
                // Keep the native input in sync when clamping an uncontrolled value on blur.
                event.currentTarget.value = String(clamped);
              }
              onValueChange?.(String(clamped));
              onNumberChange?.(clamped);
            }
          }
          onBlur?.(event);
        }}
        rightSlot={props.rightSlot}
      />
    );
  },
);
export const NumberInput = createComponent<NumberInputProps>("NumberInput");

export type PasswordInputProps = InputProps & {
  showToggle?: boolean;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
};

export const PasswordInputView = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInputView(
    { showToggle = true, visible, defaultVisible = false, onVisibleChange, rightSlot, ...props },
    ref,
  ) {
    const [internalVisible, setInternalVisible] = useState(defaultVisible);
    const isVisible = visible ?? internalVisible;
    const toggle = () => {
      const next = !isVisible;
      setInternalVisible(next);
      onVisibleChange?.(next);
    };

    return (
      <InputView
        ref={ref}
        type={isVisible ? "text" : "password"}
        {...props}
        rightSlot={
          showToggle ? (
            <ButtonView
              type="button"
              size="xs"
              variant="ghost"
              aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              text={isVisible ? "Masquer" : "Afficher"}
              onClick={toggle}
            />
          ) : (
            rightSlot
          )
        }
      />
    );
  },
);
export const PasswordInput = createComponent<PasswordInputProps>("PasswordInput");

export type SearchInputProps = InputProps & {
  clearable?: boolean;
  loading?: boolean;
  onClear?: () => void;
};

export const SearchInputView = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInputView({ clearable, loading, onClear, rightSlot, leftSlot, value, onValueChange, disabled, ...props }, ref) {
    return (
      <InputView
        ref={ref}
        type="search"
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
        leftSlot={leftSlot ?? <Icon name="search" className="text-muted-foreground" />}
        {...props}
        rightSlot={
          loading ? (
            <Icon name="spinner" className="animate-spin text-muted-foreground" />
          ) : clearable && value ? (
            <ButtonView
              type="button"
              size="xs"
              variant="ghost"
              aria-label="Effacer la recherche"
              text="Effacer"
              disabled={disabled}
              onClick={() => {
                onValueChange?.("");
                onClear?.();
              }}
            />
          ) : (
            rightSlot
          )
        }
      />
    );
  },
);
export const SearchInput = createComponent<SearchInputProps>("SearchInput");

export type EmailInputProps = InputProps;
export const EmailInputView = forwardRef<HTMLInputElement, EmailInputProps>(
  function EmailInputView(props, ref) {
    return <InputView ref={ref} type="email" autoComplete="email" {...props} />;
  },
);
export const EmailInput = createComponent<EmailInputProps>("EmailInput");

export type PhoneInputProps = InputProps;
export const PhoneInputView = forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInputView(props, ref) {
    return <InputView ref={ref} type="tel" autoComplete="tel" {...props} />;
  },
);
export const PhoneInput = createComponent<PhoneInputProps>("PhoneInput");

export type UrlInputProps = InputProps;
export const UrlInputView = forwardRef<HTMLInputElement, UrlInputProps>(
  function UrlInputView(props, ref) {
    return <InputView ref={ref} type="url" {...props} />;
  },
);
export const UrlInput = createComponent<UrlInputProps>("UrlInput");

export type FileInputProps = Omit<
  InputProps,
  "type" | "value" | "defaultValue" | "onChangeValue" | "onValueChange"
> & {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFilesChange?: (files: File[]) => void;
  onRejectedFilesChange?: (files: File[]) => void;
};

const splitAcceptedFiles = (files: File[], maxSize?: number) => ({
  accepted: files.filter((file) => maxSize == null || file.size <= maxSize),
  rejected: files.filter((file) => maxSize != null && file.size > maxSize),
});

export const FileInputView = forwardRef<HTMLInputElement, FileInputProps>(
  function FileInputView({ accept, multiple, maxSize, onFilesChange, onRejectedFilesChange, onChange, ...props }, ref) {
    const handleChange: InputHTMLAttributes<HTMLInputElement>["onChange"] = (event) => {
      onChange?.(event);
      const { accepted, rejected } = splitAcceptedFiles(Array.from(event.currentTarget.files ?? []), maxSize);
      onFilesChange?.(accepted);
      if (rejected.length > 0) onRejectedFilesChange?.(rejected);
    };

    return <InputView ref={ref} type="file" {...props} accept={accept} multiple={multiple} onChange={handleChange} />;
  },
);
export const FileInput = createComponent<FileInputProps>("FileInput");

export type DateTimeInputProps = Omit<InputProps, "type"> & {
  value?: string;
  defaultValue?: string;
  minValue?: string;
  maxValue?: string;
  step?: number;
  onValueChange?: (value: string) => void;
};

export const DateTimeInputView = forwardRef<HTMLInputElement, DateTimeInputProps>(
  function DateTimeInputView(props, ref) {
    return <InputView ref={ref} type="datetime-local" {...props} />;
  },
);
export const DateTimeInput = createComponent<DateTimeInputProps>("DateTimeInput");

export type DropzoneProps = FileInputProps & {
  text?: string;
  activeText?: string;
};

export const DropzoneView = forwardRef<HTMLInputElement, DropzoneProps>(
  function DropzoneView(
    { text = "Déposer des fichiers ou cliquer pour sélectionner", activeText = "Relâcher pour déposer", disabled, className, ...props },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFiles = (files: File[]) => {
      const { accepted, rejected } = splitAcceptedFiles(files, props.maxSize);
      props.onFilesChange?.(accepted);
      if (rejected.length > 0) props.onRejectedFilesChange?.(rejected);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragActive(false);
      if (!disabled) handleFiles(Array.from(event.dataTransfer.files));
    };

    return (
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        className={cn(
          "rounded-lg border border-dashed border-input bg-muted/30 p-4 text-center text-bk-sm transition-colors",
          dragActive && "border-primary bg-primary/10",
          disabled && "cursor-not-allowed opacity-60",
          className,
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          type="file"
          hidden
          accept={props.accept}
          multiple={props.multiple}
          disabled={disabled}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            handleFiles(Array.from(event.currentTarget.files ?? []));
          }}
        />
        {dragActive ? activeText : text}
      </div>
    );
  },
);
export const Dropzone = createComponent<DropzoneProps>("Dropzone");

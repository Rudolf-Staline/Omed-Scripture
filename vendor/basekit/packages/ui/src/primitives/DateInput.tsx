import { forwardRef } from "react";
import { createComponent } from "@basekit/core";
import { Icon } from "../internal";
import { InputView, type InputProps } from "./Input";

export type DateInputProps = Omit<
  InputProps,
  "type" | "leftSlot" | "rightSlot"
> & {
  /** Show a clear button when there is a value and the field is enabled. */
  clearable?: boolean;
  onValueChange?: (value: string) => void;
};

export const DateInputView = forwardRef<HTMLInputElement, DateInputProps>(
  function DateInputView(
    { clearable, value, disabled, onValueChange, onChangeValue, ...props },
    ref,
  ) {
    const emit = (next: string) => {
      onValueChange?.(next);
      onChangeValue?.(next);
    };
    // Clear button only when clearable && a value exists && not disabled.
    const showClear = clearable === true && Boolean(value) && disabled !== true;
    return (
      <InputView
        ref={ref}
        type="date"
        value={value}
        disabled={disabled}
        onValueChange={emit}
        rightSlot={
          showClear ? (
            <button
              type="button"
              aria-label="Effacer la date"
              className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => emit("")}
            >
              <Icon name="close" />
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  },
);

export const DateInput = createComponent<DateInputProps>("DateInput");

import { type InputProps } from "./Input";
export type DateInputProps = Omit<InputProps, "type" | "leftSlot" | "rightSlot"> & {
    /** Show a clear button when there is a value and the field is enabled. */
    clearable?: boolean;
    onValueChange?: (value: string) => void;
};
export declare const DateInputView: import("react").ForwardRefExoticComponent<Omit<InputProps, "type" | "leftSlot" | "rightSlot"> & {
    /** Show a clear button when there is a value and the field is enabled. */
    clearable?: boolean;
    onValueChange?: (value: string) => void;
} & import("react").RefAttributes<HTMLInputElement>>;
export declare const DateInput: import("@basekit/core").DeclarativeComponent<DateInputProps>;
//# sourceMappingURL=DateInput.d.ts.map
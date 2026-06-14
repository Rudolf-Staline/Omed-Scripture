import { type InputHTMLAttributes, type ReactNode } from "react";
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
export declare const FieldShell: ({ id, label, error, helperText, required, className, hidden, children, }: FieldShellProps) => import("react").JSX.Element | null;
export declare const fieldControl: string;
export declare const fieldBorder: (hasError?: boolean) => "border-danger focus-within:border-danger focus-within:ring-2 focus-within:ring-danger/40" | "border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/40";
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
export declare const InputView: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;
export declare const Input: import("@basekit/core").DeclarativeComponent<InputProps>;
export type TextareaProps = Omit<InputProps, "type" | "leftSlot" | "rightSlot" | "minValue" | "maxValue"> & {
    rows?: number;
    minRows?: number;
    maxLength?: number;
    showCount?: boolean;
    resize?: "none" | "vertical" | "horizontal" | "both";
};
export declare const TextareaView: import("react").ForwardRefExoticComponent<Omit<InputProps, "type" | "minValue" | "maxValue" | "leftSlot" | "rightSlot"> & {
    rows?: number;
    minRows?: number;
    maxLength?: number;
    showCount?: boolean;
    resize?: "none" | "vertical" | "horizontal" | "both";
} & import("react").RefAttributes<HTMLTextAreaElement>>;
export declare const Textarea: import("@basekit/core").DeclarativeComponent<TextareaProps>;
//# sourceMappingURL=Input.d.ts.map
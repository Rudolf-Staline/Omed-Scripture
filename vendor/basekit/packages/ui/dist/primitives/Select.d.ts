import { type SelectHTMLAttributes } from "react";
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
export declare const SelectView: import("react").ForwardRefExoticComponent<SelectProps & import("react").RefAttributes<HTMLSelectElement>>;
export declare const Select: import("@basekit/core").DeclarativeComponent<SelectProps>;
//# sourceMappingURL=Select.d.ts.map
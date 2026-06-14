import { type ReactNode } from "react";
export type CheckboxProps = {
    id?: string;
    name?: string;
    label?: ReactNode;
    description?: ReactNode;
    helperText?: ReactNode;
    error?: ReactNode;
    indeterminate?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    required?: boolean;
    hidden?: boolean;
    className?: string;
    testId?: string;
    onChange?: (checked: boolean) => void;
    onCheckedChange?: (checked: boolean) => void;
};
export declare const CheckboxView: import("react").ForwardRefExoticComponent<CheckboxProps & import("react").RefAttributes<HTMLInputElement>>;
export declare const Checkbox: import("@basekit/core").DeclarativeComponent<CheckboxProps>;
export type SwitchProps = Omit<CheckboxProps, "description">;
export declare const SwitchView: import("react").ForwardRefExoticComponent<SwitchProps & import("react").RefAttributes<HTMLInputElement>>;
export declare const Switch: import("@basekit/core").DeclarativeComponent<SwitchProps>;
//# sourceMappingURL=Toggle.d.ts.map
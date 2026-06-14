import { type ReactNode } from "react";
export type ChoiceOption = {
    label: ReactNode;
    value: string;
    disabled?: boolean;
    helperText?: ReactNode;
};
export type RadioProps = {
    id?: string;
    name?: string;
    value?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    required?: boolean;
    label?: ReactNode;
    helperText?: ReactNode;
    error?: ReactNode;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onCheckedChange?: (checked: boolean) => void;
    testId?: string;
    className?: string;
};
export declare const RadioView: import("react").ForwardRefExoticComponent<RadioProps & import("react").RefAttributes<HTMLInputElement>>;
export declare const Radio: import("@basekit/core").DeclarativeComponent<RadioProps>;
export type RadioGroupProps = {
    id?: string;
    name?: string;
    label?: ReactNode;
    value?: string;
    defaultValue?: string;
    options: ChoiceOption[];
    orientation?: "vertical" | "horizontal";
    disabled?: boolean;
    required?: boolean;
    error?: ReactNode;
    helperText?: ReactNode;
    onValueChange?: (value: string) => void;
    testId?: string;
    className?: string;
};
export declare const RadioGroupView: ({ id, name, label, value, defaultValue, options, orientation, disabled, required, error, helperText, onValueChange, testId, className }: RadioGroupProps) => import("react").JSX.Element;
export declare const RadioGroup: import("@basekit/core").DeclarativeComponent<RadioGroupProps>;
export type CheckboxGroupProps = {
    label?: ReactNode;
    values?: string[];
    defaultValues?: string[];
    options: ChoiceOption[];
    orientation?: "vertical" | "horizontal";
    disabled?: boolean;
    error?: ReactNode;
    helperText?: ReactNode;
    onValuesChange?: (values: string[]) => void;
    testId?: string;
    className?: string;
};
export declare const CheckboxGroupView: ({ label, values, defaultValues, options, orientation, disabled, error, helperText, onValuesChange, testId, className }: CheckboxGroupProps) => import("react").JSX.Element;
export declare const CheckboxGroup: import("@basekit/core").DeclarativeComponent<CheckboxGroupProps>;
//# sourceMappingURL=Selection.d.ts.map
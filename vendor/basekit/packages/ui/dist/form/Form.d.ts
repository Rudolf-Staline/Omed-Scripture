import { type FormHTMLAttributes, type ReactNode } from "react";
import { type UIChild } from "@basekit/core";
export type FormProps = {
    children?: ReactNode;
    onSubmit?: () => void;
    className?: string;
    id?: string;
} & Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "className" | "id">;
export declare const FormView: ({ children, onSubmit, className, id, ...rest }: FormProps) => import("react").JSX.Element;
export declare const Form: import("@basekit/core").DeclarativeComponent<FormProps>;
export type FormSectionProps = {
    title?: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
    className?: string;
};
export declare const FormSectionView: ({ title, description, children, className, }: FormSectionProps) => import("react").JSX.Element;
export declare const FormSection: import("@basekit/core").DeclarativeComponent<FormSectionProps>;
export type FormFieldProps = {
    label?: ReactNode;
    htmlFor?: string;
    error?: ReactNode;
    helperText?: ReactNode;
    required?: boolean;
    children?: ReactNode;
    className?: string;
};
export declare const FormFieldView: ({ label, htmlFor, error, helperText, required, children, className, }: FormFieldProps) => import("react").JSX.Element;
export declare const FormField: import("@basekit/core").DeclarativeComponent<FormFieldProps>;
export type FormActionsProps = {
    children?: ReactNode;
    align?: "start" | "end" | "between";
    className?: string;
};
export declare const FormActionsView: ({ children, align, className, }: FormActionsProps) => import("react").JSX.Element;
export declare const FormActions: import("@basekit/core").DeclarativeComponent<FormActionsProps>;
export type FilterBarProps = {
    title?: ReactNode;
    icon?: ReactNode;
    fields?: UIChild[];
    actions?: UIChild[];
    className?: string;
};
export declare const FilterBarView: ({ title, fields, actions, className, }: FilterBarProps) => import("react").JSX.Element;
export declare const FilterBar: import("@basekit/core").DeclarativeComponent<FilterBarProps>;
export type FieldLabelProps = {
    children?: ReactNode;
    htmlFor?: string;
    required?: boolean;
    className?: string;
};
export declare const FieldLabelView: ({ children, htmlFor, required, className }: FieldLabelProps) => import("react").JSX.Element;
export declare const FieldLabel: import("@basekit/core").DeclarativeComponent<FieldLabelProps>;
export type FieldHintProps = {
    children?: ReactNode;
    className?: string;
};
export declare const FieldHintView: ({ children, className }: FieldHintProps) => import("react").JSX.Element;
export declare const FieldHint: import("@basekit/core").DeclarativeComponent<FieldHintProps>;
export type FieldErrorProps = {
    children?: ReactNode;
    className?: string;
};
export declare const FieldErrorView: ({ children, className }: FieldErrorProps) => import("react").JSX.Element;
export declare const FieldError: import("@basekit/core").DeclarativeComponent<FieldErrorProps>;
//# sourceMappingURL=Form.d.ts.map
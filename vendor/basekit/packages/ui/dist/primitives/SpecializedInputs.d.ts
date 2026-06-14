import { type InputProps } from "./Input";
export type TextInputProps = InputProps;
export declare const TextInputView: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;
export declare const TextInput: import("@basekit/core").DeclarativeComponent<InputProps>;
export type NumberInputProps = Omit<InputProps, "type" | "value" | "defaultValue" | "onChangeValue" | "onValueChange" | "minValue" | "maxValue"> & {
    value?: number | string;
    defaultValue?: number | string;
    minValue?: number;
    maxValue?: number;
    step?: number;
    clampOnBlur?: boolean;
    onNumberChange?: (value: number | null) => void;
    onValueChange?: (value: string) => void;
};
export declare const NumberInputView: import("react").ForwardRefExoticComponent<Omit<InputProps, "type" | "value" | "defaultValue" | "onValueChange" | "minValue" | "maxValue" | "onChangeValue"> & {
    value?: number | string;
    defaultValue?: number | string;
    minValue?: number;
    maxValue?: number;
    step?: number;
    clampOnBlur?: boolean;
    onNumberChange?: (value: number | null) => void;
    onValueChange?: (value: string) => void;
} & import("react").RefAttributes<HTMLInputElement>>;
export declare const NumberInput: import("@basekit/core").DeclarativeComponent<NumberInputProps>;
export type PasswordInputProps = InputProps & {
    showToggle?: boolean;
    visible?: boolean;
    defaultVisible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
};
export declare const PasswordInputView: import("react").ForwardRefExoticComponent<InputProps & {
    showToggle?: boolean;
    visible?: boolean;
    defaultVisible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
} & import("react").RefAttributes<HTMLInputElement>>;
export declare const PasswordInput: import("@basekit/core").DeclarativeComponent<PasswordInputProps>;
export type SearchInputProps = InputProps & {
    clearable?: boolean;
    loading?: boolean;
    onClear?: () => void;
};
export declare const SearchInputView: import("react").ForwardRefExoticComponent<InputProps & {
    clearable?: boolean;
    loading?: boolean;
    onClear?: () => void;
} & import("react").RefAttributes<HTMLInputElement>>;
export declare const SearchInput: import("@basekit/core").DeclarativeComponent<SearchInputProps>;
export type EmailInputProps = InputProps;
export declare const EmailInputView: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;
export declare const EmailInput: import("@basekit/core").DeclarativeComponent<InputProps>;
export type PhoneInputProps = InputProps;
export declare const PhoneInputView: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;
export declare const PhoneInput: import("@basekit/core").DeclarativeComponent<InputProps>;
export type UrlInputProps = InputProps;
export declare const UrlInputView: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;
export declare const UrlInput: import("@basekit/core").DeclarativeComponent<InputProps>;
export type FileInputProps = Omit<InputProps, "type" | "value" | "defaultValue" | "onChangeValue" | "onValueChange"> & {
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    onFilesChange?: (files: File[]) => void;
    onRejectedFilesChange?: (files: File[]) => void;
};
export declare const FileInputView: import("react").ForwardRefExoticComponent<Omit<InputProps, "type" | "value" | "defaultValue" | "onValueChange" | "onChangeValue"> & {
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    onFilesChange?: (files: File[]) => void;
    onRejectedFilesChange?: (files: File[]) => void;
} & import("react").RefAttributes<HTMLInputElement>>;
export declare const FileInput: import("@basekit/core").DeclarativeComponent<FileInputProps>;
export type DateTimeInputProps = Omit<InputProps, "type"> & {
    value?: string;
    defaultValue?: string;
    minValue?: string;
    maxValue?: string;
    step?: number;
    onValueChange?: (value: string) => void;
};
export declare const DateTimeInputView: import("react").ForwardRefExoticComponent<Omit<InputProps, "type"> & {
    value?: string;
    defaultValue?: string;
    minValue?: string;
    maxValue?: string;
    step?: number;
    onValueChange?: (value: string) => void;
} & import("react").RefAttributes<HTMLInputElement>>;
export declare const DateTimeInput: import("@basekit/core").DeclarativeComponent<DateTimeInputProps>;
export type DropzoneProps = FileInputProps & {
    text?: string;
    activeText?: string;
};
export declare const DropzoneView: import("react").ForwardRefExoticComponent<Omit<InputProps, "type" | "value" | "defaultValue" | "onValueChange" | "onChangeValue"> & {
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    onFilesChange?: (files: File[]) => void;
    onRejectedFilesChange?: (files: File[]) => void;
} & {
    text?: string;
    activeText?: string;
} & import("react").RefAttributes<HTMLInputElement>>;
export declare const Dropzone: import("@basekit/core").DeclarativeComponent<DropzoneProps>;
//# sourceMappingURL=SpecializedInputs.d.ts.map
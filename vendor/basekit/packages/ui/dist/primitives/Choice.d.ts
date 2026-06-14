import { type ReactNode } from "react";
import { type SelectProps } from "./Select";
export type MultiSelectProps = Omit<SelectProps, "value" | "defaultValue" | "onValueChange"> & {
    values?: string[];
    defaultValues?: string[];
    onValuesChange?: (values: string[]) => void;
};
export declare const MultiSelectView: ({ id, name, label, options, values, defaultValues, error, helperText, disabled, required, className, onValuesChange, testId, }: MultiSelectProps) => import("react").JSX.Element;
export declare const MultiSelect: import("@basekit/core").DeclarativeComponent<MultiSelectProps>;
export type ComboboxProps = Omit<SelectProps, "onValueChange"> & {
    searchValue?: string;
    defaultSearchValue?: string;
    clearable?: boolean;
    emptyText?: ReactNode;
    onValueChange?: (value: string) => void;
    onSearchChange?: (value: string) => void;
};
export declare const ComboboxView: ({ id, name, label, options, value, defaultValue, searchValue, defaultSearchValue, placeholder, emptyText, clearable, error, helperText, disabled, required, className, testId, onValueChange, onSearchChange, }: ComboboxProps) => import("react").JSX.Element;
export declare const Combobox: import("@basekit/core").DeclarativeComponent<ComboboxProps>;
export type AutocompleteProps = ComboboxProps;
export declare const AutocompleteView: ({ id, name, label, options, value, defaultValue, searchValue, defaultSearchValue, placeholder, emptyText, clearable, error, helperText, disabled, required, className, testId, onValueChange, onSearchChange, }: ComboboxProps) => import("react").JSX.Element;
export declare const Autocomplete: import("@basekit/core").DeclarativeComponent<ComboboxProps>;
//# sourceMappingURL=Choice.d.ts.map
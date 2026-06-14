import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn, createComponent } from "@basekit/core";
import { ButtonView } from "./Button";
import { FieldShell } from "./Input";
export const MultiSelectView = ({ id, name, label, options, values, defaultValues, error, helperText, disabled, required, className, onValuesChange, testId, }) => {
    const generatedId = useId();
    const id_ = id ?? name ?? generatedId;
    return (_jsx(FieldShell, { id: id_, label: label, error: error, helperText: helperText, required: required, className: className, children: _jsx("select", { id: id_, name: name, multiple: true, value: values, defaultValue: defaultValues, disabled: disabled, required: required, "data-testid": testId, "aria-invalid": error ? true : undefined, className: "min-h-28 rounded-md border border-input bg-surface p-2 text-bk-sm", onChange: (event) => onValuesChange?.(Array.from(event.currentTarget.selectedOptions).map((option) => option.value)), children: options.map((option) => (_jsx("option", { value: option.value, disabled: option.disabled, children: option.label }, option.value))) }) }));
};
export const MultiSelect = createComponent("MultiSelect");
export const ComboboxView = ({ id, name, label, options, value, defaultValue, searchValue, defaultSearchValue = "", placeholder, emptyText = "Aucune option", clearable, error, helperText, disabled, required, className, testId, onValueChange, onSearchChange, }) => {
    const generatedId = useId();
    const id_ = id ?? name ?? generatedId;
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const [internalSearch, setInternalSearch] = useState(defaultSearchValue);
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const currentValue = value ?? internalValue;
    const currentSearch = searchValue ?? internalSearch;
    const selected = options.find((option) => option.value === currentValue);
    const filteredOptions = useFilteredOptions(options, currentSearch);
    useEffect(() => {
        if (!open)
            return;
        const onPointer = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target))
                setOpen(false);
        };
        document.addEventListener("mousedown", onPointer);
        return () => document.removeEventListener("mousedown", onPointer);
    }, [open]);
    const setSearch = (next) => {
        setInternalSearch(next);
        onSearchChange?.(next);
    };
    const selectOption = (option) => {
        if (option.disabled)
            return;
        setInternalValue(option.value);
        setSearch(option.label);
        onValueChange?.(option.value);
        setOpen(false);
    };
    return (_jsx(FieldShell, { id: id_, label: label, error: error, helperText: helperText, required: required, className: className, children: _jsxs("div", { className: "relative", ref: containerRef, children: [_jsx("input", { id: id_, name: name, role: "combobox", "aria-expanded": open, "aria-controls": `${id_}-listbox`, "aria-invalid": error ? true : undefined, "data-testid": testId, className: "h-10 w-full rounded-md border border-input bg-surface px-3 pr-20 text-bk-sm outline-none focus:ring-2 focus:ring-ring/40", value: currentSearch || selected?.label || "", placeholder: placeholder, disabled: disabled, required: required, onFocus: () => setOpen(true), onKeyDown: (event) => {
                        if (event.key === "Escape")
                            setOpen(false);
                        else if (event.key === "ArrowDown" && !open)
                            setOpen(true);
                        else if (event.key === "Enter" && open) {
                            const first = filteredOptions.find((option) => !option.disabled);
                            if (first) {
                                event.preventDefault();
                                selectOption(first);
                            }
                        }
                    }, onChange: (event) => {
                        setSearch(event.currentTarget.value);
                        setOpen(true);
                    } }), clearable && (currentValue || currentSearch) && (_jsx(ButtonView, { type: "button", size: "xs", variant: "ghost", text: "Effacer", "aria-label": "Effacer la s\u00E9lection", className: "absolute right-1 top-1", onClick: () => {
                        setInternalValue("");
                        setSearch("");
                        onValueChange?.("");
                    } })), open && !disabled && (_jsx("div", { id: `${id_}-listbox`, role: "listbox", className: "absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-surface p-1 shadow-lg", children: filteredOptions.length === 0 ? (_jsx("div", { className: "px-2 py-1.5 text-bk-sm text-muted-foreground", children: emptyText })) : (filteredOptions.map((option) => (_jsx("button", { type: "button", role: "option", "aria-selected": option.value === currentValue, disabled: option.disabled, className: cn("block w-full rounded px-2 py-1.5 text-left text-bk-sm hover:bg-muted", option.value === currentValue && "bg-primary text-primary-foreground"), onMouseDown: (event) => event.preventDefault(), onClick: () => selectOption(option), children: option.label }, option.value)))) }))] }) }));
};
export const Combobox = createComponent("Combobox");
export const AutocompleteView = ComboboxView;
export const Autocomplete = createComponent("Autocomplete");
const useFilteredOptions = (options, search) => useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized)
        return options;
    return options.filter((option) => option.label.toLowerCase().includes(normalized));
}, [options, search]);
//# sourceMappingURL=Choice.js.map
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";
import { ButtonView } from "./Button";
import { FieldShell } from "./Input";
import { type SelectOption, type SelectProps } from "./Select";

export type MultiSelectProps = Omit<SelectProps, "value" | "defaultValue" | "onValueChange"> & {
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
};

export const MultiSelectView = ({
  id,
  name,
  label,
  options,
  values,
  defaultValues,
  error,
  helperText,
  disabled,
  required,
  className,
  onValuesChange,
  testId,
}: MultiSelectProps) => {
  const generatedId = useId();
  const id_ = id ?? name ?? generatedId;

  return (
    <FieldShell id={id_} label={label} error={error} helperText={helperText} required={required} className={className}>
      <select
        id={id_}
        name={name}
        multiple
        value={values}
        defaultValue={defaultValues}
        disabled={disabled}
        required={required}
        data-testid={testId}
        aria-invalid={error ? true : undefined}
        className="min-h-28 rounded-md border border-input bg-surface p-2 text-bk-sm"
        onChange={(event) =>
          onValuesChange?.(Array.from(event.currentTarget.selectedOptions).map((option) => option.value))
        }
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
};
export const MultiSelect = createComponent<MultiSelectProps>("MultiSelect");

export type ComboboxProps = Omit<SelectProps, "onValueChange"> & {
  searchValue?: string;
  defaultSearchValue?: string;
  clearable?: boolean;
  emptyText?: ReactNode;
  onValueChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
};

export const ComboboxView = ({
  id,
  name,
  label,
  options,
  value,
  defaultValue,
  searchValue,
  defaultSearchValue = "",
  placeholder,
  emptyText = "Aucune option",
  clearable,
  error,
  helperText,
  disabled,
  required,
  className,
  testId,
  onValueChange,
  onSearchChange,
}: ComboboxProps) => {
  const generatedId = useId();
  const id_ = id ?? name ?? generatedId;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [internalSearch, setInternalSearch] = useState(defaultSearchValue);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentValue = value ?? internalValue;
  const currentSearch = searchValue ?? internalSearch;
  const selected = options.find((option) => option.value === currentValue);
  const filteredOptions = useFilteredOptions(options, currentSearch);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  const setSearch = (next: string) => {
    setInternalSearch(next);
    onSearchChange?.(next);
  };
  const selectOption = (option: SelectOption) => {
    if (option.disabled) return;
    setInternalValue(option.value);
    setSearch(option.label);
    onValueChange?.(option.value);
    setOpen(false);
  };

  return (
    <FieldShell id={id_} label={label} error={error} helperText={helperText} required={required} className={className}>
      <div className="relative" ref={containerRef}>
        <input
          id={id_}
          name={name}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id_}-listbox`}
          aria-invalid={error ? true : undefined}
          data-testid={testId}
          className="h-10 w-full rounded-md border border-input bg-surface px-3 pr-20 text-bk-sm outline-none focus:ring-2 focus:ring-ring/40"
          value={currentSearch || selected?.label || ""}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
            else if (event.key === "ArrowDown" && !open) setOpen(true);
            else if (event.key === "Enter" && open) {
              const first = filteredOptions.find((option) => !option.disabled);
              if (first) {
                event.preventDefault();
                selectOption(first);
              }
            }
          }}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setOpen(true);
          }}
        />
        {clearable && (currentValue || currentSearch) && (
          <ButtonView
            type="button"
            size="xs"
            variant="ghost"
            text="Effacer"
            aria-label="Effacer la sélection"
            className="absolute right-1 top-1"
            onClick={() => {
              setInternalValue("");
              setSearch("");
              onValueChange?.("");
            }}
          />
        )}
        {open && !disabled && (
          <div id={`${id_}-listbox`} role="listbox" className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-surface p-1 shadow-lg">
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-1.5 text-bk-sm text-muted-foreground">{emptyText}</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === currentValue}
                  disabled={option.disabled}
                  className={cn("block w-full rounded px-2 py-1.5 text-left text-bk-sm hover:bg-muted", option.value === currentValue && "bg-primary text-primary-foreground")}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(option)}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </FieldShell>
  );
};
export const Combobox = createComponent<ComboboxProps>("Combobox");

export type AutocompleteProps = ComboboxProps;
export const AutocompleteView = ComboboxView;
export const Autocomplete = createComponent<AutocompleteProps>("Autocomplete");

const useFilteredOptions = (options: SelectOption[], search: string) =>
  useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, search]);

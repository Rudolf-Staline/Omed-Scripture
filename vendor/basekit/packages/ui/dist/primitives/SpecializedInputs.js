import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useRef, useState, } from "react";
import { cn, createComponent } from "@basekit/core";
import { Icon } from "../internal";
import { ButtonView } from "./Button";
import { InputView } from "./Input";
export const TextInputView = forwardRef(function TextInputView(props, ref) {
    return _jsx(InputView, { ref: ref, type: "text", ...props });
});
export const TextInput = createComponent("TextInput");
const parseNumberValue = (value) => (value === "" ? null : Number(value));
export const NumberInputView = forwardRef(function NumberInputView({ minValue, maxValue, step, clampOnBlur, onNumberChange, onValueChange, onBlur, ...props }, ref) {
    return (_jsx(InputView, { ref: ref, type: "number", minValue: minValue, maxValue: maxValue, step: step, ...props, onChangeValue: (nextValue) => {
            onValueChange?.(nextValue);
            const parsed = parseNumberValue(nextValue);
            onNumberChange?.(parsed == null || Number.isNaN(parsed) ? null : parsed);
        }, onBlur: (event) => {
            if (clampOnBlur && event.currentTarget.value !== "") {
                const parsed = Number(event.currentTarget.value);
                if (!Number.isNaN(parsed)) {
                    const clamped = Math.min(maxValue ?? parsed, Math.max(minValue ?? parsed, parsed));
                    if (clamped !== parsed) {
                        // Keep the native input in sync when clamping an uncontrolled value on blur.
                        event.currentTarget.value = String(clamped);
                    }
                    onValueChange?.(String(clamped));
                    onNumberChange?.(clamped);
                }
            }
            onBlur?.(event);
        }, rightSlot: props.rightSlot }));
});
export const NumberInput = createComponent("NumberInput");
export const PasswordInputView = forwardRef(function PasswordInputView({ showToggle = true, visible, defaultVisible = false, onVisibleChange, rightSlot, ...props }, ref) {
    const [internalVisible, setInternalVisible] = useState(defaultVisible);
    const isVisible = visible ?? internalVisible;
    const toggle = () => {
        const next = !isVisible;
        setInternalVisible(next);
        onVisibleChange?.(next);
    };
    return (_jsx(InputView, { ref: ref, type: isVisible ? "text" : "password", ...props, rightSlot: showToggle ? (_jsx(ButtonView, { type: "button", size: "xs", variant: "ghost", "aria-label": isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe", text: isVisible ? "Masquer" : "Afficher", onClick: toggle })) : (rightSlot) }));
});
export const PasswordInput = createComponent("PasswordInput");
export const SearchInputView = forwardRef(function SearchInputView({ clearable, loading, onClear, rightSlot, leftSlot, value, onValueChange, disabled, ...props }, ref) {
    return (_jsx(InputView, { ref: ref, type: "search", value: value, disabled: disabled, onValueChange: onValueChange, leftSlot: leftSlot ?? _jsx(Icon, { name: "search", className: "text-muted-foreground" }), ...props, rightSlot: loading ? (_jsx(Icon, { name: "spinner", className: "animate-spin text-muted-foreground" })) : clearable && value ? (_jsx(ButtonView, { type: "button", size: "xs", variant: "ghost", "aria-label": "Effacer la recherche", text: "Effacer", disabled: disabled, onClick: () => {
                onValueChange?.("");
                onClear?.();
            } })) : (rightSlot) }));
});
export const SearchInput = createComponent("SearchInput");
export const EmailInputView = forwardRef(function EmailInputView(props, ref) {
    return _jsx(InputView, { ref: ref, type: "email", autoComplete: "email", ...props });
});
export const EmailInput = createComponent("EmailInput");
export const PhoneInputView = forwardRef(function PhoneInputView(props, ref) {
    return _jsx(InputView, { ref: ref, type: "tel", autoComplete: "tel", ...props });
});
export const PhoneInput = createComponent("PhoneInput");
export const UrlInputView = forwardRef(function UrlInputView(props, ref) {
    return _jsx(InputView, { ref: ref, type: "url", ...props });
});
export const UrlInput = createComponent("UrlInput");
const splitAcceptedFiles = (files, maxSize) => ({
    accepted: files.filter((file) => maxSize == null || file.size <= maxSize),
    rejected: files.filter((file) => maxSize != null && file.size > maxSize),
});
export const FileInputView = forwardRef(function FileInputView({ accept, multiple, maxSize, onFilesChange, onRejectedFilesChange, onChange, ...props }, ref) {
    const handleChange = (event) => {
        onChange?.(event);
        const { accepted, rejected } = splitAcceptedFiles(Array.from(event.currentTarget.files ?? []), maxSize);
        onFilesChange?.(accepted);
        if (rejected.length > 0)
            onRejectedFilesChange?.(rejected);
    };
    return _jsx(InputView, { ref: ref, type: "file", ...props, accept: accept, multiple: multiple, onChange: handleChange });
});
export const FileInput = createComponent("FileInput");
export const DateTimeInputView = forwardRef(function DateTimeInputView(props, ref) {
    return _jsx(InputView, { ref: ref, type: "datetime-local", ...props });
});
export const DateTimeInput = createComponent("DateTimeInput");
export const DropzoneView = forwardRef(function DropzoneView({ text = "Déposer des fichiers ou cliquer pour sélectionner", activeText = "Relâcher pour déposer", disabled, className, ...props }, ref) {
    const inputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const handleFiles = (files) => {
        const { accepted, rejected } = splitAcceptedFiles(files, props.maxSize);
        props.onFilesChange?.(accepted);
        if (rejected.length > 0)
            props.onRejectedFilesChange?.(rejected);
    };
    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);
        if (!disabled)
            handleFiles(Array.from(event.dataTransfer.files));
    };
    return (_jsxs("div", { role: "button", tabIndex: disabled ? -1 : 0, "aria-disabled": disabled, className: cn("rounded-lg border border-dashed border-input bg-muted/30 p-4 text-center text-bk-sm transition-colors", dragActive && "border-primary bg-primary/10", disabled && "cursor-not-allowed opacity-60", className), onClick: () => !disabled && inputRef.current?.click(), onKeyDown: (event) => {
            if (disabled)
                return;
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                inputRef.current?.click();
            }
        }, onDragOver: (event) => {
            event.preventDefault();
            if (!disabled)
                setDragActive(true);
        }, onDragLeave: () => setDragActive(false), onDrop: handleDrop, children: [_jsx("input", { ref: (node) => {
                    inputRef.current = node;
                    if (typeof ref === "function")
                        ref(node);
                    else if (ref)
                        ref.current = node;
                }, type: "file", hidden: true, accept: props.accept, multiple: props.multiple, disabled: disabled, onChange: (event) => {
                    handleFiles(Array.from(event.currentTarget.files ?? []));
                } }), dragActive ? activeText : text] }));
});
export const Dropzone = createComponent("Dropzone");
//# sourceMappingURL=SpecializedInputs.js.map
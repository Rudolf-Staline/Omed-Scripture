import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn, createComponent, isUINode, renderNode, } from "@basekit/core";
import { defaultRegistry } from "../registry";
import { CardView } from "../composition/Card";
/** Renders a slot that may hold declarative nodes, arrays, or React nodes. */
const renderSlot = (slot) => {
    if (Array.isArray(slot)) {
        return slot.map((child, i) => (_jsx("span", { className: "contents", children: renderSlot(child) }, i)));
    }
    if (isUINode(slot))
        return renderNode(slot, defaultRegistry);
    return slot;
};
export const FormView = ({ children, onSubmit, className, id, ...rest }) => (_jsx("form", { id: id, className: cn("space-y-6", className), onSubmit: (event) => {
        event.preventDefault();
        onSubmit?.();
    }, ...rest, children: renderSlot(children) }));
export const Form = createComponent("Form");
export const FormSectionView = ({ title, description, children, className, }) => (_jsxs("section", { className: cn("space-y-4", className), children: [(title != null || description != null) && (_jsxs("div", { className: "space-y-1", children: [title != null && (_jsx("h3", { className: "font-semibold text-foreground", children: title })), description != null && (_jsx("p", { className: "text-bk-sm text-muted-foreground", children: description }))] })), _jsx("div", { className: "space-y-4", children: renderSlot(children) })] }));
export const FormSection = createComponent("FormSection");
export const FormFieldView = ({ label, htmlFor, error, helperText, required, children, className, }) => (_jsxs("div", { className: cn("flex flex-col gap-1.5", className), children: [label != null && (_jsxs("label", { htmlFor: htmlFor, className: "text-bk-sm font-medium text-foreground", children: [label, required && _jsx("span", { className: "text-danger", children: " *" })] })), renderSlot(children), error ? (_jsx("p", { className: "text-bk-sm text-danger", role: "alert", children: error })) : helperText ? (_jsx("p", { className: "text-bk-sm text-muted-foreground", children: helperText })) : null] }));
export const FormField = createComponent("FormField");
export const FormActionsView = ({ children, align = "end", className, }) => (_jsx("div", { className: cn("flex items-center gap-3 border-t border-border pt-4", align === "end" && "justify-end", align === "start" && "justify-start", align === "between" && "justify-between", className), children: renderSlot(children) }));
export const FormActions = createComponent("FormActions");
export const FilterBarView = ({ title, fields, actions, className, }) => (_jsxs(CardView, { className: cn("p-4", className), children: [title != null && (_jsx("p", { className: "mb-3 text-bk-sm font-medium text-muted-foreground", children: title })), _jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-end", children: [_jsx("div", { className: "grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: fields?.map((field, i) => (_jsx("div", { children: renderSlot(field) }, i))) }), actions != null && actions.length > 0 && (_jsx("div", { className: "flex items-center gap-2", children: actions.map((action, i) => (_jsx("div", { children: renderSlot(action) }, i))) }))] })] }));
export const FilterBar = createComponent("FilterBar");
export const FieldLabelView = ({ children, htmlFor, required, className }) => _jsxs("label", { htmlFor: htmlFor, className: cn("text-bk-sm font-medium text-foreground", className), children: [children, required && _jsx("span", { className: "text-danger", children: " *" })] });
export const FieldLabel = createComponent("FieldLabel");
export const FieldHintView = ({ children, className }) => _jsx("p", { className: cn("text-bk-sm text-muted-foreground", className), children: children });
export const FieldHint = createComponent("FieldHint");
export const FieldErrorView = ({ children, className }) => _jsx("p", { role: "alert", className: cn("text-bk-sm text-danger", className), children: children });
export const FieldError = createComponent("FieldError");
//# sourceMappingURL=Form.js.map
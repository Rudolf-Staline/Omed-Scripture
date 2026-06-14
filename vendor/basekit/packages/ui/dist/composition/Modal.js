import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn, createComponent } from "@basekit/core";
import { IconButtonView } from "../primitives/Button";
const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};
export const ModalView = ({ open, onClose, title, description, children, footer, size = "md", dismissable = true, className, }) => {
    const panelRef = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const onKey = (event) => {
            if (event.key === "Escape")
                onClose();
        };
        document.addEventListener("keydown", onKey);
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        panelRef.current?.focus();
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = previous;
        };
    }, [open, onClose]);
    if (!open || typeof document === "undefined")
        return null;
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-modal flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-foreground/40 backdrop-blur-sm", onClick: dismissable ? onClose : undefined, "aria-hidden": true }), _jsxs("div", { ref: panelRef, role: "dialog", "aria-modal": "true", "aria-label": typeof title === "string" ? title : undefined, tabIndex: -1, className: cn("relative w-full rounded-xl border border-border bg-surface shadow-strong outline-none", sizeClass[size], className), children: [(title != null || description != null) && (_jsxs("div", { className: "flex items-start justify-between gap-4 border-b border-border p-5", children: [_jsxs("div", { className: "space-y-1", children: [title != null && (_jsx("h2", { className: "text-lg font-semibold text-foreground", children: title })), description != null && (_jsx("p", { className: "text-bk-sm text-muted-foreground", children: description }))] }), _jsx(IconButtonView, { icon: "close", "aria-label": "Fermer", onClick: onClose, size: "sm" })] })), _jsx("div", { className: "p-5", children: children }), footer != null && (_jsx("div", { className: "flex items-center justify-end gap-2 border-t border-border p-5", children: footer }))] })] }), document.body);
};
export const Modal = createComponent("Modal");
export const DrawerView = ({ open, onClose, title, children, footer, side = "right", width = "22rem", dismissable = true, className, }) => {
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    if (!open || typeof document === "undefined")
        return null;
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-drawer", children: [_jsx("div", { className: "absolute inset-0 bg-foreground/40 backdrop-blur-sm", onClick: dismissable ? onClose : undefined, "aria-hidden": true }), _jsxs("div", { role: "dialog", "aria-modal": "true", className: cn("absolute inset-y-0 flex w-full flex-col border-border bg-surface shadow-strong", side === "right" ? "right-0 border-l" : "left-0 border-r", className), style: { maxWidth: width }, children: [title != null && (_jsxs("div", { className: "flex items-center justify-between border-b border-border p-5", children: [_jsx("h2", { className: "text-lg font-semibold text-foreground", children: title }), _jsx(IconButtonView, { icon: "close", "aria-label": "Fermer", onClick: onClose, size: "sm" })] })), _jsx("div", { className: "flex-1 overflow-y-auto p-5", children: children }), footer != null && (_jsx("div", { className: "border-t border-border p-5", children: footer }))] })] }), document.body);
};
export const Drawer = createComponent("Drawer");
//# sourceMappingURL=Modal.js.map
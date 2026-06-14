import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn, createComponent } from "@basekit/core";
import { Icon, renderIcon, softToneStyles, } from "../internal";
import { IconButtonView } from "../primitives/Button";
const defaultIcon = {
    neutral: "info",
    primary: "info",
    accent: "info",
    success: "check-circle",
    warning: "warning",
    danger: "error",
};
export const AlertView = ({ title, children, tone = "primary", icon, onClose, className, hidden, }) => {
    if (hidden)
        return null;
    const resolvedIcon = icon === false ? null : renderIcon(icon ?? defaultIcon[tone]);
    return (_jsxs("div", { role: "alert", className: cn("flex items-start gap-3 rounded-lg border p-4 text-bk-sm", softToneStyles[tone], className), children: [resolvedIcon != null && (_jsx("span", { className: "mt-0.5 shrink-0", children: resolvedIcon })), _jsxs("div", { className: "min-w-0 flex-1 space-y-0.5", children: [title != null && _jsx("p", { className: "font-semibold", children: title }), children != null && _jsx("div", { className: "text-current/90", children: children })] }), onClose && (_jsx(IconButtonView, { icon: "close", "aria-label": "Fermer", size: "xs", variant: "ghost", onClick: onClose }))] }));
};
export const Alert = createComponent("Alert");
export const CalloutView = ({ title, children, tone = "neutral", icon, className, }) => (_jsxs("div", { className: cn("flex gap-3 rounded-lg border-l-4 bg-surface-muted p-4 text-bk-sm", tone === "primary" && "border-l-primary", tone === "accent" && "border-l-accent", tone === "success" && "border-l-success", tone === "warning" && "border-l-warning", tone === "danger" && "border-l-danger", tone === "neutral" && "border-l-border", className), children: [icon != null && (_jsx("span", { className: "mt-0.5 shrink-0 text-muted-foreground", children: renderIcon(icon) })), _jsxs("div", { className: "space-y-1", children: [title != null && (_jsx("p", { className: "font-semibold text-foreground", children: title })), children != null && (_jsx("div", { className: "text-muted-foreground", children: children }))] })] }));
export const Callout = createComponent("Callout");
export const EmptyStateView = ({ title = "Aucune donnée", description, icon = "search", action, className, }) => (_jsxs("div", { className: cn("flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center", className), children: [_jsx("span", { className: "grid h-12 w-12 place-items-center rounded-full bg-surface-muted text-muted-foreground", children: renderIcon(icon, 22) }), _jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "font-semibold text-foreground", children: title }), description != null && (_jsx("p", { className: "max-w-sm text-bk-sm text-muted-foreground", children: description }))] }), action != null && _jsx("div", { className: "pt-1", children: action })] }));
export const EmptyState = createComponent("EmptyState");
export const ErrorStateView = ({ title = "Une erreur est survenue", description, action, className, }) => (_jsxs("div", { className: cn("flex flex-col items-center justify-center gap-3 rounded-xl border border-danger/30 bg-danger-soft px-6 py-12 text-center", className), children: [_jsx("span", { className: "grid h-12 w-12 place-items-center rounded-full bg-danger/15 text-danger", children: _jsx(Icon, { name: "error", size: 22 }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "font-semibold text-foreground", children: title }), description != null && (_jsx("p", { className: "max-w-sm text-bk-sm text-muted-foreground", children: description }))] }), action != null && _jsx("div", { className: "pt-1", children: action })] }));
export const ErrorState = createComponent("ErrorState");
//# sourceMappingURL=Alert.js.map
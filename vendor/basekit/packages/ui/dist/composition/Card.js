import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn, createComponent } from "@basekit/core";
import { paddingStyles, radiusStyles, shadowStyles, softToneStyles, } from "../internal";
const CardRootView = ({ children, variant = "outlined", tone, padding = "none", radius = "lg", shadow, border, interactive, onClick, className, id, hidden, testId, }) => {
    if (hidden)
        return null;
    const resolvedShadow = shadow ?? (variant === "elevated" ? "soft" : "none");
    const showBorder = border ?? variant !== "elevated";
    const Tag = interactive || onClick ? "button" : "div";
    return (_jsx(Tag, { id: id, "data-testid": testId, onClick: onClick, type: Tag === "button" ? "button" : undefined, className: cn("bg-surface text-left text-foreground", radiusStyles[radius], shadowStyles[resolvedShadow], showBorder && "border border-border", tone && softToneStyles[tone], padding !== "none" && paddingStyles[padding], (interactive || onClick) &&
            "transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", Tag === "button" && "block w-full", className), children: children }));
};
const CardHeaderView = ({ title, description, actions, children, className, }) => (_jsxs("div", { className: cn("flex items-start justify-between gap-4 border-b border-border p-5", className), children: [children ?? (_jsxs("div", { className: "space-y-1", children: [title != null && (_jsx("h3", { className: "font-semibold text-foreground", children: title })), description != null && (_jsx("p", { className: "text-bk-sm text-muted-foreground", children: description }))] })), actions != null && (_jsx("div", { className: "flex items-center gap-2", children: actions }))] }));
const CardContentView = ({ children, className, }) => _jsx("div", { className: cn("p-5", className), children: children });
const CardFooterView = ({ children, className, }) => (_jsx("div", { className: cn("flex items-center justify-end gap-2 border-t border-border p-5", className), children: children }));
const CardTitleView = ({ children, className, }) => (_jsx("h3", { className: cn("font-semibold text-foreground", className), children: children }));
const CardDescriptionView = ({ children, className, }) => (_jsx("p", { className: cn("text-bk-sm text-muted-foreground", className), children: children }));
/**
 * Card. React usage: `<Card.View>` + `<Card.Header/Content/Footer>`.
 * Declarative usage: `Card({ children: [CardHeader(...), CardContent(...)] })`.
 */
export const Card = Object.assign(createComponent("Card"), {
    View: CardRootView,
    Header: CardHeaderView,
    Content: CardContentView,
    Footer: CardFooterView,
    Title: CardTitleView,
    Description: CardDescriptionView,
});
export const CardView = CardRootView;
export const CardHeader = createComponent("CardHeader");
export const CardContent = createComponent("CardContent");
export const CardFooter = createComponent("CardFooter");
export { CardHeaderView, CardContentView, CardFooterView, CardTitleView, CardDescriptionView, };
//# sourceMappingURL=Card.js.map
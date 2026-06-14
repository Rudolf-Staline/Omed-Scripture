import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from "react";
import { cn, createComponent } from "@basekit/core";
import { focusRing } from "../internal";
export const BreadcrumbView = ({ id, className, items, separator = "/", testId, onItemClick, ...rest }) => (_jsx("nav", { id: id, "aria-label": rest["aria-label"] ?? "Fil d'Ariane", "data-testid": testId, className: className, children: _jsx("ol", { className: "flex flex-wrap items-center gap-1.5 text-bk-sm", children: items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isCurrent = item.current ?? isLast;
            return (_jsxs(Fragment, { children: [_jsx("li", { className: "inline-flex items-center", children: isCurrent ? (_jsx("span", { "aria-current": "page", className: "font-medium text-foreground", children: item.label })) : item.href ? (_jsx("a", { href: item.href, className: cn("rounded-sm text-muted-foreground transition-colors hover:text-foreground hover:underline", focusRing), onClick: () => onItemClick?.(item, index), children: item.label })) : (_jsx("button", { type: "button", className: cn("rounded-sm text-muted-foreground transition-colors hover:text-foreground", focusRing), onClick: () => onItemClick?.(item, index), children: item.label })) }), !isLast && (_jsx("li", { "aria-hidden": true, className: "select-none text-muted-foreground", children: separator }))] }, index));
        }) }) }));
export const Breadcrumb = createComponent("Breadcrumb");
//# sourceMappingURL=Breadcrumb.js.map
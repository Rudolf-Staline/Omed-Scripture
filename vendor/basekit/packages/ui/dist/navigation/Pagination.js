import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { cn, createComponent } from "@basekit/core";
import { focusRing } from "../internal";
const ELLIPSIS = "ellipsis";
const range = (start, end) => Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);
/** Builds the page list with ellipses, e.g. [1, "ellipsis", 4, 5, 6, "ellipsis", 20]. */
const buildPages = (current, total, siblingCount, boundaryCount) => {
    // Slots: both boundaries, both ellipses, current + siblings on each side.
    const totalSlots = boundaryCount * 2 + siblingCount * 2 + 3;
    if (total <= totalSlots)
        return range(1, total);
    const leftSibling = Math.max(current - siblingCount, boundaryCount + 1);
    const rightSibling = Math.min(current + siblingCount, total - boundaryCount);
    const showLeftEllipsis = leftSibling > boundaryCount + 2;
    const showRightEllipsis = rightSibling < total - boundaryCount - 1;
    const pages = [...range(1, boundaryCount)];
    if (showLeftEllipsis)
        pages.push(ELLIPSIS);
    else
        pages.push(...range(boundaryCount + 1, leftSibling - 1));
    pages.push(...range(leftSibling, rightSibling));
    if (showRightEllipsis)
        pages.push(ELLIPSIS);
    else
        pages.push(...range(rightSibling + 1, total - boundaryCount));
    pages.push(...range(total - boundaryCount + 1, total));
    return pages;
};
const itemBase = cn("inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-2 text-bk-sm font-medium transition-colors", "disabled:pointer-events-none disabled:opacity-50", focusRing);
export const PaginationView = ({ id, className, page, defaultPage = 1, totalPages, siblingCount = 1, boundaryCount = 1, disabled, showFirstLast = false, showPrevNext = true, testId, onPageChange, ...rest }) => {
    const [internal, setInternal] = useState(defaultPage);
    const current = Math.min(Math.max(page ?? internal, 1), Math.max(totalPages, 1));
    const goTo = (next) => {
        const clamped = Math.min(Math.max(next, 1), totalPages);
        if (clamped === current)
            return;
        setInternal(clamped);
        onPageChange?.(clamped);
    };
    const pages = buildPages(current, totalPages, siblingCount, boundaryCount);
    const atStart = current <= 1;
    const atEnd = current >= totalPages;
    return (_jsxs("nav", { id: id, "aria-label": rest["aria-label"] ?? "Pagination", "data-testid": testId, className: cn("flex items-center gap-1", className), children: [showFirstLast && (_jsx("button", { type: "button", className: cn(itemBase, "text-foreground hover:bg-surface-muted"), disabled: disabled || atStart, "aria-label": "Premi\u00E8re page", onClick: () => goTo(1), children: "\u00AB" })), showPrevNext && (_jsx("button", { type: "button", className: cn(itemBase, "text-foreground hover:bg-surface-muted"), disabled: disabled || atStart, "aria-label": "Page pr\u00E9c\u00E9dente", onClick: () => goTo(current - 1), children: "\u2039" })), pages.map((entry, index) => entry === ELLIPSIS ? (_jsx("span", { "aria-hidden": true, className: "inline-flex h-9 min-w-9 items-center justify-center px-1 text-muted-foreground", children: "\u2026" }, `ellipsis-${index}`)) : (_jsx("button", { type: "button", disabled: disabled, "aria-current": entry === current ? "page" : undefined, "aria-label": `Page ${entry}`, className: cn(itemBase, entry === current
                    ? "border-primary bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-surface-muted"), onClick: () => goTo(entry), children: entry }, entry))), showPrevNext && (_jsx("button", { type: "button", className: cn(itemBase, "text-foreground hover:bg-surface-muted"), disabled: disabled || atEnd, "aria-label": "Page suivante", onClick: () => goTo(current + 1), children: "\u203A" })), showFirstLast && (_jsx("button", { type: "button", className: cn(itemBase, "text-foreground hover:bg-surface-muted"), disabled: disabled || atEnd, "aria-label": "Derni\u00E8re page", onClick: () => goTo(totalPages), children: "\u00BB" }))] }));
};
export const Pagination = createComponent("Pagination");
//# sourceMappingURL=Pagination.js.map
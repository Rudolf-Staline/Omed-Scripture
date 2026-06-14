import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn, createComponent } from "@basekit/core";
const skeletonRadius = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
};
export const SkeletonView = ({ width, height = "1rem", radius = "md", className, lines, }) => {
    if (lines && lines > 1) {
        return (_jsx("div", { className: "space-y-2", children: Array.from({ length: lines }).map((_, i) => (_jsx("div", { className: cn("animate-pulse bg-surface-muted", skeletonRadius[radius], className), style: {
                    width: i === lines - 1 ? "70%" : (width ?? "100%"),
                    height,
                } }, i))) }));
    }
    return (_jsx("div", { className: cn("animate-pulse bg-surface-muted", skeletonRadius[radius], className), style: { width: width ?? "100%", height } }));
};
export const Skeleton = createComponent("Skeleton");
const progressFill = {
    neutral: "bg-foreground",
    primary: "bg-primary",
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
};
export const ProgressView = ({ value, max = 100, tone = "primary", label, showValue, className, }) => {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    return (_jsxs("div", { className: cn("space-y-1.5", className), children: [(label != null || showValue) && (_jsxs("div", { className: "flex items-center justify-between text-bk-xs text-muted-foreground", children: [label && _jsx("span", { children: label }), showValue && _jsxs("span", { children: [Math.round(pct), "%"] })] })), _jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-surface-muted", role: "progressbar", "aria-valuenow": value, "aria-valuemin": 0, "aria-valuemax": max, children: _jsx("div", { className: cn("h-full rounded-full transition-all", progressFill[tone]), style: { width: `${pct}%` } }) })] }));
};
export const Progress = createComponent("Progress");
//# sourceMappingURL=Status.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn, createComponent } from "@basekit/core";
import { gapStyles, paddingStyles } from "../internal";
const alignClass = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
};
const justifyClass = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
};
export const StackView = ({ children, gap = "md", align = "stretch", justify = "start", padding, className, id, hidden, testId, }) => hidden ? null : (_jsx("div", { id: id, "data-testid": testId, className: cn("flex flex-col", gapStyles[gap], alignClass[align], justifyClass[justify], padding && paddingStyles[padding], className), children: children }));
export const Stack = createComponent("Stack");
export const InlineView = ({ children, gap = "md", align = "center", justify = "start", padding, wrap, className, id, hidden, testId, }) => hidden ? null : (_jsx("div", { id: id, "data-testid": testId, className: cn("flex flex-row", wrap && "flex-wrap", gapStyles[gap], alignClass[align], justifyClass[justify], padding && paddingStyles[padding], className), children: children }));
export const Inline = createComponent("Inline");
const columnClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    12: "grid-cols-12",
};
export const GridView = ({ children, columns = 2, gap = "md", minItemWidth, className, id, hidden, }) => hidden ? null : (_jsx("div", { id: id, className: cn("grid", gapStyles[gap], !minItemWidth && columnClass[columns], className), style: minItemWidth
        ? {
            gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
        }
        : undefined, children: children }));
export const Grid = createComponent("Grid");
const containerSize = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-none",
};
export const ContainerView = ({ children, size = "lg", className, id, }) => (_jsx("div", { id: id, className: cn("mx-auto w-full px-4 sm:px-6", containerSize[size], className), children: children }));
export const Container = createComponent("Container");
export const SectionView = ({ children, title, description, actions, className, id, }) => (_jsxs("section", { id: id, className: cn("space-y-4", className), children: [(title != null || actions != null) && (_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "space-y-1", children: [title != null && (_jsx("h2", { className: "text-lg font-semibold text-foreground", children: title })), description != null && (_jsx("p", { className: "text-bk-sm text-muted-foreground", children: description }))] }), actions != null && (_jsx("div", { className: "flex items-center gap-2", children: actions }))] })), children] }));
export const Section = createComponent("Section");
export const ScrollAreaView = ({ children, maxHeight = "100%", className, }) => (_jsx("div", { className: cn("overflow-auto", className), style: { maxHeight }, children: children }));
export const ScrollArea = createComponent("ScrollArea");
export const SplitPaneView = ({ primary, secondary, secondaryWidth = "20rem", side = "right", gap = "lg", className, }) => (_jsxs("div", { className: cn("grid", gapStyles[gap], className), style: {
        gridTemplateColumns: side === "right" ? `1fr ${secondaryWidth}` : `${secondaryWidth} 1fr`,
    }, children: [side === "left" && _jsx("aside", { children: secondary }), _jsx("div", { className: "min-w-0", children: primary }), side === "right" && _jsx("aside", { children: secondary })] }));
export const SplitPane = createComponent("SplitPane");
//# sourceMappingURL=Primitives.js.map
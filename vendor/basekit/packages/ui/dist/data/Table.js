import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, } from "react";
import { cn, createComponent } from "@basekit/core";
const TableContext = createContext({});
export const TableView = ({ id, className, children, striped, compact, bordered, }) => (_jsx(TableContext.Provider, { value: { striped, compact, bordered }, children: _jsx("div", { className: cn("overflow-x-auto rounded-xl border border-border bg-surface", className), children: _jsx("table", { id: id, className: "w-full border-collapse text-bk-sm", children: children }) }) }));
export const Table = createComponent("Table");
export const TableHeaderView = ({ className, children }) => (_jsx("thead", { className: cn("border-b border-border bg-surface-muted text-left text-muted-foreground", className), children: children }));
export const TableHeader = createComponent("TableHeader");
export const TableBodyView = ({ className, children }) => {
    const { striped } = useContext(TableContext);
    return (_jsx("tbody", { className: cn("divide-y divide-border", striped && "[&>tr:nth-child(even)]:bg-surface-muted/50", className), children: children }));
};
export const TableBody = createComponent("TableBody");
export const TableRowView = ({ className, children, onClick }) => {
    const { bordered } = useContext(TableContext);
    return (_jsx("tr", { onClick: onClick, className: cn(bordered && "[&>td]:border [&>th]:border [&>td]:border-border [&>th]:border-border", onClick && "cursor-pointer transition-colors hover:bg-surface-muted", className), children: children }));
};
export const TableRow = createComponent("TableRow");
const alignClass = { left: "text-left", center: "text-center", right: "text-right" };
const useCellPadding = () => (useContext(TableContext).compact ? "px-3 py-2" : "px-4 py-3");
export const TableHeadView = ({ className, children, align = "left", colSpan, scope = "col", }) => {
    const pad = useCellPadding();
    return (_jsx("th", { scope: scope, colSpan: colSpan, className: cn(pad, "font-medium", alignClass[align], className), children: children }));
};
export const TableHead = createComponent("TableHead");
export const TableCellView = ({ className, children, align = "left", colSpan, }) => {
    const pad = useCellPadding();
    return (_jsx("td", { colSpan: colSpan, className: cn(pad, "text-foreground", alignClass[align], className), children: children }));
};
export const TableCell = createComponent("TableCell");
export const TableCaptionView = ({ className, children }) => (_jsx("caption", { className: cn("px-4 py-2 text-left text-bk-sm text-muted-foreground", className), children: children }));
export const TableCaption = createComponent("TableCaption");
//# sourceMappingURL=Table.js.map
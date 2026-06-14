import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { cn, isUINode, renderNode } from "@basekit/core";
import { defaultRegistry } from "../registry";
import { EmptyStateView } from "../feedback/Alert";
import { SkeletonView } from "../feedback/Status";
const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};
const resolveKey = (row, index, rowKey) => {
    if (typeof rowKey === "function")
        return rowKey(row, index);
    if (rowKey)
        return row[rowKey];
    return index;
};
const renderCell = (column, row, index) => {
    if (column.cell) {
        const result = column.cell(row, index);
        return isUINode(result)
            ? renderNode(result, defaultRegistry)
            : result;
    }
    if (typeof column.accessor === "function")
        return column.accessor(row);
    if (column.accessor) {
        const value = row[column.accessor];
        return value == null ? "" : String(value);
    }
    return null;
};
export function DataTableView({ rows, columns, rowKey, loading, emptyText = "Aucune donnée", striped, hoverable, compact, footer, onRowClick, selectable, selectedRows, onSelectionChange, className, }) {
    const [internalSelection, setInternalSelection] = useState([]);
    const selection = selectedRows ?? internalSelection;
    const setSelection = (next) => {
        setInternalSelection(next);
        onSelectionChange?.(next);
    };
    const allKeys = useMemo(() => rows.map((row, index) => resolveKey(row, index, rowKey)), [rows, rowKey]);
    const allSelected = selection.length > 0 && selection.length === rows.length;
    const cellPad = compact ? "px-3 py-2" : "px-4 py-3";
    const hasFooter = footer != null || columns.some((c) => c.footer != null);
    return (_jsx("div", { className: cn("overflow-hidden rounded-xl border border-border bg-surface", className), children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse text-bk-sm", children: [_jsx("thead", { className: "border-b border-border bg-surface-muted text-muted-foreground", children: _jsxs("tr", { children: [selectable && (_jsx("th", { className: cn(cellPad, "w-10"), children: _jsx("input", { type: "checkbox", "aria-label": "Tout s\u00E9lectionner", checked: allSelected, onChange: (e) => setSelection(e.target.checked ? allKeys : []) }) })), columns.map((column) => (_jsx("th", { scope: "col", style: { width: column.width }, className: cn(cellPad, "font-medium", alignClass[column.align ?? "left"]), children: column.header }, column.id)))] }) }), _jsx("tbody", { className: "divide-y divide-border", children: loading ? (Array.from({ length: 4 }).map((_, rowIndex) => (_jsxs("tr", { children: [selectable && _jsx("td", { className: cellPad }), columns.map((column) => (_jsx("td", { className: cellPad, children: _jsx(SkeletonView, { height: "0.9rem" }) }, column.id)))] }, `skeleton-${rowIndex}`)))) : rows.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length + (selectable ? 1 : 0), className: "p-0", children: _jsx(EmptyStateView, { title: emptyText, className: "rounded-none border-0" }) }) })) : (rows.map((row, index) => {
                            const key = resolveKey(row, index, rowKey);
                            const isSelected = selection.includes(key);
                            return (_jsxs("tr", { onClick: onRowClick ? () => onRowClick(row) : undefined, className: cn(striped && index % 2 === 1 && "bg-surface-muted/50", isSelected && "bg-primary-soft", (hoverable || onRowClick) &&
                                    "cursor-pointer transition-colors hover:bg-surface-muted"), children: [selectable && (_jsx("td", { className: cellPad, onClick: (e) => e.stopPropagation(), children: _jsx("input", { type: "checkbox", "aria-label": "S\u00E9lectionner la ligne", checked: isSelected, onChange: (e) => setSelection(e.target.checked
                                                ? [...selection, key]
                                                : selection.filter((k) => k !== key)) }) })), columns.map((column) => (_jsx("td", { className: cn(cellPad, "text-foreground", alignClass[column.align ?? "left"]), children: renderCell(column, row, index) }, column.id)))] }, key));
                        })) }), hasFooter && !loading && rows.length > 0 && (_jsxs("tfoot", { className: "border-t border-border bg-surface-muted font-medium text-foreground", children: [_jsxs("tr", { children: [selectable && _jsx("td", { className: cellPad }), columns.map((column) => (_jsx("td", { className: cn(cellPad, alignClass[column.align ?? "left"]), children: column.footer }, column.id)))] }), footer != null && (_jsx("tr", { children: _jsx("td", { colSpan: columns.length + (selectable ? 1 : 0), className: cellPad, children: footer }) }))] }))] }) }) }));
}
/** Typed column helper for inline definitions. */
export const Column = (column) => column;
/**
 * Declarative DataTable factory. Produces a `UINode` whose props carry the
 * (generic) rows/columns; the registry renders it with `DataTableView`.
 */
export const DataTable = (props) => ({
    $$basekit: "node",
    component: "DataTable",
    props: props,
    children: [],
});
//# sourceMappingURL=DataTable.js.map
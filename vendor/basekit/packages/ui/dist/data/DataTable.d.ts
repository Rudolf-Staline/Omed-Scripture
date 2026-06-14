import { type Key, type ReactNode } from "react";
import { type UINode } from "@basekit/core";
export type DataTableColumn<T extends object> = {
    id: string;
    header: ReactNode;
    /** Key of the row, or a function returning a rendered value. */
    accessor?: keyof T | ((row: T) => ReactNode);
    /** Full control over the cell. May return a React node or a declarative UINode. */
    cell?: (row: T, index: number) => ReactNode | UINode;
    align?: "left" | "center" | "right";
    width?: string | number;
    sortable?: boolean;
    footer?: ReactNode;
};
export type DataTableProps<T extends object> = {
    rows: T[];
    columns: DataTableColumn<T>[];
    rowKey?: keyof T | ((row: T, index: number) => Key);
    loading?: boolean;
    emptyText?: string;
    striped?: boolean;
    hoverable?: boolean;
    compact?: boolean;
    footer?: ReactNode;
    onRowClick?: (row: T) => void;
    selectable?: boolean;
    selectedRows?: Key[];
    onSelectionChange?: (selected: Key[]) => void;
    className?: string;
};
export declare function DataTableView<T extends object>({ rows, columns, rowKey, loading, emptyText, striped, hoverable, compact, footer, onRowClick, selectable, selectedRows, onSelectionChange, className, }: DataTableProps<T>): import("react").JSX.Element;
/** Typed column helper for inline definitions. */
export declare const Column: <T extends object>(column: DataTableColumn<T>) => DataTableColumn<T>;
/**
 * Declarative DataTable factory. Produces a `UINode` whose props carry the
 * (generic) rows/columns; the registry renders it with `DataTableView`.
 */
export declare const DataTable: <T extends object>(props: DataTableProps<T>) => UINode;
//# sourceMappingURL=DataTable.d.ts.map
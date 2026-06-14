import { type ReactNode, type ThHTMLAttributes, type TdHTMLAttributes } from "react";
export type TableProps = {
    id?: string;
    className?: string;
    children?: ReactNode;
    striped?: boolean;
    compact?: boolean;
    bordered?: boolean;
};
export declare const TableView: ({ id, className, children, striped, compact, bordered, }: TableProps) => import("react").JSX.Element;
export declare const Table: import("@basekit/core").DeclarativeComponent<TableProps>;
export type TableSectionProps = {
    className?: string;
    children?: ReactNode;
};
export declare const TableHeaderView: ({ className, children }: TableSectionProps) => import("react").JSX.Element;
export declare const TableHeader: import("@basekit/core").DeclarativeComponent<TableSectionProps>;
export declare const TableBodyView: ({ className, children }: TableSectionProps) => import("react").JSX.Element;
export declare const TableBody: import("@basekit/core").DeclarativeComponent<TableSectionProps>;
export type TableRowProps = {
    className?: string;
    children?: ReactNode;
    onClick?: () => void;
};
export declare const TableRowView: ({ className, children, onClick }: TableRowProps) => import("react").JSX.Element;
export declare const TableRow: import("@basekit/core").DeclarativeComponent<TableRowProps>;
export type TableCellProps = {
    className?: string;
    children?: ReactNode;
    align?: "left" | "center" | "right";
    colSpan?: number;
    scope?: ThHTMLAttributes<HTMLTableCellElement>["scope"];
};
export declare const TableHeadView: ({ className, children, align, colSpan, scope, }: TableCellProps) => import("react").JSX.Element;
export declare const TableHead: import("@basekit/core").DeclarativeComponent<TableCellProps>;
export declare const TableCellView: ({ className, children, align, colSpan, }: Omit<TableCellProps, "scope"> & {
    scope?: TdHTMLAttributes<HTMLTableCellElement>["scope"];
}) => import("react").JSX.Element;
export declare const TableCell: import("@basekit/core").DeclarativeComponent<TableCellProps>;
export declare const TableCaptionView: ({ className, children }: TableSectionProps) => import("react").JSX.Element;
export declare const TableCaption: import("@basekit/core").DeclarativeComponent<TableSectionProps>;
//# sourceMappingURL=Table.d.ts.map
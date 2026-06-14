import {
  createContext,
  useContext,
  type ReactNode,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from "react";
import { cn, createComponent } from "@basekit/core";

/**
 * `Table` is the presentational table for free-form, hand-authored content.
 * For data-driven tables (rows + column definitions, loading/empty states,
 * selection) use `DataTable` instead.
 */

type TableContextValue = {
  striped?: boolean;
  compact?: boolean;
  bordered?: boolean;
};

const TableContext = createContext<TableContextValue>({});

export type TableProps = {
  id?: string;
  className?: string;
  children?: ReactNode;
  striped?: boolean;
  compact?: boolean;
  bordered?: boolean;
};

export const TableView = ({
  id,
  className,
  children,
  striped,
  compact,
  bordered,
}: TableProps) => (
  <TableContext.Provider value={{ striped, compact, bordered }}>
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-border bg-surface",
        className,
      )}
    >
      <table id={id} className="w-full border-collapse text-bk-sm">
        {children}
      </table>
    </div>
  </TableContext.Provider>
);

export const Table = createComponent<TableProps>("Table");

/* Sub-components ------------------------------------------------------- */

export type TableSectionProps = { className?: string; children?: ReactNode };

export const TableHeaderView = ({ className, children }: TableSectionProps) => (
  <thead
    className={cn(
      "border-b border-border bg-surface-muted text-left text-muted-foreground",
      className,
    )}
  >
    {children}
  </thead>
);
export const TableHeader = createComponent<TableSectionProps>("TableHeader");

export const TableBodyView = ({ className, children }: TableSectionProps) => {
  const { striped } = useContext(TableContext);
  return (
    <tbody
      className={cn(
        "divide-y divide-border",
        striped && "[&>tr:nth-child(even)]:bg-surface-muted/50",
        className,
      )}
    >
      {children}
    </tbody>
  );
};
export const TableBody = createComponent<TableSectionProps>("TableBody");

export type TableRowProps = {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
};

export const TableRowView = ({ className, children, onClick }: TableRowProps) => {
  const { bordered } = useContext(TableContext);
  return (
    <tr
      onClick={onClick}
      className={cn(
        bordered && "[&>td]:border [&>th]:border [&>td]:border-border [&>th]:border-border",
        onClick && "cursor-pointer transition-colors hover:bg-surface-muted",
        className,
      )}
    >
      {children}
    </tr>
  );
};
export const TableRow = createComponent<TableRowProps>("TableRow");

export type TableCellProps = {
  className?: string;
  children?: ReactNode;
  align?: "left" | "center" | "right";
  colSpan?: number;
  scope?: ThHTMLAttributes<HTMLTableCellElement>["scope"];
};

const alignClass = { left: "text-left", center: "text-center", right: "text-right" };

const useCellPadding = () => (useContext(TableContext).compact ? "px-3 py-2" : "px-4 py-3");

export const TableHeadView = ({
  className,
  children,
  align = "left",
  colSpan,
  scope = "col",
}: TableCellProps) => {
  const pad = useCellPadding();
  return (
    <th
      scope={scope}
      colSpan={colSpan}
      className={cn(pad, "font-medium", alignClass[align], className)}
    >
      {children}
    </th>
  );
};
export const TableHead = createComponent<TableCellProps>("TableHead");

export const TableCellView = ({
  className,
  children,
  align = "left",
  colSpan,
}: Omit<TableCellProps, "scope"> & {
  scope?: TdHTMLAttributes<HTMLTableCellElement>["scope"];
}) => {
  const pad = useCellPadding();
  return (
    <td
      colSpan={colSpan}
      className={cn(pad, "text-foreground", alignClass[align], className)}
    >
      {children}
    </td>
  );
};
export const TableCell = createComponent<TableCellProps>("TableCell");

export const TableCaptionView = ({ className, children }: TableSectionProps) => (
  <caption className={cn("px-4 py-2 text-left text-bk-sm text-muted-foreground", className)}>
    {children}
  </caption>
);
export const TableCaption = createComponent<TableSectionProps>("TableCaption");

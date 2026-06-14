import { useMemo, useState, type Key, type ReactNode } from "react";
import { cn, isUINode, renderNode, type UINode } from "@basekit/core";
import { defaultRegistry } from "../registry";
import { EmptyStateView } from "../feedback/Alert";
import { SkeletonView } from "../feedback/Status";

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

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const resolveKey = <T extends object>(
  row: T,
  index: number,
  rowKey?: DataTableProps<T>["rowKey"],
): Key => {
  if (typeof rowKey === "function") return rowKey(row, index);
  if (rowKey) return row[rowKey] as unknown as Key;
  return index;
};

const renderCell = <T extends object>(
  column: DataTableColumn<T>,
  row: T,
  index: number,
): ReactNode => {
  if (column.cell) {
    const result = column.cell(row, index);
    return isUINode(result)
      ? renderNode(result, defaultRegistry)
      : (result as ReactNode);
  }
  if (typeof column.accessor === "function") return column.accessor(row);
  if (column.accessor) {
    const value = row[column.accessor];
    return value == null ? "" : String(value);
  }
  return null;
};

export function DataTableView<T extends object>({
  rows,
  columns,
  rowKey,
  loading,
  emptyText = "Aucune donnée",
  striped,
  hoverable,
  compact,
  footer,
  onRowClick,
  selectable,
  selectedRows,
  onSelectionChange,
  className,
}: DataTableProps<T>) {
  const [internalSelection, setInternalSelection] = useState<Key[]>([]);
  const selection = selectedRows ?? internalSelection;

  const setSelection = (next: Key[]) => {
    setInternalSelection(next);
    onSelectionChange?.(next);
  };

  const allKeys = useMemo(
    () => rows.map((row, index) => resolveKey(row, index, rowKey)),
    [rows, rowKey],
  );
  const allSelected = selection.length > 0 && selection.length === rows.length;

  const cellPad = compact ? "px-3 py-2" : "px-4 py-3";
  const hasFooter = footer != null || columns.some((c) => c.footer != null);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-bk-sm">
          <thead className="border-b border-border bg-surface-muted text-muted-foreground">
            <tr>
              {selectable && (
                <th className={cn(cellPad, "w-10")}>
                  <input
                    type="checkbox"
                    aria-label="Tout sélectionner"
                    checked={allSelected}
                    onChange={(e) =>
                      setSelection(e.target.checked ? allKeys : [])
                    }
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  style={{ width: column.width }}
                  className={cn(
                    cellPad,
                    "font-medium",
                    alignClass[column.align ?? "left"],
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 4 }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  {selectable && <td className={cellPad} />}
                  {columns.map((column) => (
                    <td key={column.id} className={cellPad}>
                      <SkeletonView height="0.9rem" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="p-0"
                >
                  <EmptyStateView
                    title={emptyText}
                    className="rounded-none border-0"
                  />
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const key = resolveKey(row, index, rowKey);
                const isSelected = selection.includes(key);
                return (
                  <tr
                    key={key}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      striped && index % 2 === 1 && "bg-surface-muted/50",
                      isSelected && "bg-primary-soft",
                      (hoverable || onRowClick) &&
                        "cursor-pointer transition-colors hover:bg-surface-muted",
                    )}
                  >
                    {selectable && (
                      <td
                        className={cellPad}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          aria-label="Sélectionner la ligne"
                          checked={isSelected}
                          onChange={(e) =>
                            setSelection(
                              e.target.checked
                                ? [...selection, key]
                                : selection.filter((k) => k !== key),
                            )
                          }
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          cellPad,
                          "text-foreground",
                          alignClass[column.align ?? "left"],
                        )}
                      >
                        {renderCell(column, row, index)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
          {hasFooter && !loading && rows.length > 0 && (
            <tfoot className="border-t border-border bg-surface-muted font-medium text-foreground">
              <tr>
                {selectable && <td className={cellPad} />}
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(cellPad, alignClass[column.align ?? "left"])}
                  >
                    {column.footer}
                  </td>
                ))}
              </tr>
              {footer != null && (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className={cellPad}
                  >
                    {footer}
                  </td>
                </tr>
              )}
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

/** Typed column helper for inline definitions. */
export const Column = <T extends object>(
  column: DataTableColumn<T>,
): DataTableColumn<T> => column;

/**
 * Declarative DataTable factory. Produces a `UINode` whose props carry the
 * (generic) rows/columns; the registry renders it with `DataTableView`.
 */
export const DataTable = <T extends object>(
  props: DataTableProps<T>,
): UINode => ({
  $$basekit: "node",
  component: "DataTable",
  props: props as unknown as Record<string, unknown>,
  children: [],
});

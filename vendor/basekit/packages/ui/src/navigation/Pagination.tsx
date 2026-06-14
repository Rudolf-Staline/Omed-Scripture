import { useState } from "react";
import { cn, createComponent } from "@basekit/core";
import { focusRing } from "../internal";

export type PaginationProps = {
  id?: string;
  className?: string;
  page?: number;
  defaultPage?: number;
  totalPages: number;
  /** Pages shown on each side of the current page. */
  siblingCount?: number;
  /** Pages always shown at the start and end. */
  boundaryCount?: number;
  disabled?: boolean;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  testId?: string;
  "aria-label"?: string;
  onPageChange?: (page: number) => void;
};

const ELLIPSIS = "ellipsis" as const;
type PageEntry = number | typeof ELLIPSIS;

const range = (start: number, end: number): number[] =>
  Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);

/** Builds the page list with ellipses, e.g. [1, "ellipsis", 4, 5, 6, "ellipsis", 20]. */
const buildPages = (
  current: number,
  total: number,
  siblingCount: number,
  boundaryCount: number,
): PageEntry[] => {
  // Slots: both boundaries, both ellipses, current + siblings on each side.
  const totalSlots = boundaryCount * 2 + siblingCount * 2 + 3;
  if (total <= totalSlots) return range(1, total);

  const leftSibling = Math.max(current - siblingCount, boundaryCount + 1);
  const rightSibling = Math.min(current + siblingCount, total - boundaryCount);
  const showLeftEllipsis = leftSibling > boundaryCount + 2;
  const showRightEllipsis = rightSibling < total - boundaryCount - 1;

  const pages: PageEntry[] = [...range(1, boundaryCount)];
  if (showLeftEllipsis) pages.push(ELLIPSIS);
  else pages.push(...range(boundaryCount + 1, leftSibling - 1));

  pages.push(...range(leftSibling, rightSibling));

  if (showRightEllipsis) pages.push(ELLIPSIS);
  else pages.push(...range(rightSibling + 1, total - boundaryCount));
  pages.push(...range(total - boundaryCount + 1, total));

  return pages;
};

const itemBase = cn(
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-2 text-bk-sm font-medium transition-colors",
  "disabled:pointer-events-none disabled:opacity-50",
  focusRing,
);

export const PaginationView = ({
  id,
  className,
  page,
  defaultPage = 1,
  totalPages,
  siblingCount = 1,
  boundaryCount = 1,
  disabled,
  showFirstLast = false,
  showPrevNext = true,
  testId,
  onPageChange,
  ...rest
}: PaginationProps) => {
  const [internal, setInternal] = useState(defaultPage);
  const current = Math.min(Math.max(page ?? internal, 1), Math.max(totalPages, 1));

  const goTo = (next: number) => {
    const clamped = Math.min(Math.max(next, 1), totalPages);
    if (clamped === current) return;
    setInternal(clamped);
    onPageChange?.(clamped);
  };

  const pages = buildPages(current, totalPages, siblingCount, boundaryCount);
  const atStart = current <= 1;
  const atEnd = current >= totalPages;

  return (
    <nav
      id={id}
      aria-label={rest["aria-label"] ?? "Pagination"}
      data-testid={testId}
      className={cn("flex items-center gap-1", className)}
    >
      {showFirstLast && (
        <button
          type="button"
          className={cn(itemBase, "text-foreground hover:bg-surface-muted")}
          disabled={disabled || atStart}
          aria-label="Première page"
          onClick={() => goTo(1)}
        >
          «
        </button>
      )}
      {showPrevNext && (
        <button
          type="button"
          className={cn(itemBase, "text-foreground hover:bg-surface-muted")}
          disabled={disabled || atStart}
          aria-label="Page précédente"
          onClick={() => goTo(current - 1)}
        >
          ‹
        </button>
      )}
      {pages.map((entry, index) =>
        entry === ELLIPSIS ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden
            className="inline-flex h-9 min-w-9 items-center justify-center px-1 text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            disabled={disabled}
            aria-current={entry === current ? "page" : undefined}
            aria-label={`Page ${entry}`}
            className={cn(
              itemBase,
              entry === current
                ? "border-primary bg-primary text-primary-foreground"
                : "text-foreground hover:bg-surface-muted",
            )}
            onClick={() => goTo(entry)}
          >
            {entry}
          </button>
        ),
      )}
      {showPrevNext && (
        <button
          type="button"
          className={cn(itemBase, "text-foreground hover:bg-surface-muted")}
          disabled={disabled || atEnd}
          aria-label="Page suivante"
          onClick={() => goTo(current + 1)}
        >
          ›
        </button>
      )}
      {showFirstLast && (
        <button
          type="button"
          className={cn(itemBase, "text-foreground hover:bg-surface-muted")}
          disabled={disabled || atEnd}
          aria-label="Dernière page"
          onClick={() => goTo(totalPages)}
        >
          »
        </button>
      )}
    </nav>
  );
};

export const Pagination = createComponent<PaginationProps>("Pagination");

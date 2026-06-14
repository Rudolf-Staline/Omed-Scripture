import { Fragment, type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";
import { focusRing } from "../internal";

export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
  /** Marks the current page (rendered as plain text with aria-current). */
  current?: boolean;
};

export type BreadcrumbProps = {
  id?: string;
  className?: string;
  items: BreadcrumbItem[];
  /** Separator between items (default "/"). */
  separator?: ReactNode;
  testId?: string;
  "aria-label"?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
};

export const BreadcrumbView = ({
  id,
  className,
  items,
  separator = "/",
  testId,
  onItemClick,
  ...rest
}: BreadcrumbProps) => (
  <nav
    id={id}
    aria-label={rest["aria-label"] ?? "Fil d'Ariane"}
    data-testid={testId}
    className={className}
  >
    <ol className="flex flex-wrap items-center gap-1.5 text-bk-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCurrent = item.current ?? isLast;
        return (
          <Fragment key={index}>
            <li className="inline-flex items-center">
              {isCurrent ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className={cn(
                    "rounded-sm text-muted-foreground transition-colors hover:text-foreground hover:underline",
                    focusRing,
                  )}
                  onClick={() => onItemClick?.(item, index)}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  type="button"
                  className={cn(
                    "rounded-sm text-muted-foreground transition-colors hover:text-foreground",
                    focusRing,
                  )}
                  onClick={() => onItemClick?.(item, index)}
                >
                  {item.label}
                </button>
              )}
            </li>
            {!isLast && (
              <li aria-hidden className="select-none text-muted-foreground">
                {separator}
              </li>
            )}
          </Fragment>
        );
      })}
    </ol>
  </nav>
);

export const Breadcrumb = createComponent<BreadcrumbProps>("Breadcrumb");

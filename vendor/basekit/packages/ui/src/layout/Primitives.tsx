import { type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";
import type { Align, Justify, Size } from "@basekit/tokens";
import { gapStyles, paddingStyles } from "../internal";

const alignClass: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyClass: Record<Justify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

/* Stack — vertical flex ------------------------------------------------ */

export type StackProps = {
  children?: ReactNode;
  gap?: Size;
  align?: Align;
  justify?: Justify;
  padding?: Size;
  className?: string;
  id?: string;
  hidden?: boolean;
  testId?: string;
};

export const StackView = ({
  children,
  gap = "md",
  align = "stretch",
  justify = "start",
  padding,
  className,
  id,
  hidden,
  testId,
}: StackProps) =>
  hidden ? null : (
    <div
      id={id}
      data-testid={testId}
      className={cn(
        "flex flex-col",
        gapStyles[gap],
        alignClass[align],
        justifyClass[justify],
        padding && paddingStyles[padding],
        className,
      )}
    >
      {children}
    </div>
  );

export const Stack = createComponent<StackProps>("Stack");

/* Inline — horizontal flex with wrap ----------------------------------- */

export type InlineProps = StackProps & { wrap?: boolean };

export const InlineView = ({
  children,
  gap = "md",
  align = "center",
  justify = "start",
  padding,
  wrap,
  className,
  id,
  hidden,
  testId,
}: InlineProps) =>
  hidden ? null : (
    <div
      id={id}
      data-testid={testId}
      className={cn(
        "flex flex-row",
        wrap && "flex-wrap",
        gapStyles[gap],
        alignClass[align],
        justifyClass[justify],
        padding && paddingStyles[padding],
        className,
      )}
    >
      {children}
    </div>
  );

export const Inline = createComponent<InlineProps>("Inline");

/* Grid ----------------------------------------------------------------- */

export type GridProps = {
  children?: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: Size;
  /** Min column width for an auto-fit responsive grid (overrides `columns`). */
  minItemWidth?: string;
  className?: string;
  id?: string;
  hidden?: boolean;
};

const columnClass: Record<NonNullable<GridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-12",
};

export const GridView = ({
  children,
  columns = 2,
  gap = "md",
  minItemWidth,
  className,
  id,
  hidden,
}: GridProps) =>
  hidden ? null : (
    <div
      id={id}
      className={cn(
        "grid",
        gapStyles[gap],
        !minItemWidth && columnClass[columns],
        className,
      )}
      style={
        minItemWidth
          ? {
              gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );

export const Grid = createComponent<GridProps>("Grid");

/* Container ------------------------------------------------------------ */

export type ContainerProps = {
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  id?: string;
};

const containerSize = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

export const ContainerView = ({
  children,
  size = "lg",
  className,
  id,
}: ContainerProps) => (
  <div
    id={id}
    className={cn(
      "mx-auto w-full px-4 sm:px-6",
      containerSize[size],
      className,
    )}
  >
    {children}
  </div>
);

export const Container = createComponent<ContainerProps>("Container");

/* Section -------------------------------------------------------------- */

export type SectionProps = {
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  id?: string;
};

export const SectionView = ({
  children,
  title,
  description,
  actions,
  className,
  id,
}: SectionProps) => (
  <section id={id} className={cn("space-y-4", className)}>
    {(title != null || actions != null) && (
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          {title != null && (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          )}
          {description != null && (
            <p className="text-bk-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions != null && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
      </div>
    )}
    {children}
  </section>
);

export const Section = createComponent<SectionProps>("Section");

/* ScrollArea ----------------------------------------------------------- */

export type ScrollAreaProps = {
  children?: ReactNode;
  maxHeight?: string | number;
  className?: string;
};

export const ScrollAreaView = ({
  children,
  maxHeight = "100%",
  className,
}: ScrollAreaProps) => (
  <div className={cn("overflow-auto", className)} style={{ maxHeight }}>
    {children}
  </div>
);

export const ScrollArea = createComponent<ScrollAreaProps>("ScrollArea");

/* SplitPane ------------------------------------------------------------ */

export type SplitPaneProps = {
  primary?: ReactNode;
  secondary?: ReactNode;
  /** Width of the secondary pane (e.g. "20rem"). */
  secondaryWidth?: string;
  side?: "left" | "right";
  gap?: Size;
  className?: string;
};

export const SplitPaneView = ({
  primary,
  secondary,
  secondaryWidth = "20rem",
  side = "right",
  gap = "lg",
  className,
}: SplitPaneProps) => (
  <div
    className={cn("grid", gapStyles[gap], className)}
    style={{
      gridTemplateColumns:
        side === "right" ? `1fr ${secondaryWidth}` : `${secondaryWidth} 1fr`,
    }}
  >
    {side === "left" && <aside>{secondary}</aside>}
    <div className="min-w-0">{primary}</div>
    {side === "right" && <aside>{secondary}</aside>}
  </div>
);

export const SplitPane = createComponent<SplitPaneProps>("SplitPane");

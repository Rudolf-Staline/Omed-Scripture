import { type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";
import type { Tone } from "@basekit/tokens";
import {
  Icon,
  renderIcon,
  solidDotStyles,
  textToneStyles,
  type IconSlot,
} from "../internal";
import { CardView } from "../composition/Card";

/* MetricCard ----------------------------------------------------------- */

export type MetricCardProps = {
  label: ReactNode;
  value: ReactNode;
  tone?: Tone;
  icon?: IconSlot;
  /** Trend delta, e.g. "+12.4%". */
  delta?: ReactNode;
  trend?: "up" | "down" | "flat";
  helpText?: ReactNode;
  className?: string;
};

export const MetricCardView = ({
  label,
  value,
  tone = "neutral",
  icon,
  delta,
  trend,
  helpText,
  className,
}: MetricCardProps) => (
  <CardView className={cn("p-5", className)}>
    <div className="flex items-start justify-between gap-3">
      <p className="text-bk-sm font-medium text-muted-foreground">{label}</p>
      {icon != null && (
        <span className={cn("shrink-0", textToneStyles[tone])}>
          {renderIcon(icon, 18)}
        </span>
      )}
    </div>
    <p
      className={cn(
        "mt-2 text-3xl font-bold tracking-tight",
        textToneStyles[tone],
      )}
    >
      {value}
    </p>
    {(delta != null || helpText != null) && (
      <div className="mt-1 flex items-center gap-2 text-bk-sm">
        {delta != null && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              trend === "up" && "text-success",
              trend === "down" && "text-danger",
              trend === "flat" && "text-muted-foreground",
            )}
          >
            {trend === "up" && (
              <Icon name="arrow-right" size={14} className="-rotate-45" />
            )}
            {trend === "down" && (
              <Icon name="arrow-right" size={14} className="rotate-45" />
            )}
            {delta}
          </span>
        )}
        {helpText != null && (
          <span className="text-muted-foreground">{helpText}</span>
        )}
      </div>
    )}
  </CardView>
);

export const MetricCard = createComponent<MetricCardProps>("MetricCard");

/* StatBlock — compact label/value without a card ----------------------- */

export type StatBlockProps = {
  label: ReactNode;
  value: ReactNode;
  tone?: Tone;
  className?: string;
};

export const StatBlockView = ({
  label,
  value,
  tone = "neutral",
  className,
}: StatBlockProps) => (
  <div className={cn("space-y-0.5", className)}>
    <p className="text-bk-xs uppercase tracking-wide text-muted-foreground">
      {label}
    </p>
    <p className={cn("text-xl font-semibold", textToneStyles[tone])}>{value}</p>
  </div>
);

export const StatBlock = createComponent<StatBlockProps>("StatBlock");

/* List ----------------------------------------------------------------- */

export type ListItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: IconSlot;
  trailing?: ReactNode;
  onClick?: () => void;
};

export type ListProps = { items: ListItem[]; className?: string };

export const ListView = ({ items, className }: ListProps) => (
  <ul
    className={cn(
      "divide-y divide-border rounded-lg border border-border bg-surface",
      className,
    )}
  >
    {items.map((item) => {
      const inner = (
        <>
          {item.icon != null && (
            <span className="shrink-0 text-muted-foreground">
              {renderIcon(item.icon)}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium text-foreground">
              {item.title}
            </span>
            {item.description != null && (
              <span className="block truncate text-bk-sm text-muted-foreground">
                {item.description}
              </span>
            )}
          </span>
          {item.trailing != null && (
            <span className="shrink-0">{item.trailing}</span>
          )}
        </>
      );
      return (
        <li key={item.id}>
          {item.onClick ? (
            <button
              type="button"
              onClick={item.onClick}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {inner}
            </button>
          ) : (
            <div className="flex items-center gap-3 p-4">{inner}</div>
          )}
        </li>
      );
    })}
  </ul>
);

export const List = createComponent<ListProps>("List");

/* DescriptionList ------------------------------------------------------ */

export type DescriptionItem = { term: ReactNode; description: ReactNode };
export type DescriptionListProps = {
  items: DescriptionItem[];
  columns?: 1 | 2;
  className?: string;
};

export const DescriptionListView = ({
  items,
  columns = 1,
  className,
}: DescriptionListProps) => (
  <dl
    className={cn(
      "grid gap-x-6 gap-y-4",
      columns === 2 && "sm:grid-cols-2",
      className,
    )}
  >
    {items.map((item, i) => (
      <div key={i} className="space-y-0.5">
        <dt className="text-bk-sm text-muted-foreground">{item.term}</dt>
        <dd className="font-medium text-foreground">{item.description}</dd>
      </div>
    ))}
  </dl>
);

export const DescriptionList =
  createComponent<DescriptionListProps>("DescriptionList");

/* Timeline ------------------------------------------------------------- */

export type TimelineItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  tone?: Tone;
};

export type TimelineProps = { items: TimelineItem[]; className?: string };

export const TimelineView = ({ items, className }: TimelineProps) => (
  <ol
    className={cn("relative space-y-6 border-l border-border pl-6", className)}
  >
    {items.map((item) => (
      <li key={item.id} className="relative">
        <span
          className={cn(
            "absolute -left-[1.6875rem] top-1 h-3 w-3 rounded-full ring-4 ring-surface",
            solidDotStyles[item.tone ?? "primary"],
          )}
          aria-hidden
        />
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-medium text-foreground">{item.title}</p>
          {item.timestamp != null && (
            <span className="shrink-0 text-bk-xs text-muted-foreground">
              {item.timestamp}
            </span>
          )}
        </div>
        {item.description != null && (
          <p className="mt-0.5 text-bk-sm text-muted-foreground">
            {item.description}
          </p>
        )}
      </li>
    ))}
  </ol>
);

export const Timeline = createComponent<TimelineProps>("Timeline");

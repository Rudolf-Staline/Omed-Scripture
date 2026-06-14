import { type ReactNode } from "react";
import type { Tone } from "@basekit/tokens";
import { type IconSlot } from "../internal";
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
export declare const MetricCardView: ({ label, value, tone, icon, delta, trend, helpText, className, }: MetricCardProps) => import("react").JSX.Element;
export declare const MetricCard: import("@basekit/core").DeclarativeComponent<MetricCardProps>;
export type StatBlockProps = {
    label: ReactNode;
    value: ReactNode;
    tone?: Tone;
    className?: string;
};
export declare const StatBlockView: ({ label, value, tone, className, }: StatBlockProps) => import("react").JSX.Element;
export declare const StatBlock: import("@basekit/core").DeclarativeComponent<StatBlockProps>;
export type ListItem = {
    id: string;
    title: ReactNode;
    description?: ReactNode;
    icon?: IconSlot;
    trailing?: ReactNode;
    onClick?: () => void;
};
export type ListProps = {
    items: ListItem[];
    className?: string;
};
export declare const ListView: ({ items, className }: ListProps) => import("react").JSX.Element;
export declare const List: import("@basekit/core").DeclarativeComponent<ListProps>;
export type DescriptionItem = {
    term: ReactNode;
    description: ReactNode;
};
export type DescriptionListProps = {
    items: DescriptionItem[];
    columns?: 1 | 2;
    className?: string;
};
export declare const DescriptionListView: ({ items, columns, className, }: DescriptionListProps) => import("react").JSX.Element;
export declare const DescriptionList: import("@basekit/core").DeclarativeComponent<DescriptionListProps>;
export type TimelineItem = {
    id: string;
    title: ReactNode;
    description?: ReactNode;
    timestamp?: ReactNode;
    tone?: Tone;
};
export type TimelineProps = {
    items: TimelineItem[];
    className?: string;
};
export declare const TimelineView: ({ items, className }: TimelineProps) => import("react").JSX.Element;
export declare const Timeline: import("@basekit/core").DeclarativeComponent<TimelineProps>;
//# sourceMappingURL=Display.d.ts.map
import { type ReactNode } from "react";
import type { Align, Justify, Size } from "@basekit/tokens";
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
export declare const StackView: ({ children, gap, align, justify, padding, className, id, hidden, testId, }: StackProps) => import("react").JSX.Element | null;
export declare const Stack: import("@basekit/core").DeclarativeComponent<StackProps>;
export type InlineProps = StackProps & {
    wrap?: boolean;
};
export declare const InlineView: ({ children, gap, align, justify, padding, wrap, className, id, hidden, testId, }: InlineProps) => import("react").JSX.Element | null;
export declare const Inline: import("@basekit/core").DeclarativeComponent<InlineProps>;
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
export declare const GridView: ({ children, columns, gap, minItemWidth, className, id, hidden, }: GridProps) => import("react").JSX.Element | null;
export declare const Grid: import("@basekit/core").DeclarativeComponent<GridProps>;
export type ContainerProps = {
    children?: ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    className?: string;
    id?: string;
};
export declare const ContainerView: ({ children, size, className, id, }: ContainerProps) => import("react").JSX.Element;
export declare const Container: import("@basekit/core").DeclarativeComponent<ContainerProps>;
export type SectionProps = {
    children?: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    className?: string;
    id?: string;
};
export declare const SectionView: ({ children, title, description, actions, className, id, }: SectionProps) => import("react").JSX.Element;
export declare const Section: import("@basekit/core").DeclarativeComponent<SectionProps>;
export type ScrollAreaProps = {
    children?: ReactNode;
    maxHeight?: string | number;
    className?: string;
};
export declare const ScrollAreaView: ({ children, maxHeight, className, }: ScrollAreaProps) => import("react").JSX.Element;
export declare const ScrollArea: import("@basekit/core").DeclarativeComponent<ScrollAreaProps>;
export type SplitPaneProps = {
    primary?: ReactNode;
    secondary?: ReactNode;
    /** Width of the secondary pane (e.g. "20rem"). */
    secondaryWidth?: string;
    side?: "left" | "right";
    gap?: Size;
    className?: string;
};
export declare const SplitPaneView: ({ primary, secondary, secondaryWidth, side, gap, className, }: SplitPaneProps) => import("react").JSX.Element;
export declare const SplitPane: import("@basekit/core").DeclarativeComponent<SplitPaneProps>;
//# sourceMappingURL=Primitives.d.ts.map
import type { Tone } from "@basekit/tokens";
export type SkeletonProps = {
    width?: string | number;
    height?: string | number;
    radius?: "sm" | "md" | "lg" | "full";
    className?: string;
    /** Render N stacked lines. */
    lines?: number;
};
export declare const SkeletonView: ({ width, height, radius, className, lines, }: SkeletonProps) => import("react").JSX.Element;
export declare const Skeleton: import("@basekit/core").DeclarativeComponent<SkeletonProps>;
export type ProgressProps = {
    value: number;
    max?: number;
    tone?: Tone;
    label?: string;
    showValue?: boolean;
    className?: string;
};
export declare const ProgressView: ({ value, max, tone, label, showValue, className, }: ProgressProps) => import("react").JSX.Element;
export declare const Progress: import("@basekit/core").DeclarativeComponent<ProgressProps>;
//# sourceMappingURL=Status.d.ts.map
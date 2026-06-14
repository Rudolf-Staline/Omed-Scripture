import { type ReactNode } from "react";
export type TooltipPlacement = "top" | "right" | "bottom" | "left";
export type TooltipProps = {
    id?: string;
    className?: string;
    content: ReactNode;
    children: ReactNode;
    placement?: TooltipPlacement;
    /** Delay before showing on hover, in milliseconds. */
    delayMs?: number;
    disabled?: boolean;
};
/**
 * Lightweight, CSS-positioned tooltip. Reveals on hover and keyboard focus and
 * wires `aria-describedby` so assistive tech announces the content. It does not
 * include a collision-aware positioning engine — `placement` is static.
 */
export declare const TooltipView: ({ id, className, content, children, placement, delayMs, disabled, }: TooltipProps) => import("react").JSX.Element;
export declare const Tooltip: import("@basekit/core").DeclarativeComponent<TooltipProps>;
//# sourceMappingURL=Tooltip.d.ts.map
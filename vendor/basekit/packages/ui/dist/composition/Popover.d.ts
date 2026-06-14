import { type ReactNode } from "react";
export type PopoverPlacement = "top" | "right" | "bottom" | "left";
export type PopoverProps = {
    id?: string;
    className?: string;
    trigger: ReactNode;
    children?: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    placement?: PopoverPlacement;
    title?: ReactNode;
    /** Close when clicking or focusing outside the popover (default true). */
    closeOnInteractOutside?: boolean;
    /** Show a close button in the header (requires `title`). */
    showClose?: boolean;
    onOpenChange?: (open: boolean) => void;
};
/**
 * Simple popover: a trigger and a floating panel. Open state is controlled or
 * uncontrolled, it closes on outside click and `Escape`, and exposes the panel
 * as a labelled `dialog`. Positioning is static (no collision engine).
 */
export declare const PopoverView: ({ id, className, trigger, children, open, defaultOpen, placement, title, closeOnInteractOutside, showClose, onOpenChange, }: PopoverProps) => import("react").JSX.Element;
export declare const Popover: import("@basekit/core").DeclarativeComponent<PopoverProps>;
//# sourceMappingURL=Popover.d.ts.map
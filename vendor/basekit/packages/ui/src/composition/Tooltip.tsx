import { useId, useRef, useState, type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";

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

const placementStyles: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

/**
 * Lightweight, CSS-positioned tooltip. Reveals on hover and keyboard focus and
 * wires `aria-describedby` so assistive tech announces the content. It does not
 * include a collision-aware positioning engine — `placement` is static.
 */
export const TooltipView = ({
  id,
  className,
  content,
  children,
  placement = "top",
  delayMs = 0,
  disabled,
}: TooltipProps) => {
  const generatedId = useId();
  const tooltipId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };
  const show = () => {
    if (disabled) return;
    clear();
    if (delayMs > 0) timer.current = setTimeout(() => setOpen(true), delayMs);
    else setOpen(true);
  };
  const hide = () => {
    clear();
    setOpen(false);
  };

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span aria-describedby={open ? tooltipId : undefined}>{children}</span>
      {open && !disabled && (
        <span
          role="tooltip"
          id={tooltipId}
          className={cn(
            "absolute z-tooltip w-max max-w-xs rounded-md bg-foreground px-2 py-1 text-bk-xs font-medium text-background shadow-soft",
            placementStyles[placement],
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
};

export const Tooltip = createComponent<TooltipProps>("Tooltip");

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn, createComponent } from "@basekit/core";
import { IconButtonView } from "../primitives/Button";

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

const placementStyles: Record<PopoverPlacement, string> = {
  top: "bottom-full left-0 mb-2",
  bottom: "top-full left-0 mt-2",
  left: "right-full top-0 mr-2",
  right: "left-full top-0 ml-2",
};

/**
 * Simple popover: a trigger and a floating panel. Open state is controlled or
 * uncontrolled, it closes on outside click and `Escape`, and exposes the panel
 * as a labelled `dialog`. Positioning is static (no collision engine).
 */
export const PopoverView = ({
  id,
  className,
  trigger,
  children,
  open,
  defaultOpen = false,
  placement = "bottom",
  title,
  closeOnInteractOutside = true,
  showClose = true,
  onOpenChange,
}: PopoverProps) => {
  const generatedId = useId();
  const panelId = id ?? generatedId;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;
  const ref = useRef<HTMLDivElement>(null);

  const setOpen = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (
        closeOnInteractOutside &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      )
        setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, closeOnInteractOutside]);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <span
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => setOpen(!isOpen)}
      >
        {trigger}
      </span>
      {isOpen && (
        <div
          id={panelId}
          role="dialog"
          aria-label={typeof title === "string" ? title : undefined}
          className={cn(
            "absolute z-popover min-w-[14rem] rounded-lg border border-border bg-surface-raised p-3 shadow-soft",
            placementStyles[placement],
          )}
        >
          {(title != null || showClose) && (
            <div className="mb-2 flex items-start justify-between gap-4">
              {title != null && (
                <p className="text-bk-sm font-semibold text-foreground">
                  {title}
                </p>
              )}
              {showClose && (
                <IconButtonView
                  icon="close"
                  aria-label="Fermer"
                  size="xs"
                  onClick={() => setOpen(false)}
                />
              )}
            </div>
          )}
          <div className="text-bk-sm text-foreground">{children}</div>
        </div>
      )}
    </div>
  );
};

export const Popover = createComponent<PopoverProps>("Popover");

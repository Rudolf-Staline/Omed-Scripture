import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn, createComponent } from "@basekit/core";
import { IconButtonView } from "../primitives/Button";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** Close when clicking the backdrop (default true). */
  dismissable?: boolean;
  className?: string;
};

const sizeClass = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export const ModalView = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  dismissable = true,
  className,
}: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={dismissable ? onClose : undefined}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        tabIndex={-1}
        className={cn(
          "relative w-full rounded-xl border border-border bg-surface shadow-strong outline-none",
          sizeClass[size],
          className,
        )}
      >
        {(title != null || description != null) && (
          <div className="flex items-start justify-between gap-4 border-b border-border p-5">
            <div className="space-y-1">
              {title != null && (
                <h2 className="text-lg font-semibold text-foreground">
                  {title}
                </h2>
              )}
              {description != null && (
                <p className="text-bk-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            <IconButtonView
              icon="close"
              aria-label="Fermer"
              onClick={onClose}
              size="sm"
            />
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer != null && (
          <div className="flex items-center justify-end gap-2 border-t border-border p-5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export const Modal = createComponent<ModalProps>("Modal");

/* Drawer — side sheet, shares the overlay mechanics ------------------- */

export type DrawerProps = Omit<ModalProps, "size"> & {
  side?: "left" | "right";
  width?: string;
};

export const DrawerView = ({
  open,
  onClose,
  title,
  children,
  footer,
  side = "right",
  width = "22rem",
  dismissable = true,
  className,
}: DrawerProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-drawer">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={dismissable ? onClose : undefined}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute inset-y-0 flex w-full flex-col border-border bg-surface shadow-strong",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          className,
        )}
        style={{ maxWidth: width }}
      >
        {title != null && (
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <IconButtonView
              icon="close"
              aria-label="Fermer"
              onClick={onClose}
              size="sm"
            />
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer != null && (
          <div className="border-t border-border p-5">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export const Drawer = createComponent<DrawerProps>("Drawer");

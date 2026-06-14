import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";
import { Icon, renderIcon, type IconSlot } from "../internal";

/* Tabs ----------------------------------------------------------------- */

export type TabItem = {
  id: string;
  label: ReactNode;
  icon?: IconSlot;
  content: ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
};

export const TabsView = ({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
}: TabsProps) => {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
  const active = value ?? internal;
  const select = (id: string) => {
    setInternal(id);
    onValueChange?.(id);
  };
  const activeItem = items.find((item) => item.id === active);
  return (
    <div className={cn("space-y-4", className)}>
      <div role="tablist" className="flex gap-1 border-b border-border">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              disabled={item.disabled}
              onClick={() => select(item.id)}
              className={cn(
                "inline-flex items-center gap-2 border-b-2 px-3 py-2 text-bk-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring -mb-px",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
                item.disabled && "cursor-not-allowed opacity-50",
              )}
            >
              {renderIcon(item.icon)}
              {item.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">{activeItem?.content}</div>
    </div>
  );
};

export const Tabs = createComponent<TabsProps>("Tabs");

/* Accordion ------------------------------------------------------------ */

export type AccordionItem = {
  id: string;
  title: ReactNode;
  content: ReactNode;
};

export type AccordionProps = {
  items: AccordionItem[];
  /** Allow multiple open panels. */
  multiple?: boolean;
  defaultOpen?: string[];
  className?: string;
};

export const AccordionView = ({
  items,
  multiple,
  defaultOpen = [],
  className,
}: AccordionProps) => {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const toggle = (id: string) =>
    setOpen((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : multiple
          ? [...prev, id]
          : [id],
    );
  return (
    <div
      className={cn(
        "divide-y divide-border rounded-lg border border-border",
        className,
      )}
    >
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left text-bk-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.title}
              <Icon
                name="chevron-down"
                className={cn(
                  "shrink-0 text-muted-foreground transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-bk-sm text-muted-foreground">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const Accordion = createComponent<AccordionProps>("Accordion");

/* Dropdown ------------------------------------------------------------- */

export type DropdownItem = {
  id: string;
  label: ReactNode;
  icon?: IconSlot;
  tone?: "neutral" | "danger";
  onSelect?: () => void;
  disabled?: boolean;
};

export type DropdownProps = {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
  className?: string;
};

export const DropdownView = ({
  trigger,
  items,
  align = "start",
  className,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-dropdown mt-1 min-w-[12rem] rounded-lg border border-border bg-surface-raised p-1 shadow-soft",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {items.map((item) => (
            <button
              key={item.id}
              role="menuitem"
              type="button"
              disabled={item.disabled}
              onClick={() => {
                item.onSelect?.();
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-bk-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                item.tone === "danger"
                  ? "text-danger hover:bg-danger-soft"
                  : "text-foreground hover:bg-surface-muted",
                item.disabled && "cursor-not-allowed opacity-50",
              )}
            >
              {renderIcon(item.icon)}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Dropdown = createComponent<DropdownProps>("Dropdown");

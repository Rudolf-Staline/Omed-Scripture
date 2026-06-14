import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { cn, createComponent } from "@basekit/core";
import { Icon, renderIcon } from "../internal";
export const TabsView = ({ items, value, defaultValue, onValueChange, className, }) => {
    const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
    const active = value ?? internal;
    const select = (id) => {
        setInternal(id);
        onValueChange?.(id);
    };
    const activeItem = items.find((item) => item.id === active);
    return (_jsxs("div", { className: cn("space-y-4", className), children: [_jsx("div", { role: "tablist", className: "flex gap-1 border-b border-border", children: items.map((item) => {
                    const isActive = item.id === active;
                    return (_jsxs("button", { role: "tab", type: "button", "aria-selected": isActive, disabled: item.disabled, onClick: () => select(item.id), className: cn("inline-flex items-center gap-2 border-b-2 px-3 py-2 text-bk-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring -mb-px", isActive
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground", item.disabled && "cursor-not-allowed opacity-50"), children: [renderIcon(item.icon), item.label] }, item.id));
                }) }), _jsx("div", { role: "tabpanel", children: activeItem?.content })] }));
};
export const Tabs = createComponent("Tabs");
export const AccordionView = ({ items, multiple, defaultOpen = [], className, }) => {
    const [open, setOpen] = useState(defaultOpen);
    const toggle = (id) => setOpen((prev) => prev.includes(id)
        ? prev.filter((x) => x !== id)
        : multiple
            ? [...prev, id]
            : [id]);
    return (_jsx("div", { className: cn("divide-y divide-border rounded-lg border border-border", className), children: items.map((item) => {
            const isOpen = open.includes(item.id);
            return (_jsxs("div", { children: [_jsxs("button", { type: "button", "aria-expanded": isOpen, onClick: () => toggle(item.id), className: "flex w-full items-center justify-between gap-4 p-4 text-left text-bk-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", children: [item.title, _jsx(Icon, { name: "chevron-down", className: cn("shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180") })] }), isOpen && (_jsx("div", { className: "px-4 pb-4 text-bk-sm text-muted-foreground", children: item.content }))] }, item.id));
        }) }));
};
export const Accordion = createComponent("Accordion");
export const DropdownView = ({ trigger, items, align = "start", className, }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target))
                setOpen(false);
        };
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);
    return (_jsxs("div", { ref: ref, className: cn("relative inline-block", className), children: [_jsx("div", { onClick: () => setOpen((v) => !v), children: trigger }), open && (_jsx("div", { role: "menu", className: cn("absolute z-dropdown mt-1 min-w-[12rem] rounded-lg border border-border bg-surface-raised p-1 shadow-soft", align === "end" ? "right-0" : "left-0"), children: items.map((item) => (_jsxs("button", { role: "menuitem", type: "button", disabled: item.disabled, onClick: () => {
                        item.onSelect?.();
                        setOpen(false);
                    }, className: cn("flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-bk-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", item.tone === "danger"
                        ? "text-danger hover:bg-danger-soft"
                        : "text-foreground hover:bg-surface-muted", item.disabled && "cursor-not-allowed opacity-50"), children: [renderIcon(item.icon), item.label] }, item.id))) }))] }));
};
export const Dropdown = createComponent("Dropdown");
//# sourceMappingURL=Disclosure.js.map
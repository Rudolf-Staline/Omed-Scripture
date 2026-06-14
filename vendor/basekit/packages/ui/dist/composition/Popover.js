import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState, } from "react";
import { cn, createComponent } from "@basekit/core";
import { IconButtonView } from "../primitives/Button";
const placementStyles = {
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
export const PopoverView = ({ id, className, trigger, children, open, defaultOpen = false, placement = "bottom", title, closeOnInteractOutside = true, showClose = true, onOpenChange, }) => {
    const generatedId = useId();
    const panelId = id ?? generatedId;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isOpen = open ?? internalOpen;
    const ref = useRef(null);
    const setOpen = (next) => {
        setInternalOpen(next);
        onOpenChange?.(next);
    };
    useEffect(() => {
        if (!isOpen)
            return;
        const onPointer = (event) => {
            if (closeOnInteractOutside &&
                ref.current &&
                !ref.current.contains(event.target))
                setOpen(false);
        };
        const onKey = (event) => {
            if (event.key === "Escape")
                setOpen(false);
        };
        document.addEventListener("mousedown", onPointer);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onPointer);
            document.removeEventListener("keydown", onKey);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, closeOnInteractOutside]);
    return (_jsxs("div", { ref: ref, className: cn("relative inline-block", className), children: [_jsx("span", { "aria-haspopup": "dialog", "aria-expanded": isOpen, "aria-controls": isOpen ? panelId : undefined, onClick: () => setOpen(!isOpen), children: trigger }), isOpen && (_jsxs("div", { id: panelId, role: "dialog", "aria-label": typeof title === "string" ? title : undefined, className: cn("absolute z-popover min-w-[14rem] rounded-lg border border-border bg-surface-raised p-3 shadow-soft", placementStyles[placement]), children: [(title != null || showClose) && (_jsxs("div", { className: "mb-2 flex items-start justify-between gap-4", children: [title != null && (_jsx("p", { className: "text-bk-sm font-semibold text-foreground", children: title })), showClose && (_jsx(IconButtonView, { icon: "close", "aria-label": "Fermer", size: "xs", onClick: () => setOpen(false) }))] })), _jsx("div", { className: "text-bk-sm text-foreground", children: children })] }))] }));
};
export const Popover = createComponent("Popover");
//# sourceMappingURL=Popover.js.map
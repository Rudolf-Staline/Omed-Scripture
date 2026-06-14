import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState, } from "react";
import { AlertView } from "./Alert";
const ToastContext = createContext(null);
/**
 * Minimal but functional toast system. Wrap the app in `ToastProvider`, then
 * call `useToast().push({ title, tone })` anywhere. Toasts auto-dismiss after
 * `duration` ms (default 4000) and render in a fixed bottom-right stack.
 */
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    const push = useCallback((toast) => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { ...toast, id }]);
        const duration = toast.duration ?? 4000;
        if (duration > 0)
            window.setTimeout(() => dismiss(id), duration);
        return id;
    }, [dismiss]);
    const value = useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss]);
    return (_jsxs(ToastContext.Provider, { value: value, children: [children, _jsx("div", { className: "pointer-events-none fixed bottom-4 right-4 z-toast flex w-full max-w-sm flex-col gap-2", "aria-live": "polite", children: toasts.map((toast) => (_jsx("div", { className: "pointer-events-auto animate-in", children: _jsx(AlertView, { tone: toast.tone ?? "neutral", title: toast.title, onClose: () => dismiss(toast.id), className: "shadow-soft", children: toast.message }) }, toast.id))) })] }));
};
export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("[basekit] useToast must be used within <ToastProvider>");
    }
    return ctx;
};
//# sourceMappingURL=Toast.js.map
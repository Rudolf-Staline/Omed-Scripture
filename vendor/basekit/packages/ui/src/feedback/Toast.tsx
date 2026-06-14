import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Tone } from "@basekit/tokens";
import { AlertView } from "./Alert";

export type Toast = {
  id: string;
  title?: ReactNode;
  message?: ReactNode;
  tone?: Tone;
  duration?: number;
};

type ToastContextValue = {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Minimal but functional toast system. Wrap the app in `ToastProvider`, then
 * call `useToast().push({ title, tone })` anywhere. Toasts auto-dismiss after
 * `duration` ms (default 4000) and render in a fixed bottom-right stack.
 */
export const ToastProvider = ({ children }: { children?: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...toast, id }]);
      const duration = toast.duration ?? 4000;
      if (duration > 0) window.setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({ toasts, push, dismiss }),
    [toasts, push, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-toast flex w-full max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto animate-in">
            <AlertView
              tone={toast.tone ?? "neutral"}
              title={toast.title}
              onClose={() => dismiss(toast.id)}
              className="shadow-soft"
            >
              {toast.message}
            </AlertView>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("[basekit] useToast must be used within <ToastProvider>");
  }
  return ctx;
};

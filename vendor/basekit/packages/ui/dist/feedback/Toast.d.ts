import { type ReactNode } from "react";
import type { Tone } from "@basekit/tokens";
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
/**
 * Minimal but functional toast system. Wrap the app in `ToastProvider`, then
 * call `useToast().push({ title, tone })` anywhere. Toasts auto-dismiss after
 * `duration` ms (default 4000) and render in a fixed bottom-right stack.
 */
export declare const ToastProvider: ({ children }: {
    children?: ReactNode;
}) => import("react").JSX.Element;
export declare const useToast: () => ToastContextValue;
export {};
//# sourceMappingURL=Toast.d.ts.map
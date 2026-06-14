import { type ReactNode } from "react";
import type { Tone } from "@basekit/tokens";
import { type IconSlot } from "../internal";
export type AlertProps = {
    title?: ReactNode;
    children?: ReactNode;
    tone?: Tone;
    icon?: IconSlot | false;
    onClose?: () => void;
    className?: string;
    hidden?: boolean;
};
export declare const AlertView: ({ title, children, tone, icon, onClose, className, hidden, }: AlertProps) => import("react").JSX.Element | null;
export declare const Alert: import("@basekit/core").DeclarativeComponent<AlertProps>;
export type CalloutProps = {
    title?: ReactNode;
    children?: ReactNode;
    tone?: Tone;
    icon?: IconSlot;
    className?: string;
};
export declare const CalloutView: ({ title, children, tone, icon, className, }: CalloutProps) => import("react").JSX.Element;
export declare const Callout: import("@basekit/core").DeclarativeComponent<CalloutProps>;
export type EmptyStateProps = {
    title?: ReactNode;
    description?: ReactNode;
    icon?: IconSlot;
    action?: ReactNode;
    className?: string;
};
export declare const EmptyStateView: ({ title, description, icon, action, className, }: EmptyStateProps) => import("react").JSX.Element;
export declare const EmptyState: import("@basekit/core").DeclarativeComponent<EmptyStateProps>;
export type ErrorStateProps = {
    title?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    className?: string;
};
export declare const ErrorStateView: ({ title, description, action, className, }: ErrorStateProps) => import("react").JSX.Element;
export declare const ErrorState: import("@basekit/core").DeclarativeComponent<ErrorStateProps>;
//# sourceMappingURL=Alert.d.ts.map
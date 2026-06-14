import { type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";
import type { Tone } from "@basekit/tokens";
import {
  Icon,
  renderIcon,
  softToneStyles,
  type IconName,
  type IconSlot,
} from "../internal";
import { IconButtonView } from "../primitives/Button";

const defaultIcon: Record<Tone, IconName> = {
  neutral: "info",
  primary: "info",
  accent: "info",
  success: "check-circle",
  warning: "warning",
  danger: "error",
};

export type AlertProps = {
  title?: ReactNode;
  children?: ReactNode;
  tone?: Tone;
  icon?: IconSlot | false;
  onClose?: () => void;
  className?: string;
  hidden?: boolean;
};

export const AlertView = ({
  title,
  children,
  tone = "primary",
  icon,
  onClose,
  className,
  hidden,
}: AlertProps) => {
  if (hidden) return null;
  const resolvedIcon =
    icon === false ? null : renderIcon(icon ?? defaultIcon[tone]);
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-bk-sm",
        softToneStyles[tone],
        className,
      )}
    >
      {resolvedIcon != null && (
        <span className="mt-0.5 shrink-0">{resolvedIcon}</span>
      )}
      <div className="min-w-0 flex-1 space-y-0.5">
        {title != null && <p className="font-semibold">{title}</p>}
        {children != null && <div className="text-current/90">{children}</div>}
      </div>
      {onClose && (
        <IconButtonView
          icon="close"
          aria-label="Fermer"
          size="xs"
          variant="ghost"
          onClick={onClose}
        />
      )}
    </div>
  );
};

export const Alert = createComponent<AlertProps>("Alert");

/* Callout — a softer, inline emphasis block ---------------------------- */

export type CalloutProps = {
  title?: ReactNode;
  children?: ReactNode;
  tone?: Tone;
  icon?: IconSlot;
  className?: string;
};

export const CalloutView = ({
  title,
  children,
  tone = "neutral",
  icon,
  className,
}: CalloutProps) => (
  <div
    className={cn(
      "flex gap-3 rounded-lg border-l-4 bg-surface-muted p-4 text-bk-sm",
      tone === "primary" && "border-l-primary",
      tone === "accent" && "border-l-accent",
      tone === "success" && "border-l-success",
      tone === "warning" && "border-l-warning",
      tone === "danger" && "border-l-danger",
      tone === "neutral" && "border-l-border",
      className,
    )}
  >
    {icon != null && (
      <span className="mt-0.5 shrink-0 text-muted-foreground">
        {renderIcon(icon)}
      </span>
    )}
    <div className="space-y-1">
      {title != null && (
        <p className="font-semibold text-foreground">{title}</p>
      )}
      {children != null && (
        <div className="text-muted-foreground">{children}</div>
      )}
    </div>
  </div>
);

export const Callout = createComponent<CalloutProps>("Callout");

/* EmptyState ----------------------------------------------------------- */

export type EmptyStateProps = {
  title?: ReactNode;
  description?: ReactNode;
  icon?: IconSlot;
  action?: ReactNode;
  className?: string;
};

export const EmptyStateView = ({
  title = "Aucune donnée",
  description,
  icon = "search",
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center",
      className,
    )}
  >
    <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-muted text-muted-foreground">
      {renderIcon(icon, 22)}
    </span>
    <div className="space-y-1">
      <h3 className="font-semibold text-foreground">{title}</h3>
      {description != null && (
        <p className="max-w-sm text-bk-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    {action != null && <div className="pt-1">{action}</div>}
  </div>
);

export const EmptyState = createComponent<EmptyStateProps>("EmptyState");

/* ErrorState ----------------------------------------------------------- */

export type ErrorStateProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export const ErrorStateView = ({
  title = "Une erreur est survenue",
  description,
  action,
  className,
}: ErrorStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-xl border border-danger/30 bg-danger-soft px-6 py-12 text-center",
      className,
    )}
  >
    <span className="grid h-12 w-12 place-items-center rounded-full bg-danger/15 text-danger">
      <Icon name="error" size={22} />
    </span>
    <div className="space-y-1">
      <h3 className="font-semibold text-foreground">{title}</h3>
      {description != null && (
        <p className="max-w-sm text-bk-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    {action != null && <div className="pt-1">{action}</div>}
  </div>
);

export const ErrorState = createComponent<ErrorStateProps>("ErrorState");

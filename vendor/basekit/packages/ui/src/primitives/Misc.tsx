import { type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";
import type { Size } from "@basekit/tokens";
import {
  Icon,
  renderIcon,
  softToneStyles,
  solidDotStyles,
  textToneStyles,
  type IconSlot,
  type Tone,
} from "../internal";

/* Badge ------------------------------------------------------------- */

export type BadgeProps = {
  text?: ReactNode;
  children?: ReactNode;
  tone?: Tone;
  variant?: "soft" | "solid" | "outline";
  dot?: boolean;
  iconLeft?: IconSlot;
  className?: string;
  hidden?: boolean;
};

export const BadgeView = ({
  text,
  children,
  tone = "neutral",
  variant = "soft",
  dot,
  iconLeft,
  className,
  hidden,
}: BadgeProps) => {
  if (hidden) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-bk-xs font-medium",
        variant === "soft" && softToneStyles[tone],
        variant === "outline" &&
          cn("bg-transparent", textToneStyles[tone], "border-current"),
        variant === "solid" && solidToneSurface[tone],
        className,
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", solidDotStyles[tone])}
        />
      )}
      {renderIcon(iconLeft)}
      {children ?? text}
    </span>
  );
};

const solidToneSurface: Record<Tone, string> = {
  neutral: "bg-foreground text-background border-transparent",
  primary: "bg-primary text-primary-foreground border-transparent",
  accent: "bg-accent text-accent-foreground border-transparent",
  success: "bg-success text-success-foreground border-transparent",
  warning: "bg-warning text-warning-foreground border-transparent",
  danger: "bg-danger text-danger-foreground border-transparent",
};

export const Badge = createComponent<BadgeProps>("Badge");

/* Link -------------------------------------------------------------- */

export type LinkProps = {
  href: string;
  children?: ReactNode;
  text?: ReactNode;
  tone?: Tone;
  external?: boolean;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

export const LinkView = ({
  href,
  children,
  text,
  tone = "primary",
  external,
  className,
  ...rest
}: LinkProps) => (
  <a
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noreferrer noopener" : undefined}
    className={cn(
      "inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
      textToneStyles[tone],
      className,
    )}
    {...rest}
  >
    {children ?? text}
    {external && <Icon name="external" size={14} aria-hidden />}
  </a>
);

export const Link = createComponent<LinkProps>("Link");

/* Avatar ------------------------------------------------------------ */

export type AvatarProps = {
  src?: string;
  alt?: string;
  name?: string;
  size?: Size;
  className?: string;
};

const avatarSize: Record<Size, string> = {
  xs: "h-6 w-6 text-bk-xs",
  sm: "h-8 w-8 text-bk-sm",
  md: "h-10 w-10 text-bk-sm",
  lg: "h-12 w-12 text-bk-md",
  xl: "h-14 w-14 text-bk-lg",
};

const initials = (name?: string) =>
  name
    ? name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

export const AvatarView = ({
  src,
  alt,
  name,
  size = "md",
  className,
}: AvatarProps) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft font-semibold text-primary",
      avatarSize[size],
      className,
    )}
  >
    {src ? (
      <img
        src={src}
        alt={alt ?? name ?? ""}
        className="h-full w-full object-cover"
      />
    ) : name ? (
      <span aria-hidden>{initials(name)}</span>
    ) : (
      <Icon name="user" aria-hidden />
    )}
  </span>
);

export const Avatar = createComponent<AvatarProps>("Avatar");

/* Divider ----------------------------------------------------------- */

export type DividerProps = {
  orientation?: "horizontal" | "vertical";
  label?: ReactNode;
  className?: string;
};

export const DividerView = ({
  orientation = "horizontal",
  label,
  className,
}: DividerProps) => {
  if (orientation === "vertical") {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={cn("inline-block w-px self-stretch bg-border", className)}
      />
    );
  }
  if (label != null) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 text-bk-xs text-muted-foreground",
          className,
        )}
      >
        <span className="h-px flex-1 bg-border" />
        {label}
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }
  return <hr className={cn("border-0 border-t border-border", className)} />;
};

export const Divider = createComponent<DividerProps>("Divider");

/* Kbd --------------------------------------------------------------- */

export type KbdProps = {
  children?: ReactNode;
  keys?: string[];
  className?: string;
};

export const KbdView = ({ children, keys, className }: KbdProps) => (
  <kbd
    className={cn(
      "inline-flex items-center gap-1 rounded-md border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-bk-xs text-muted-foreground",
      className,
    )}
  >
    {keys ? keys.join(" + ") : children}
  </kbd>
);

export const Kbd = createComponent<KbdProps>("Kbd");

/* Spinner ----------------------------------------------------------- */

export type SpinnerProps = {
  size?: number | string;
  tone?: Tone;
  label?: string;
  className?: string;
};

export const SpinnerView = ({
  size = 20,
  tone = "primary",
  label = "Chargement",
  className,
}: SpinnerProps) => (
  <Icon
    name="spinner"
    size={size}
    title={label}
    className={cn("animate-spin", textToneStyles[tone], className)}
  />
);

export const Spinner = createComponent<SpinnerProps>("Spinner");

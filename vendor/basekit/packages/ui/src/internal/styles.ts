import type { Radius, Shadow, Size, Tone, Variant } from "@basekit/tokens";

/**
 * Tone × variant class tables.
 *
 * Every entry is a *literal* string so Tailwind's JIT can statically discover
 * the classes. All colours resolve to `--bk-*` variables via the preset, so no
 * raw colour ever appears here — only semantic token utilities.
 */
export const interactiveToneStyles: Record<Variant, Record<Tone, string>> = {
  solid: {
    neutral: "bg-foreground text-background hover:bg-foreground/90",
    primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
    accent: "bg-accent text-accent-foreground hover:bg-accent-hover",
    success: "bg-success text-success-foreground hover:bg-success-hover",
    warning: "bg-warning text-warning-foreground hover:bg-warning-hover",
    danger: "bg-danger text-danger-foreground hover:bg-danger-hover",
  },
  soft: {
    neutral: "bg-surface-muted text-foreground hover:bg-neutral-hover",
    primary: "bg-primary-soft text-primary hover:bg-primary-soft",
    accent: "bg-accent-soft text-accent hover:bg-accent-soft",
    success: "bg-success-soft text-success hover:bg-success-soft",
    warning: "bg-warning-soft text-warning hover:bg-warning-soft",
    danger: "bg-danger-soft text-danger hover:bg-danger-soft",
  },
  outline: {
    neutral: "border border-border text-foreground hover:bg-surface-muted",
    primary: "border border-primary text-primary hover:bg-primary-soft",
    accent: "border border-accent text-accent hover:bg-accent-soft",
    success: "border border-success text-success hover:bg-success-soft",
    warning: "border border-warning text-warning hover:bg-warning-soft",
    danger: "border border-danger text-danger hover:bg-danger-soft",
  },
  ghost: {
    neutral: "text-foreground hover:bg-surface-muted",
    primary: "text-primary hover:bg-primary-soft",
    accent: "text-accent hover:bg-accent-soft",
    success: "text-success hover:bg-success-soft",
    warning: "text-warning hover:bg-warning-soft",
    danger: "text-danger hover:bg-danger-soft",
  },
  link: {
    neutral: "text-foreground underline-offset-4 hover:underline",
    primary: "text-primary underline-offset-4 hover:underline",
    accent: "text-accent underline-offset-4 hover:underline",
    success: "text-success underline-offset-4 hover:underline",
    warning: "text-warning underline-offset-4 hover:underline",
    danger: "text-danger underline-offset-4 hover:underline",
  },
};

/** Subtle status surfaces for Alert / Callout / Badge backgrounds. */
export const softToneStyles: Record<Tone, string> = {
  neutral: "bg-surface-muted text-foreground border-border",
  primary: "bg-primary-soft text-primary border-primary/30",
  accent: "bg-accent-soft text-accent border-accent/30",
  success: "bg-success-soft text-success border-success/30",
  warning: "bg-warning-soft text-warning border-warning/30",
  danger: "bg-danger-soft text-danger border-danger/30",
};

/** Foreground-only tone (for Text, icons). */
export const textToneStyles: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

export const solidDotStyles: Record<Tone, string> = {
  neutral: "bg-mutedForeground",
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export const controlSizeStyles: Record<Size, string> = {
  xs: "h-7 px-2 text-bk-xs gap-1.5",
  sm: "h-8 px-3 text-bk-sm gap-1.5",
  md: "h-10 px-4 text-bk-sm gap-2",
  lg: "h-11 px-5 text-bk-md gap-2",
  xl: "h-12 px-6 text-bk-lg gap-2.5",
};

export const iconButtonSizeStyles: Record<Size, string> = {
  xs: "h-7 w-7 text-bk-xs",
  sm: "h-8 w-8 text-bk-sm",
  md: "h-10 w-10 text-bk-sm",
  lg: "h-11 w-11 text-bk-md",
  xl: "h-12 w-12 text-bk-lg",
};

export const gapStyles: Record<Size, string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-10",
};

export const paddingStyles: Record<Size, string> = {
  xs: "p-2",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-10",
};

export const radiusStyles: Record<Radius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const shadowStyles: Record<Shadow, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  soft: "shadow-soft",
  strong: "shadow-strong",
};

/** Shared focus ring, applied to every interactive control. */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

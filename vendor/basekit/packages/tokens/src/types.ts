/**
 * Shared visual vocabulary for the whole design system.
 *
 * These string-literal unions are the contract every component speaks.
 * They are intentionally small so that consumers learn one set of words
 * (`tone`, `variant`, `size`, ...) and reuse them everywhere.
 */

export type Tone =
  | "neutral"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger";

export type Size = "xs" | "sm" | "md" | "lg" | "xl";

export type Variant = "solid" | "soft" | "outline" | "ghost" | "link";

export type Radius = "none" | "sm" | "md" | "lg" | "xl" | "full";

export type Shadow = "none" | "sm" | "md" | "soft" | "strong";

export type Align = "start" | "center" | "end" | "stretch" | "baseline";

export type Justify = "start" | "center" | "end" | "between" | "around";

/**
 * Semantic colour roles. Components never reference raw colours; they reference
 * these roles, which resolve to CSS variables (`--bk-*`) and can be re-themed
 * globally (light, dark, or any custom theme) without touching component code.
 */
export type ColorToken =
  | "background"
  | "foreground"
  | "surface"
  | "surfaceRaised"
  | "surfaceMuted"
  | "primary"
  | "primaryForeground"
  | "accent"
  | "accentForeground"
  | "success"
  | "successForeground"
  | "warning"
  | "warningForeground"
  | "danger"
  | "dangerForeground"
  | "muted"
  | "mutedForeground"
  | "border"
  | "input"
  | "ring";

export type ThemeName = "light" | "dark";

export type ColorScale = Record<ColorToken, string>;

import { darkColors, lightColors } from "./colors";
import { radii } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { fontSizes } from "./typography";
import { transitions } from "./transitions";
import type { ColorScale, ColorToken } from "./types";

/** Tones that own a vivid hue and therefore get derived soft/hover tints. */
const hueTokens: ColorToken[] = [
  "primary",
  "accent",
  "success",
  "warning",
  "danger",
];

/**
 * Turns a colour scale into the full set of `--bk-*` custom properties,
 * including derived tints (`-soft`, `-hover`) computed with `color-mix` so the
 * palette stays minimal but components still get tasteful hover/soft states.
 */
export const colorCssVariables = (
  theme: ColorScale,
): Record<string, string> => {
  const vars: Record<string, string> = {};

  (Object.keys(theme) as ColorToken[]).forEach((token) => {
    vars[`--bk-${token}`] = theme[token];
  });

  hueTokens.forEach((token) => {
    vars[`--bk-${token}-soft`] =
      `color-mix(in oklab, var(--bk-${token}) 14%, var(--bk-surface))`;
    vars[`--bk-${token}-hover`] =
      `color-mix(in oklab, var(--bk-${token}) 88%, black)`;
  });

  // Neutral soft/hover lean on surfaces rather than a hue.
  vars["--bk-neutral-soft"] = "var(--bk-surfaceMuted)";
  vars["--bk-neutral-hover"] =
    "color-mix(in oklab, var(--bk-surfaceMuted) 70%, var(--bk-foreground) 8%)";

  return vars;
};

/** Non-colour design tokens, emitted once (theme-independent). */
export const scaleCssVariables = (): Record<string, string> => ({
  "--bk-radius-sm": radii.sm,
  "--bk-radius-md": radii.md,
  "--bk-radius-lg": radii.lg,
  "--bk-radius-xl": radii.xl,
  "--bk-shadow-sm": shadows.sm,
  "--bk-shadow-md": shadows.md,
  "--bk-shadow-soft": shadows.soft,
  "--bk-shadow-strong": shadows.strong,
  "--bk-space-md": spacing.md,
  "--bk-text-md": fontSizes.md,
  "--bk-transition": transitions.normal,
});

const declarations = (vars: Record<string, string>): string =>
  Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

/**
 * Produces a ready-to-ship stylesheet with `:root` (light), `.dark` and a
 * `prefers-color-scheme` fallback. Import once at the app root.
 */
export const buildThemeStylesheet = (): string => {
  const light = { ...colorCssVariables(lightColors), ...scaleCssVariables() };
  const dark = colorCssVariables(darkColors);

  return `:root {\n${declarations(light)}\n}\n\n.dark {\n${declarations(dark)}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root:not(.light) {\n${declarations(dark)}\n  }\n}\n`;
};

/**
 * Inline-style friendly variant of the theme variables, e.g. for applying a
 * theme to a single subtree via `style={themeStyle("dark")}`.
 */
export const themeStyle = (
  theme: "light" | "dark" = "light",
): Record<string, string> => ({
  ...colorCssVariables(theme === "dark" ? darkColors : lightColors),
  ...scaleCssVariables(),
});

import type { ColorScale } from "./types";
/**
 * Turns a colour scale into the full set of `--bk-*` custom properties,
 * including derived tints (`-soft`, `-hover`) computed with `color-mix` so the
 * palette stays minimal but components still get tasteful hover/soft states.
 */
export declare const colorCssVariables: (theme: ColorScale) => Record<string, string>;
/** Non-colour design tokens, emitted once (theme-independent). */
export declare const scaleCssVariables: () => Record<string, string>;
/**
 * Produces a ready-to-ship stylesheet with `:root` (light), `.dark` and a
 * `prefers-color-scheme` fallback. Import once at the app root.
 */
export declare const buildThemeStylesheet: () => string;
/**
 * Inline-style friendly variant of the theme variables, e.g. for applying a
 * theme to a single subtree via `style={themeStyle("dark")}`.
 */
export declare const themeStyle: (theme?: "light" | "dark") => Record<string, string>;
//# sourceMappingURL=cssVariables.d.ts.map
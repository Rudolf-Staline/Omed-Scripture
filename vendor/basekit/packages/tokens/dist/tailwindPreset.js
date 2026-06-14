import { radii } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { fontFamilies, fontSizes } from "./typography";
import { breakpoints } from "./spacing";
import { zIndex } from "./transitions";
/**
 * Tailwind preset that exposes the design tokens as *semantic* utilities.
 *
 * Consumers (and our own components) write `bg-surface`, `text-muted-foreground`,
 * `border-border`, `bg-primary-soft` — never raw colours like `bg-blue-500`.
 * Every colour resolves to a `--bk-*` CSS variable, so re-theming is global.
 */
export const basekitPreset = {
    theme: {
        extend: {
            colors: {
                background: "var(--bk-background)",
                foreground: "var(--bk-foreground)",
                surface: {
                    DEFAULT: "var(--bk-surface)",
                    raised: "var(--bk-surfaceRaised)",
                    muted: "var(--bk-surfaceMuted)",
                },
                primary: {
                    DEFAULT: "var(--bk-primary)",
                    foreground: "var(--bk-primaryForeground)",
                    soft: "var(--bk-primary-soft)",
                    hover: "var(--bk-primary-hover)",
                },
                accent: {
                    DEFAULT: "var(--bk-accent)",
                    foreground: "var(--bk-accentForeground)",
                    soft: "var(--bk-accent-soft)",
                    hover: "var(--bk-accent-hover)",
                },
                success: {
                    DEFAULT: "var(--bk-success)",
                    foreground: "var(--bk-successForeground)",
                    soft: "var(--bk-success-soft)",
                    hover: "var(--bk-success-hover)",
                },
                warning: {
                    DEFAULT: "var(--bk-warning)",
                    foreground: "var(--bk-warningForeground)",
                    soft: "var(--bk-warning-soft)",
                    hover: "var(--bk-warning-hover)",
                },
                danger: {
                    DEFAULT: "var(--bk-danger)",
                    foreground: "var(--bk-dangerForeground)",
                    soft: "var(--bk-danger-soft)",
                    hover: "var(--bk-danger-hover)",
                },
                neutral: {
                    soft: "var(--bk-neutral-soft)",
                    hover: "var(--bk-neutral-hover)",
                },
                muted: {
                    DEFAULT: "var(--bk-muted)",
                    foreground: "var(--bk-mutedForeground)",
                },
                border: "var(--bk-border)",
                input: "var(--bk-input)",
                ring: "var(--bk-ring)",
            },
            borderRadius: {
                sm: radii.sm,
                md: radii.md,
                lg: radii.lg,
                xl: radii.xl,
            },
            boxShadow: {
                sm: shadows.sm,
                md: shadows.md,
                soft: shadows.soft,
                strong: shadows.strong,
            },
            spacing: {
                "bk-xs": spacing.xs,
                "bk-sm": spacing.sm,
                "bk-md": spacing.md,
                "bk-lg": spacing.lg,
                "bk-xl": spacing.xl,
            },
            fontFamily: {
                sans: fontFamilies.sans.split(", "),
                mono: fontFamilies.mono.split(", "),
                serif: fontFamilies.serif.split(", "),
            },
            fontSize: {
                "bk-xs": fontSizes.xs,
                "bk-sm": fontSizes.sm,
                "bk-md": fontSizes.md,
                "bk-lg": fontSizes.lg,
                "bk-xl": fontSizes.xl,
            },
            screens: breakpoints,
            zIndex: Object.fromEntries(Object.entries(zIndex).map(([key, value]) => [key, String(value)])),
            ringColor: { DEFAULT: "var(--bk-ring)" },
        },
    },
};
export default basekitPreset;
//# sourceMappingURL=tailwindPreset.js.map
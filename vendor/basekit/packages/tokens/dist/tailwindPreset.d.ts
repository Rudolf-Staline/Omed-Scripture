/**
 * Tailwind preset that exposes the design tokens as *semantic* utilities.
 *
 * Consumers (and our own components) write `bg-surface`, `text-muted-foreground`,
 * `border-border`, `bg-primary-soft` — never raw colours like `bg-blue-500`.
 * Every colour resolves to a `--bk-*` CSS variable, so re-theming is global.
 */
export declare const basekitPreset: {
    readonly theme: {
        readonly extend: {
            readonly colors: {
                readonly background: "var(--bk-background)";
                readonly foreground: "var(--bk-foreground)";
                readonly surface: {
                    readonly DEFAULT: "var(--bk-surface)";
                    readonly raised: "var(--bk-surfaceRaised)";
                    readonly muted: "var(--bk-surfaceMuted)";
                };
                readonly primary: {
                    readonly DEFAULT: "var(--bk-primary)";
                    readonly foreground: "var(--bk-primaryForeground)";
                    readonly soft: "var(--bk-primary-soft)";
                    readonly hover: "var(--bk-primary-hover)";
                };
                readonly accent: {
                    readonly DEFAULT: "var(--bk-accent)";
                    readonly foreground: "var(--bk-accentForeground)";
                    readonly soft: "var(--bk-accent-soft)";
                    readonly hover: "var(--bk-accent-hover)";
                };
                readonly success: {
                    readonly DEFAULT: "var(--bk-success)";
                    readonly foreground: "var(--bk-successForeground)";
                    readonly soft: "var(--bk-success-soft)";
                    readonly hover: "var(--bk-success-hover)";
                };
                readonly warning: {
                    readonly DEFAULT: "var(--bk-warning)";
                    readonly foreground: "var(--bk-warningForeground)";
                    readonly soft: "var(--bk-warning-soft)";
                    readonly hover: "var(--bk-warning-hover)";
                };
                readonly danger: {
                    readonly DEFAULT: "var(--bk-danger)";
                    readonly foreground: "var(--bk-dangerForeground)";
                    readonly soft: "var(--bk-danger-soft)";
                    readonly hover: "var(--bk-danger-hover)";
                };
                readonly neutral: {
                    readonly soft: "var(--bk-neutral-soft)";
                    readonly hover: "var(--bk-neutral-hover)";
                };
                readonly muted: {
                    readonly DEFAULT: "var(--bk-muted)";
                    readonly foreground: "var(--bk-mutedForeground)";
                };
                readonly border: "var(--bk-border)";
                readonly input: "var(--bk-input)";
                readonly ring: "var(--bk-ring)";
            };
            readonly borderRadius: {
                readonly sm: string;
                readonly md: string;
                readonly lg: string;
                readonly xl: string;
            };
            readonly boxShadow: {
                readonly sm: string;
                readonly md: string;
                readonly soft: string;
                readonly strong: string;
            };
            readonly spacing: {
                readonly "bk-xs": string;
                readonly "bk-sm": string;
                readonly "bk-md": string;
                readonly "bk-lg": string;
                readonly "bk-xl": string;
            };
            readonly fontFamily: {
                readonly sans: string[];
                readonly mono: string[];
                readonly serif: string[];
            };
            readonly fontSize: {
                readonly "bk-xs": string;
                readonly "bk-sm": string;
                readonly "bk-md": string;
                readonly "bk-lg": string;
                readonly "bk-xl": string;
            };
            readonly screens: {
                readonly sm: "640px";
                readonly md: "768px";
                readonly lg: "1024px";
                readonly xl: "1280px";
                readonly "2xl": "1536px";
            };
            readonly zIndex: {
                [k: string]: string;
            };
            readonly ringColor: {
                readonly DEFAULT: "var(--bk-ring)";
            };
        };
    };
};
export default basekitPreset;
//# sourceMappingURL=tailwindPreset.d.ts.map
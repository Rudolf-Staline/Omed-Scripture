import type { Size } from "./types";
export declare const fontFamilies: {
    readonly sans: "Inter, ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif";
    readonly mono: "ui-monospace, \"JetBrains Mono\", \"SFMono-Regular\", Menlo, monospace";
    readonly serif: "Georgia, \"Times New Roman\", ui-serif, serif";
};
export declare const fontSizes: Record<Size, string>;
export declare const fontWeights: {
    readonly normal: 400;
    readonly medium: 500;
    readonly semibold: 600;
    readonly bold: 700;
};
export declare const lineHeights: {
    readonly tight: "1.2";
    readonly snug: "1.4";
    readonly normal: "1.55";
    readonly relaxed: "1.75";
};
/** Named text styles, the vocabulary the `Text`/`Heading` components expose. */
export declare const textStyles: {
    readonly display: {
        readonly fontSize: "2.25rem";
        readonly fontWeight: 700;
        readonly lineHeight: "1.15";
    };
    readonly title: {
        readonly fontSize: "1.5rem";
        readonly fontWeight: 700;
        readonly lineHeight: "1.25";
    };
    readonly heading: {
        readonly fontSize: "1.25rem";
        readonly fontWeight: 600;
        readonly lineHeight: "1.3";
    };
    readonly subtitle: {
        readonly fontSize: "1.125rem";
        readonly fontWeight: 600;
        readonly lineHeight: "1.4";
    };
    readonly body: {
        readonly fontSize: "0.9375rem";
        readonly fontWeight: 400;
        readonly lineHeight: "1.55";
    };
    readonly label: {
        readonly fontSize: "0.875rem";
        readonly fontWeight: 500;
        readonly lineHeight: "1.4";
    };
    readonly caption: {
        readonly fontSize: "0.8125rem";
        readonly fontWeight: 400;
        readonly lineHeight: "1.4";
    };
    readonly code: {
        readonly fontSize: "0.875rem";
        readonly fontWeight: 400;
        readonly lineHeight: "1.5";
    };
};
export type TextStyle = keyof typeof textStyles;
//# sourceMappingURL=typography.d.ts.map
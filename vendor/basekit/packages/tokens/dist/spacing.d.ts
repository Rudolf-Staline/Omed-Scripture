import type { Size } from "./types";
/** Spacing scale, keyed by {@link Size}. Used for padding, gaps and insets. */
export declare const spacing: Record<Size, string>;
/** Generic sizing scale for control heights, icon boxes, avatars, etc. */
export declare const sizes: Record<Size, string>;
export declare const breakpoints: {
    readonly sm: "640px";
    readonly md: "768px";
    readonly lg: "1024px";
    readonly xl: "1280px";
    readonly "2xl": "1536px";
};
export type Breakpoint = keyof typeof breakpoints;
//# sourceMappingURL=spacing.d.ts.map
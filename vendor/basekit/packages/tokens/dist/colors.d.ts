import type { ColorScale, Tone } from "./types";
/**
 * Light theme. A calm, slightly cool neutral base with a confident indigo
 * primary and a vivid violet accent — designed to read well on dense
 * dashboards and serious tools, not a generic Bootstrap blue.
 */
export declare const lightColors: ColorScale;
/** Dark theme — same roles, re-tuned for low-light comfort and contrast. */
export declare const darkColors: ColorScale;
/**
 * Maps every {@link Tone} to the colour roles it paints with. `neutral` is the
 * odd one out: it leans on the surface/foreground roles rather than a vivid hue.
 */
export declare const toneColorRoles: Record<Tone, {
    base: keyof ColorScale;
    foreground: keyof ColorScale;
}>;
export declare const themes: Record<"light" | "dark", ColorScale>;
//# sourceMappingURL=colors.d.ts.map
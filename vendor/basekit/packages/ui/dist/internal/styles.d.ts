import type { Radius, Shadow, Size, Tone, Variant } from "@basekit/tokens";
/**
 * Tone × variant class tables.
 *
 * Every entry is a *literal* string so Tailwind's JIT can statically discover
 * the classes. All colours resolve to `--bk-*` variables via the preset, so no
 * raw colour ever appears here — only semantic token utilities.
 */
export declare const interactiveToneStyles: Record<Variant, Record<Tone, string>>;
/** Subtle status surfaces for Alert / Callout / Badge backgrounds. */
export declare const softToneStyles: Record<Tone, string>;
/** Foreground-only tone (for Text, icons). */
export declare const textToneStyles: Record<Tone, string>;
export declare const solidDotStyles: Record<Tone, string>;
export declare const controlSizeStyles: Record<Size, string>;
export declare const iconButtonSizeStyles: Record<Size, string>;
export declare const gapStyles: Record<Size, string>;
export declare const paddingStyles: Record<Size, string>;
export declare const radiusStyles: Record<Radius, string>;
export declare const shadowStyles: Record<Shadow, string>;
/** Shared focus ring, applied to every interactive control. */
export declare const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
//# sourceMappingURL=styles.d.ts.map
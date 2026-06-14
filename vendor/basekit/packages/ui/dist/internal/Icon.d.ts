import type { SVGProps } from "react";
/**
 * A tiny curated icon set (stroke-based, currentColor) so the library stays
 * dependency-free. Pass `name` for a built-in glyph; components also accept a
 * raw ReactNode wherever an icon is expected, so any icon library still works.
 */
export type IconName = "filter" | "undo" | "close" | "check" | "check-circle" | "info" | "warning" | "error" | "search" | "plus" | "calendar" | "chevron-down" | "chevron-right" | "chevron-left" | "menu" | "arrow-right" | "trash" | "settings" | "user" | "external" | "spinner";
export type IconProps = SVGProps<SVGSVGElement> & {
    name: IconName;
    size?: number | string;
    title?: string;
};
export declare const Icon: ({ name, size, title, ...props }: IconProps) => import("react").JSX.Element;
//# sourceMappingURL=Icon.d.ts.map
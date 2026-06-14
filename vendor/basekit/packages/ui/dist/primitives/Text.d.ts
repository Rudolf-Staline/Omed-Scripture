import { type ReactNode } from "react";
import type { TextStyle } from "@basekit/tokens";
import type { Tone } from "../internal";
export type TextProps = {
    value?: ReactNode;
    children?: ReactNode;
    as?: "p" | "span" | "div" | "label";
    textVariant?: TextStyle;
    tone?: Tone;
    align?: "left" | "center" | "right";
    truncate?: boolean;
    weight?: "normal" | "medium" | "semibold" | "bold";
    className?: string;
    id?: string;
    hidden?: boolean;
    testId?: string;
};
export declare const TextView: ({ value, children, as, textVariant, tone, align, truncate, weight, className, id, hidden, testId, }: TextProps) => import("react").DetailedReactHTMLElement<{
    id: string | undefined;
    "data-testid": string | undefined;
    className: string;
}, HTMLElement> | null;
export declare const Text: import("@basekit/core").DeclarativeComponent<TextProps>;
export type HeadingProps = Omit<TextProps, "as" | "textVariant"> & {
    level?: 1 | 2 | 3 | 4;
};
export declare const HeadingView: ({ level, ...props }: HeadingProps) => import("react").DetailedReactHTMLElement<{}, HTMLElement>;
export declare const Heading: import("@basekit/core").DeclarativeComponent<HeadingProps>;
//# sourceMappingURL=Text.d.ts.map
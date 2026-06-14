import { type AnchorHTMLAttributes, type ReactNode } from "react";
import type { Size } from "@basekit/tokens";
import { type IconSlot, type Tone } from "../internal";
export type BadgeProps = {
    text?: ReactNode;
    children?: ReactNode;
    tone?: Tone;
    variant?: "soft" | "solid" | "outline";
    dot?: boolean;
    iconLeft?: IconSlot;
    className?: string;
    hidden?: boolean;
};
export declare const BadgeView: ({ text, children, tone, variant, dot, iconLeft, className, hidden, }: BadgeProps) => import("react").JSX.Element | null;
export declare const Badge: import("@basekit/core").DeclarativeComponent<BadgeProps>;
export type LinkProps = {
    href: string;
    children?: ReactNode;
    text?: ReactNode;
    tone?: Tone;
    external?: boolean;
    className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;
export declare const LinkView: ({ href, children, text, tone, external, className, ...rest }: LinkProps) => import("react").JSX.Element;
export declare const Link: import("@basekit/core").DeclarativeComponent<LinkProps>;
export type AvatarProps = {
    src?: string;
    alt?: string;
    name?: string;
    size?: Size;
    className?: string;
};
export declare const AvatarView: ({ src, alt, name, size, className, }: AvatarProps) => import("react").JSX.Element;
export declare const Avatar: import("@basekit/core").DeclarativeComponent<AvatarProps>;
export type DividerProps = {
    orientation?: "horizontal" | "vertical";
    label?: ReactNode;
    className?: string;
};
export declare const DividerView: ({ orientation, label, className, }: DividerProps) => import("react").JSX.Element;
export declare const Divider: import("@basekit/core").DeclarativeComponent<DividerProps>;
export type KbdProps = {
    children?: ReactNode;
    keys?: string[];
    className?: string;
};
export declare const KbdView: ({ children, keys, className }: KbdProps) => import("react").JSX.Element;
export declare const Kbd: import("@basekit/core").DeclarativeComponent<KbdProps>;
export type SpinnerProps = {
    size?: number | string;
    tone?: Tone;
    label?: string;
    className?: string;
};
export declare const SpinnerView: ({ size, tone, label, className, }: SpinnerProps) => import("react").JSX.Element;
export declare const Spinner: import("@basekit/core").DeclarativeComponent<SpinnerProps>;
//# sourceMappingURL=Misc.d.ts.map
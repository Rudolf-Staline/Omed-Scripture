import { type ButtonHTMLAttributes, type ReactNode } from "react";
import type { Radius, Size, Tone, Variant } from "@basekit/tokens";
import { type IconSlot } from "../internal";
export type ButtonProps = {
    id?: string;
    className?: string;
    children?: ReactNode;
    text?: string;
    type?: "button" | "submit" | "reset";
    tone?: Tone;
    variant?: Variant;
    size?: Size;
    radius?: Radius;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    hidden?: boolean;
    iconLeft?: IconSlot;
    iconRight?: IconSlot;
    /** Square, icon-sized control (used by IconButton). */
    square?: boolean;
    testId?: string;
    title?: string;
    "aria-label"?: string;
    onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
    onMouseDown?: ButtonHTMLAttributes<HTMLButtonElement>["onMouseDown"];
    onMouseEnter?: ButtonHTMLAttributes<HTMLButtonElement>["onMouseEnter"];
    onMouseLeave?: ButtonHTMLAttributes<HTMLButtonElement>["onMouseLeave"];
    onFocus?: ButtonHTMLAttributes<HTMLButtonElement>["onFocus"];
    onBlur?: ButtonHTMLAttributes<HTMLButtonElement>["onBlur"];
};
export declare const ButtonView: import("react").ForwardRefExoticComponent<ButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
export declare const Button: import("@basekit/core").DeclarativeComponent<ButtonProps>;
export type IconButtonProps = Omit<ButtonProps, "text" | "iconLeft" | "iconRight" | "fullWidth" | "children"> & {
    icon: IconSlot;
    /** Required for accessibility — icon-only buttons need a label. */
    "aria-label": string;
};
export declare const IconButtonView: import("react").ForwardRefExoticComponent<Omit<ButtonProps, "children" | "text" | "fullWidth" | "iconLeft" | "iconRight"> & {
    icon: IconSlot;
    /** Required for accessibility — icon-only buttons need a label. */
    "aria-label": string;
} & import("react").RefAttributes<HTMLButtonElement>>;
export declare const IconButton: import("@basekit/core").DeclarativeComponent<IconButtonProps>;
export type ButtonGroupProps = {
    id?: string;
    className?: string;
    children?: ReactNode;
    /** Stacking direction. */
    orientation?: "horizontal" | "vertical";
    /** Render the buttons as a single segmented control with shared borders. */
    attached?: boolean;
    /** Defaults forwarded to child buttons that don't set their own. */
    size?: Size;
    variant?: Variant;
    tone?: Tone;
    disabled?: boolean;
    hidden?: boolean;
    /** Accessible label for the group. */
    "aria-label"?: string;
};
export declare const ButtonGroupView: import("react").ForwardRefExoticComponent<ButtonGroupProps & import("react").RefAttributes<HTMLDivElement>>;
export declare const ButtonGroup: import("@basekit/core").DeclarativeComponent<ButtonGroupProps>;
//# sourceMappingURL=Button.d.ts.map
import { type ReactNode } from "react";
import type { Size, Tone, Variant } from "@basekit/tokens";
import { type IconSlot } from "../internal";
export type ToggleProps = {
    id?: string;
    className?: string;
    children?: ReactNode;
    text?: ReactNode;
    icon?: IconSlot;
    pressed?: boolean;
    defaultPressed?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    tone?: Tone;
    variant?: Variant;
    size?: Size;
    testId?: string;
    "aria-label"?: string;
    onPressedChange?: (pressed: boolean) => void;
};
export declare const ToggleView: import("react").ForwardRefExoticComponent<ToggleProps & import("react").RefAttributes<HTMLButtonElement>>;
export declare const Toggle: import("@basekit/core").DeclarativeComponent<ToggleProps>;
export type ToggleGroupOption = {
    value: string;
    label?: ReactNode;
    icon?: IconSlot;
    disabled?: boolean;
    "aria-label"?: string;
};
export type ToggleGroupProps = {
    id?: string;
    className?: string;
    type?: "single" | "multiple";
    options: ToggleGroupOption[];
    /** Selected value in `single` mode. */
    value?: string;
    defaultValue?: string;
    /** Selected values in `multiple` mode. */
    values?: string[];
    defaultValues?: string[];
    orientation?: "horizontal" | "vertical";
    disabled?: boolean;
    hidden?: boolean;
    tone?: Tone;
    variant?: Variant;
    size?: Size;
    testId?: string;
    "aria-label"?: string;
    onValueChange?: (value: string) => void;
    onValuesChange?: (values: string[]) => void;
};
export declare const ToggleGroupView: ({ id, className, type, options, value, defaultValue, values, defaultValues, orientation, disabled, hidden, tone, variant, size, testId, onValueChange, onValuesChange, ...rest }: ToggleGroupProps) => import("react").JSX.Element | null;
export declare const ToggleGroup: import("@basekit/core").DeclarativeComponent<ToggleGroupProps>;
//# sourceMappingURL=ToggleGroup.d.ts.map
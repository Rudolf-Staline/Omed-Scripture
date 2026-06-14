import { type ReactNode } from "react";
export type SliderProps = {
    id?: string;
    name?: string;
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    label?: ReactNode;
    helperText?: ReactNode;
    error?: ReactNode;
    showValue?: boolean;
    onValueChange?: (value: number) => void;
    testId?: string;
    className?: string;
};
export declare const SliderView: ({ id, name, label, helperText, error, showValue, onValueChange, testId, className, min, max, step, value, defaultValue, disabled, }: SliderProps) => import("react").JSX.Element;
export declare const Slider: import("@basekit/core").DeclarativeComponent<SliderProps>;
export type RangeSliderValue = [number, number];
export type RangeSliderProps = Omit<SliderProps, "value" | "defaultValue" | "onValueChange" | "label"> & {
    label?: ReactNode;
    /** Distinct labels for each thumb so the two sliders aren't named alike. */
    minLabel?: ReactNode;
    maxLabel?: ReactNode;
    value?: RangeSliderValue;
    defaultValue?: RangeSliderValue;
    onValueChange?: (value: RangeSliderValue) => void;
};
export declare const RangeSliderView: ({ label, minLabel, maxLabel, value, defaultValue, min, max, error, onValueChange, ...props }: RangeSliderProps) => import("react").JSX.Element;
export declare const RangeSlider: import("@basekit/core").DeclarativeComponent<RangeSliderProps>;
//# sourceMappingURL=Slider.d.ts.map
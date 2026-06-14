import type { ReactNode } from "react";
import type { Radius, Shadow, Size, Tone, Variant } from "@basekit/tokens";
import type { UIChild } from "@basekit/core";
/**
 * Props shared by (almost) every component. `className` is the deliberate
 * escape hatch; everyday styling should go through `tone`/`variant`/`size`/etc.
 */
export type BaseComponentProps = {
    id?: string;
    className?: string;
    /** Children accept declarative nodes *or* plain React nodes. */
    children?: UIChild | UIChild[] | ReactNode;
    tone?: Tone;
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    hidden?: boolean;
    /** Maps to `data-testid`. */
    testId?: string;
};
export type RadiusProp = {
    radius?: Radius;
};
export type ShadowProp = {
    shadow?: Shadow;
};
/** Re-exported here so component files import their vocabulary from one place. */
export type { Tone, Variant, Size, Radius, Shadow } from "@basekit/tokens";
//# sourceMappingURL=props.d.ts.map
import { type ReactNode } from "react";
import { type IconName } from "./Icon";
export * from "./props";
export * from "./styles";
export { Icon, type IconName, type IconProps } from "./Icon";
/** An icon slot accepts a built-in icon name or any React node. */
export type IconSlot = IconName | ReactNode;
/** Renders an {@link IconSlot}: string → built-in glyph, otherwise pass-through. */
export declare const renderIcon: (slot: IconSlot | undefined, size?: number | string) => ReactNode;
//# sourceMappingURL=index.d.ts.map
import { isValidElement, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export * from "./props";
export * from "./styles";
export { Icon, type IconName, type IconProps } from "./Icon";

/** An icon slot accepts a built-in icon name or any React node. */
export type IconSlot = IconName | ReactNode;

const iconNames = new Set<string>([
  "filter",
  "undo",
  "close",
  "check",
  "check-circle",
  "info",
  "warning",
  "error",
  "search",
  "plus",
  "calendar",
  "chevron-down",
  "chevron-right",
  "chevron-left",
  "menu",
  "arrow-right",
  "trash",
  "settings",
  "user",
  "external",
  "spinner",
]);

/** Renders an {@link IconSlot}: string → built-in glyph, otherwise pass-through. */
export const renderIcon = (
  slot: IconSlot | undefined,
  size?: number | string,
): ReactNode => {
  if (slot == null || slot === false) return null;
  if (typeof slot === "string" && iconNames.has(slot)) {
    return <Icon name={slot as IconName} size={size} />;
  }
  if (isValidElement(slot)) return slot;
  return slot as ReactNode;
};

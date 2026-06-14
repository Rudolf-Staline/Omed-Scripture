import { type ReactNode } from "react";
import { type IconSlot } from "../internal";
export type TabItem = {
    id: string;
    label: ReactNode;
    icon?: IconSlot;
    content: ReactNode;
    disabled?: boolean;
};
export type TabsProps = {
    items: TabItem[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (id: string) => void;
    className?: string;
};
export declare const TabsView: ({ items, value, defaultValue, onValueChange, className, }: TabsProps) => import("react").JSX.Element;
export declare const Tabs: import("@basekit/core").DeclarativeComponent<TabsProps>;
export type AccordionItem = {
    id: string;
    title: ReactNode;
    content: ReactNode;
};
export type AccordionProps = {
    items: AccordionItem[];
    /** Allow multiple open panels. */
    multiple?: boolean;
    defaultOpen?: string[];
    className?: string;
};
export declare const AccordionView: ({ items, multiple, defaultOpen, className, }: AccordionProps) => import("react").JSX.Element;
export declare const Accordion: import("@basekit/core").DeclarativeComponent<AccordionProps>;
export type DropdownItem = {
    id: string;
    label: ReactNode;
    icon?: IconSlot;
    tone?: "neutral" | "danger";
    onSelect?: () => void;
    disabled?: boolean;
};
export type DropdownProps = {
    trigger: ReactNode;
    items: DropdownItem[];
    align?: "start" | "end";
    className?: string;
};
export declare const DropdownView: ({ trigger, items, align, className, }: DropdownProps) => import("react").JSX.Element;
export declare const Dropdown: import("@basekit/core").DeclarativeComponent<DropdownProps>;
//# sourceMappingURL=Disclosure.d.ts.map
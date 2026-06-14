import { type ReactNode } from "react";
import { type IconSlot } from "../internal";
export type AppShellProps = {
    sidebar?: ReactNode;
    topbar?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    /** Sidebar width, default 16rem. */
    sidebarWidth?: string;
    className?: string;
};
export declare const AppShellView: ({ sidebar, topbar, children, footer, sidebarWidth, className, }: AppShellProps) => import("react").JSX.Element;
export declare const AppShell: import("@basekit/core").DeclarativeComponent<AppShellProps>;
export type SidebarNavItem = {
    id: string;
    label: ReactNode;
    icon?: IconSlot;
    active?: boolean;
    badge?: ReactNode;
    onClick?: () => void;
    href?: string;
};
export type SidebarProps = {
    brand?: ReactNode;
    items?: SidebarNavItem[];
    footer?: ReactNode;
    children?: ReactNode;
    className?: string;
};
export declare const SidebarView: ({ brand, items, footer, children, className, }: SidebarProps) => import("react").JSX.Element;
export declare const Sidebar: import("@basekit/core").DeclarativeComponent<SidebarProps>;
export type TopbarProps = {
    title?: ReactNode;
    start?: ReactNode;
    children?: ReactNode;
    actions?: ReactNode;
    className?: string;
};
export declare const TopbarView: ({ title, start, children, actions, className, }: TopbarProps) => import("react").JSX.Element;
export declare const Topbar: import("@basekit/core").DeclarativeComponent<TopbarProps>;
export type PageHeaderProps = {
    title?: ReactNode;
    description?: ReactNode;
    breadcrumb?: ReactNode;
    actions?: ReactNode;
    className?: string;
};
export declare const PageHeaderView: ({ title, description, breadcrumb, actions, className, }: PageHeaderProps) => import("react").JSX.Element;
export declare const PageHeader: import("@basekit/core").DeclarativeComponent<PageHeaderProps>;
//# sourceMappingURL=Shell.d.ts.map
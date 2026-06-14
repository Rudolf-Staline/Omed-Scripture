import { type ReactNode } from "react";
import { type SidebarNavItem } from "./Shell";
export type PageViewProps = {
    title?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    children?: ReactNode;
    className?: string;
};
export declare const PageView: ({ title, description, actions, header, footer, children, className, }: PageViewProps) => import("react").JSX.Element;
export type DashboardLayoutProps = {
    brand?: ReactNode;
    navItems?: SidebarNavItem[];
    sidebar?: ReactNode;
    sidebarFooter?: ReactNode;
    topbarTitle?: ReactNode;
    topbarActions?: ReactNode;
    topbarStart?: ReactNode;
    footer?: ReactNode;
    children?: ReactNode;
};
export declare const DashboardLayout: ({ brand, navItems, sidebar, sidebarFooter, topbarTitle, topbarActions, topbarStart, footer, children, }: DashboardLayoutProps) => import("react").JSX.Element;
export type AuthLayoutProps = {
    brand?: ReactNode;
    illustration?: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
};
export declare const AuthLayout: ({ brand, illustration, title, description, children, footer, }: AuthLayoutProps) => import("react").JSX.Element;
export type ReaderLayoutProps = {
    navigation?: ReactNode;
    secondaryPanel?: ReactNode;
    focusMode?: boolean;
    children?: ReactNode;
};
export declare const ReaderLayout: ({ navigation, secondaryPanel, focusMode, children, }: ReaderLayoutProps) => import("react").JSX.Element;
export type SettingsLayoutProps = {
    nav?: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
};
export declare const SettingsLayout: ({ nav, title, description, children, }: SettingsLayoutProps) => import("react").JSX.Element;
export type FormLayoutProps = {
    title?: ReactNode;
    description?: ReactNode;
    sidebar?: ReactNode;
    children?: ReactNode;
};
export declare const FormLayout: ({ title, description, sidebar, children, }: FormLayoutProps) => import("react").JSX.Element;
//# sourceMappingURL=Layouts.d.ts.map
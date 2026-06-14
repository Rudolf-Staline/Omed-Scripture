import { type ReactNode } from "react";
import { cn } from "@basekit/core";
import {
  AppShellView,
  SidebarView,
  TopbarView,
  type SidebarNavItem,
} from "./Shell";

/* PageView — the shell node rendered by `Page({...})` ------------------ */

export type PageViewProps = {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export const PageView = ({
  title,
  description,
  actions,
  header,
  footer,
  children,
  className,
}: PageViewProps) => (
  <div className={cn("mx-auto w-full max-w-6xl space-y-6", className)}>
    {(title != null ||
      description != null ||
      actions != null ||
      header != null) && (
      <div className="space-y-3">
        {header}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            {title != null && (
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
            )}
            {description != null && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actions != null && (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          )}
        </div>
      </div>
    )}
    <div className="space-y-6">{children}</div>
    {footer != null && (
      <div className="border-t border-border pt-4">{footer}</div>
    )}
  </div>
);

/* DashboardLayout ------------------------------------------------------ */

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

export const DashboardLayout = ({
  brand,
  navItems,
  sidebar,
  sidebarFooter,
  topbarTitle,
  topbarActions,
  topbarStart,
  footer,
  children,
}: DashboardLayoutProps) => (
  <AppShellView
    sidebar={
      sidebar ?? (
        <SidebarView brand={brand} items={navItems} footer={sidebarFooter} />
      )
    }
    topbar={
      <TopbarView
        title={topbarTitle}
        start={topbarStart}
        actions={topbarActions}
      />
    }
    footer={footer}
  >
    {children}
  </AppShellView>
);

/* AuthLayout ----------------------------------------------------------- */

export type AuthLayoutProps = {
  brand?: ReactNode;
  illustration?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
};

export const AuthLayout = ({
  brand,
  illustration,
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) => (
  <div className="flex min-h-screen bg-background text-foreground">
    {illustration != null && (
      <div className="hidden flex-1 items-center justify-center bg-primary-soft p-12 lg:flex">
        {illustration}
      </div>
    )}
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {brand != null && <div className="flex justify-center">{brand}</div>}
        <div className="space-y-1 text-center">
          {title != null && (
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          )}
          {description != null && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
          {children}
        </div>
        {footer != null && (
          <div className="text-center text-bk-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ReaderLayout --------------------------------------------------------- */

export type ReaderLayoutProps = {
  navigation?: ReactNode;
  secondaryPanel?: ReactNode;
  focusMode?: boolean;
  children?: ReactNode;
};

export const ReaderLayout = ({
  navigation,
  secondaryPanel,
  focusMode,
  children,
}: ReaderLayoutProps) => (
  <div className="min-h-screen bg-background text-foreground">
    <div
      className={cn(
        "mx-auto grid gap-8 p-6",
        focusMode
          ? "max-w-3xl grid-cols-1"
          : "max-w-7xl lg:grid-cols-[15rem_minmax(0,1fr)_18rem]",
      )}
    >
      {!focusMode && navigation != null && (
        <nav className="hidden lg:block">
          <div className="sticky top-6 space-y-1">{navigation}</div>
        </nav>
      )}
      <main className="mx-auto w-full max-w-prose">
        <article className="prose-reader space-y-5 text-[1.05rem] leading-relaxed text-foreground">
          {children}
        </article>
      </main>
      {!focusMode && secondaryPanel != null && (
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-4 text-bk-sm text-muted-foreground">
            {secondaryPanel}
          </div>
        </aside>
      )}
    </div>
  </div>
);

/* SettingsLayout ------------------------------------------------------- */

export type SettingsLayoutProps = {
  nav?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
};

export const SettingsLayout = ({
  nav,
  title,
  description,
  children,
}: SettingsLayoutProps) => (
  <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
    <div className="space-y-1">
      {title != null && (
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      )}
      {description != null && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
    <div className="grid gap-8 md:grid-cols-[14rem_minmax(0,1fr)]">
      {nav != null && <aside className="space-y-1">{nav}</aside>}
      <div className="min-w-0 space-y-6">{children}</div>
    </div>
  </div>
);

/* FormLayout ----------------------------------------------------------- */

export type FormLayoutProps = {
  title?: ReactNode;
  description?: ReactNode;
  sidebar?: ReactNode;
  children?: ReactNode;
};

export const FormLayout = ({
  title,
  description,
  sidebar,
  children,
}: FormLayoutProps) => (
  <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6">
    <div className="space-y-1">
      {title != null && (
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      )}
      {description != null && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
    <div
      className={cn(
        sidebar != null ? "grid gap-8 md:grid-cols-[minmax(0,1fr)_16rem]" : "",
      )}
    >
      <div className="min-w-0 space-y-6">{children}</div>
      {sidebar != null && <aside className="space-y-4">{sidebar}</aside>}
    </div>
  </div>
);

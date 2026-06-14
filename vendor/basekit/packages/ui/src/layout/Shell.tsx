import { type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";
import { renderIcon, type IconSlot } from "../internal";

/* AppShell — sidebar + topbar + content -------------------------------- */

export type AppShellProps = {
  sidebar?: ReactNode;
  topbar?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** Sidebar width, default 16rem. */
  sidebarWidth?: string;
  className?: string;
};

export const AppShellView = ({
  sidebar,
  topbar,
  children,
  footer,
  sidebarWidth = "16rem",
  className,
}: AppShellProps) => (
  <div
    className={cn("flex min-h-screen bg-background text-foreground", className)}
  >
    {sidebar != null && (
      <aside
        className="hidden shrink-0 border-r border-border bg-surface lg:block"
        style={{ width: sidebarWidth }}
      >
        <div className="sticky top-0 flex h-screen flex-col overflow-y-auto">
          {sidebar}
        </div>
      </aside>
    )}
    <div className="flex min-w-0 flex-1 flex-col">
      {topbar != null && (
        <header className="sticky top-0 z-sticky border-b border-border bg-surface/85 backdrop-blur">
          {topbar}
        </header>
      )}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      {footer != null && (
        <footer className="border-t border-border px-6 py-4 text-bk-sm text-muted-foreground">
          {footer}
        </footer>
      )}
    </div>
  </div>
);

export const AppShell = createComponent<AppShellProps>("AppShell");

/* Sidebar + nav items -------------------------------------------------- */

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

export const SidebarView = ({
  brand,
  items,
  footer,
  children,
  className,
}: SidebarProps) => (
  <div className={cn("flex h-full flex-col gap-1 p-4", className)}>
    {brand != null && <div className="mb-4 px-2 py-1">{brand}</div>}
    <nav className="flex flex-1 flex-col gap-0.5">
      {items?.map((item) => {
        const content = (
          <>
            {renderIcon(item.icon)}
            <span className="flex-1 truncate text-left">{item.label}</span>
            {item.badge != null && (
              <span className="text-bk-xs">{item.badge}</span>
            )}
          </>
        );
        const classes = cn(
          "flex items-center gap-2.5 rounded-md px-3 py-2 text-bk-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          item.active
            ? "bg-primary-soft text-primary"
            : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
        );
        return item.href ? (
          <a
            key={item.id}
            href={item.href}
            className={classes}
            aria-current={item.active ? "page" : undefined}
          >
            {content}
          </a>
        ) : (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            className={classes}
            aria-current={item.active ? "page" : undefined}
          >
            {content}
          </button>
        );
      })}
      {children}
    </nav>
    {footer != null && (
      <div className="mt-auto border-t border-border pt-3">{footer}</div>
    )}
  </div>
);

export const Sidebar = createComponent<SidebarProps>("Sidebar");

/* Topbar --------------------------------------------------------------- */

export type TopbarProps = {
  title?: ReactNode;
  start?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export const TopbarView = ({
  title,
  start,
  children,
  actions,
  className,
}: TopbarProps) => (
  <div className={cn("flex h-16 items-center gap-4 px-4 sm:px-6", className)}>
    {start}
    {title != null && (
      <span className="font-semibold text-foreground">{title}</span>
    )}
    <div className="flex-1">{children}</div>
    {actions != null && (
      <div className="flex items-center gap-2">{actions}</div>
    )}
  </div>
);

export const Topbar = createComponent<TopbarProps>("Topbar");

/* PageHeader ----------------------------------------------------------- */

export type PageHeaderProps = {
  title?: ReactNode;
  description?: ReactNode;
  breadcrumb?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export const PageHeaderView = ({
  title,
  description,
  breadcrumb,
  actions,
  className,
}: PageHeaderProps) => (
  <div className={cn("space-y-2", className)}>
    {breadcrumb != null && (
      <div className="text-bk-xs text-muted-foreground">{breadcrumb}</div>
    )}
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
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </div>
  </div>
);

export const PageHeader = createComponent<PageHeaderProps>("PageHeader");

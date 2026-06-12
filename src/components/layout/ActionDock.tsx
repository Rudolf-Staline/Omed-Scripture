import React from 'react';
import clsx from 'clsx';

interface ActionDockProps {
  children: React.ReactNode;
  label: string;
  className?: string;
  mobile?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export const ActionDock: React.FC<ActionDockProps> = ({ children, label, className, mobile = false, onClick }) => (
  <nav
    aria-label={label}
    onClick={onClick}
    className={clsx(
      mobile
        ? 'mobile-action-dock fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-[1.6rem] border border-border bg-bg-card/95 px-2 py-2 shadow-[0_20px_70px_-36px_var(--color-shadow)] backdrop-blur-xl lg:hidden'
        : 'inline-flex items-center gap-1 rounded-2xl border border-border bg-bg-card/75 p-1 shadow-sm',
      className
    )}
  >
    {children}
  </nav>
);

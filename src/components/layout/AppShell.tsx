import React from 'react';
import clsx from 'clsx';

interface AppShellProps {
  rail: React.ReactNode;
  mobileTop?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ rail, mobileTop, children, className }) => (
  <div className={clsx('min-h-screen overflow-x-hidden bg-bg-primary text-text-primary font-sans lg:flex', className)}>
    {rail}
    <div className="relative flex min-w-0 flex-1 flex-col">
      {mobileTop}
      <main className="scriptorium-main relative flex-1 overflow-y-auto pb-28 lg:pb-0" aria-label="Contenu principal">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_78%_4%,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_30rem),linear-gradient(120deg,transparent_0%,color-mix(in_srgb,var(--color-bg-secondary)_55%,transparent)_100%)]" />
        <div className="scriptorium-page-frame mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:px-10 md:py-9 lg:px-14 lg:py-11">
          {children}
        </div>
      </main>
    </div>
  </div>
);

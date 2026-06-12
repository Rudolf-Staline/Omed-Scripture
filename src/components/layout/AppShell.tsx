import React from 'react';
import clsx from 'clsx';

interface AppShellProps {
  rail: React.ReactNode;
  mobileTop?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ rail, mobileTop, children, className }) => (
  <div className={clsx('codex-shell min-h-screen overflow-x-hidden bg-bg-primary text-text-primary font-sans lg:grid lg:grid-cols-[6.25rem_minmax(0,1fr)]', className)}>
    <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_6%,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent_28rem),radial-gradient(circle_at_88%_14%,color-mix(in_srgb,var(--color-olive)_14%,transparent),transparent_34rem),linear-gradient(112deg,var(--color-bg-deep)_0%,var(--color-bg)_42%,color-mix(in_srgb,var(--color-bg-secondary)_70%,var(--color-bg))_100%)]" />
    {rail}
    <div className="relative flex min-w-0 flex-col">
      {mobileTop}
      <main className="codex-stage relative min-h-screen flex-1 overflow-y-auto pb-32 lg:pb-0" aria-label="Contenu principal">
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-accent-gold/25 to-transparent lg:block" />
        <div className="mx-auto w-full max-w-[96rem] px-4 py-5 sm:px-6 md:px-8 md:py-8 lg:px-10 xl:px-14 xl:py-12">
          {children}
        </div>
      </main>
    </div>
  </div>
);

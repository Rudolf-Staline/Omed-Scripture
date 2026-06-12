import React from 'react';
import clsx from 'clsx';

interface AppShellProps {
  rail: React.ReactNode;
  mobileTop?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ rail, mobileTop, children, className }) => (
  <div className={clsx('min-h-screen overflow-x-hidden bg-bg-primary text-text-primary font-sans lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]', className)}>
    {rail}
    <div className="relative flex min-w-0 flex-col">
      {mobileTop}
      <main className="relative min-h-screen flex-1 overflow-y-auto pb-28 lg:pb-0" aria-label="Contenu principal">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 md:px-8 lg:px-10 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  </div>
);

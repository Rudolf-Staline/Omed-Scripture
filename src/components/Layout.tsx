import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-bg-primary text-text-primary font-sans lg:flex">
      <Sidebar />
      <main className="relative min-w-0 flex-1 overflow-y-auto pb-24 lg:pb-0">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_72%_8%,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_28rem)]" />
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 md:px-10 md:py-9 lg:px-14 lg:py-11">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

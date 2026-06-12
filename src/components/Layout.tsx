import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileTopBar } from './MobileTopBar';

/**
 * Shell applicatif Scriptorium Atlas. Trois zones explicites : le rail de
 * navigation (Sidebar), la colonne de contenu, et — sur mobile — une barre
 * d'application supérieure. La colonne porte le canevas de page centré.
 */
export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-bg-primary text-text-primary font-sans lg:flex">
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="relative flex-1 overflow-y-auto pb-24 lg:pb-0">
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_78%_4%,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_30rem)]" />
          <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 md:px-10 md:py-9 lg:px-14 lg:py-11 xl:max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

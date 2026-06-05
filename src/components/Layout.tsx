import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans overflow-x-hidden lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto bg-bg-primary pb-20 lg:pb-0">
        <div className="max-w-5xl mx-auto w-full px-4 py-6 pb-24 sm:px-6 md:px-10 md:py-10 md:pb-10 lg:px-14 lg:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

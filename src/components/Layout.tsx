import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AppShell } from './layout/AppShell';
import { OfflineBanner } from './OfflineBanner';

export const Layout: React.FC = () => (
  <AppShell rail={<Sidebar />}>
    <OfflineBanner />
    <Outlet />
  </AppShell>
);

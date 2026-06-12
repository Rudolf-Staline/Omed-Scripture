import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AppShell } from './layout/AppShell';

export const Layout: React.FC = () => (
  <AppShell rail={<Sidebar />}>
    <Outlet />
  </AppShell>
);

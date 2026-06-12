import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileTopBar } from './MobileTopBar';
import { AppShell } from './layout/AppShell';

export const Layout: React.FC = () => (
  <AppShell rail={<Sidebar />} mobileTop={<MobileTopBar />}>
    <Outlet />
  </AppShell>
);

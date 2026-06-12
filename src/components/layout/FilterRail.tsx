import React from 'react';
import clsx from 'clsx';

interface FilterRailProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FilterRail: React.FC<FilterRailProps> = ({ title, children, className }) => (
  <aside className={clsx('filter-rail rounded-[1.5rem] border border-border bg-bg-card/62 p-4', className)}>
    <p className="omed-kicker mb-4">{title}</p>
    <div className="space-y-4">{children}</div>
  </aside>
);

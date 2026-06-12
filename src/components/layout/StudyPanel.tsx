import React from 'react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StudyPanelProps {
  eyebrow?: string;
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const StudyPanel: React.FC<StudyPanelProps> = ({ eyebrow, title, icon: Icon, children, footer, className }) => (
  <section className={clsx('study-panel relative overflow-hidden rounded-[1.6rem] border border-border bg-bg-card/68 p-4 shadow-[0_22px_70px_-55px_var(--color-shadow)] sm:p-5', className)}>
    <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-accent-gold/45 to-transparent" />
    <header className="mb-4 flex items-start gap-3">
      {Icon && <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-accent-gold/25 bg-accent-gold/10 text-accent-gold"><Icon size={18} strokeWidth={1.5} /></span>}
      <div className="min-w-0">
        {eyebrow && <p className="omed-kicker mb-1">{eyebrow}</p>}
        <h2 className="font-display text-xl font-semibold text-text-primary">{title}</h2>
      </div>
    </header>
    <div>{children}</div>
    {footer && <footer className="mt-4 border-t border-border/70 pt-4">{footer}</footer>}
  </section>
);

import React from 'react';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface ReferenceCardProps {
  reference: string;
  meta?: string;
  text: React.ReactNode;
  actions?: React.ReactNode;
  onOpen?: () => void;
  openLabel?: string;
  className?: string;
}

export const ReferenceCard: React.FC<ReferenceCardProps> = ({ reference, meta, text, actions, onOpen, openLabel = 'Ouvrir le contexte', className }) => (
  <article className={clsx('reference-card group relative overflow-hidden rounded-[1.35rem] border border-border bg-bg-card/70 p-4 transition-all hover:border-accent-gold/35 sm:p-5', className)}>
    <div className="pointer-events-none absolute bottom-0 left-5 top-5 w-px bg-gradient-to-b from-accent-gold/35 to-transparent" />
    <div className="mb-3 flex flex-col gap-3 pl-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h3 className="font-display text-lg font-semibold text-text-primary">{reference}</h3>
        {meta && <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">{meta}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </div>
    <div className="pl-4 font-body text-sm leading-7 text-text-secondary sm:text-base">{text}</div>
    {onOpen && (
      <button type="button" onClick={onOpen} className="ml-4 mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-brown transition-colors hover:text-accent-gold">
        {openLabel} <ChevronRight size={15} />
      </button>
    )}
  </article>
);

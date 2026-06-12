import React from 'react';
import clsx from 'clsx';

interface VerseCardProps {
  number?: number;
  selected?: boolean;
  annotated?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
  ariaLabel: string;
}

export const VerseCard: React.FC<VerseCardProps> = ({ number, selected, annotated, children, className, onClick, onKeyDown, ariaLabel }) => (
  <div
    className={clsx('verse-card group/verse relative -mx-2 flex cursor-pointer gap-3 rounded-xl px-2 py-1.5 hover:bg-bg-card/35 focus:bg-bg-card/45 focus:outline-none focus:ring-1 focus:ring-accent-gold/40 focus-within:bg-bg-card/45 sm:-mx-3 sm:gap-4 sm:px-3', selected && 'bg-bg-card/45', className)}
    role="button"
    tabIndex={0}
    aria-pressed={selected}
    aria-label={ariaLabel}
    onClick={onClick}
    onKeyDown={onKeyDown}
  >
    {number !== undefined && (
      <span className="relative flex w-6 shrink-0 select-none justify-end pt-[0.45em] font-mono text-[0.66em] font-semibold leading-none text-accent-gold/70 sm:w-8" aria-hidden="true">
        {number}
        {annotated && <span className="absolute -right-1.5 top-[0.4em] h-1.5 w-1.5 rounded-full bg-accent-gold/70" />}
      </span>
    )}
    {children}
  </div>
);

import React from 'react';
import clsx from 'clsx';

type DeckVariant = 'atlas' | 'notebook' | 'reader';

interface ContentDeckProps {
  lead?: React.ReactNode;
  rail?: React.ReactNode;
  children: React.ReactNode;
  variant?: DeckVariant;
  className?: string;
  railLabel?: string;
}

const variantClasses: Record<DeckVariant, string> = {
  atlas: 'lg:grid-cols-[minmax(0,1fr)_20rem]',
  notebook: 'lg:grid-cols-[18rem_minmax(0,1fr)]',
  reader: 'xl:grid-cols-[16rem_minmax(0,1fr)_19rem]',
};

export const ContentDeck: React.FC<ContentDeckProps> = ({ lead, rail, children, variant = 'atlas', className, railLabel = 'Panneau contextuel' }) => (
  <div className={clsx('content-deck space-y-6', className)}>
    {lead && <div className="content-deck__lead">{lead}</div>}
    <div className={clsx('grid gap-6 lg:items-start', variantClasses[variant])}>
      {variant === 'notebook' && rail && (
        <aside className="content-deck__rail lg:sticky lg:top-6" aria-label={railLabel}>{rail}</aside>
      )}
      <div className="min-w-0 content-deck__body">{children}</div>
      {variant !== 'notebook' && rail && (
        <aside className="content-deck__rail lg:sticky lg:top-6" aria-label={railLabel}>{rail}</aside>
      )}
    </div>
  </div>
);

import React from 'react';

interface LoadingStateProps {
  title?: string;
  message?: string;
  compact?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Chargement en cours',
  message = 'Un instant, nous préparons le contenu.',
  compact = false,
}) => {
  return (
    <div role="status" aria-live="polite" className={compact ? 'empty-state px-5 py-10 text-center' : 'empty-state px-6 py-16 text-center'}>
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-accent-gold/25 bg-accent-gold/8" aria-hidden="true">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent-gold" />
      </div>
      <h2 className="font-display text-xl font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{message}</p>
      <span className="sr-only">Chargement</span>
    </div>
  );
};

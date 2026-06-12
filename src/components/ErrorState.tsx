import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Impossible de charger cette page',
  message = 'Veuillez réessayer dans quelques instants.',
  actionLabel = 'Réessayer',
  onAction,
  compact = false,
}) => {
  return (
    <div role="alert" className={compact ? 'empty-state px-5 py-10 text-center' : 'empty-state px-6 py-16 text-center'}>
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--color-danger)]/30 bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)]">
        <AlertTriangle size={24} aria-hidden="true" />
      </div>
      <h2 className="font-display text-xl font-semibold text-text-primary">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-secondary">{message}</p>
      {onAction && (
        <button type="button" onClick={onAction} className="omed-button-ghost mt-6 px-4 py-2 text-sm font-semibold">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

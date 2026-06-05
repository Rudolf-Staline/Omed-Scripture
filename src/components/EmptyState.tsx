import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  compact = false,
}) => {
  return (
    <div className={compact ? 'py-10 text-center' : 'py-16 text-center'}>
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg-card/70 text-accent-gold">
        <Inbox size={24} aria-hidden="true" />
      </div>
      <h2 className="mb-2 font-display text-2xl font-semibold text-text-primary">{title}</h2>
      <p className="mx-auto max-w-xl text-sm leading-6 text-text-secondary">{message}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="omed-button-ghost mt-6 px-6 py-2.5 font-semibold">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

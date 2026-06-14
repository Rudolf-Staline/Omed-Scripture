import React from 'react';
import { Inbox } from 'lucide-react';
import { Button, EmptyState as BkEmptyState } from '../ui';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

/**
 * État vide générique — désormais construit sur `EmptyState` de BaseKit.
 * L'API publique (title / message / actionLabel / onAction / compact) reste
 * inchangée pour les appelants ; l'icône Omed (lucide `Inbox`) est conservée et
 * les couleurs suivent l'ambiance active via le pont de tokens BaseKit.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  compact = false,
}) => (
  <BkEmptyState
    title={title}
    description={message}
    icon={<Inbox size={22} aria-hidden="true" />}
    className={compact ? 'px-5 py-10' : undefined}
    action={
      actionLabel && onAction ? (
        <Button variant="ghost" tone="neutral" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : undefined
    }
  />
);

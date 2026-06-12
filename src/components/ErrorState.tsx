import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { StudyPanel } from './layout/StudyPanel';

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Carte indisponible',
  message = 'Veuillez réessayer dans quelques instants.',
  actionLabel = 'Réessayer',
  onAction,
  compact = false,
}) => (
  <StudyPanel title={title} icon={AlertTriangle} className={compact ? 'px-5 py-8 text-center' : 'px-6 py-12 text-center'}>
    <div role="alert">
      <p className="mx-auto max-w-xl text-sm leading-6 text-text-secondary">{message}</p>
      {onAction && (
        <button type="button" onClick={onAction} className="omed-button-ghost mt-6 px-4 py-2 text-sm font-semibold">
          {actionLabel}
        </button>
      )}
    </div>
  </StudyPanel>
);

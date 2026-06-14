import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { StudyPanel } from './layout/StudyPanel';
import { Button } from '../ui';

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

/**
 * État d'erreur générique. Le panneau Omed (`StudyPanel`) est conservé pour
 * l'identité visuelle ; le bouton « Réessayer » utilise désormais le `Button`
 * de BaseKit.
 */
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
        <div className="mt-6 flex justify-center">
          <Button variant="ghost" tone="neutral" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  </StudyPanel>
);

import React from 'react';
import { Compass } from 'lucide-react';
import { StudyPanel } from './layout/StudyPanel';

interface LoadingStateProps {
  title?: string;
  message?: string;
  compact?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Ouverture du scriptorium',
  message = 'Nous préparons le passage et ses marges.',
  compact = false,
}) => (
  <StudyPanel title={title} icon={Compass} className={compact ? 'px-5 py-8 text-center' : 'px-6 py-12 text-center'}>
    <div role="status" aria-live="polite">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-accent-gold/25 bg-accent-gold/8" aria-hidden="true">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent-gold" />
      </div>
      <p className="text-sm leading-6 text-text-secondary">{message}</p>
      <span className="sr-only">Chargement</span>
    </div>
  </StudyPanel>
);

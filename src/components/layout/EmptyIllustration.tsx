import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface EmptyIllustrationProps {
  icon: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  to?: string;
  onAction?: () => void;
}

/**
 * État vide orienté action, avec un médaillon céleste (voûte étoilée). Donne
 * aux pages sans contenu une vraie porte d'entrée plutôt qu'un message nu.
 */
export const EmptyIllustration: React.FC<EmptyIllustrationProps> = ({ icon: Icon, title, message, actionLabel, to, onAction }) => (
  <div className="empty-state flex flex-col items-center px-6 py-14 text-center">
    <span className="relative mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-accent-gold/25 bg-accent-gold/10 text-accent-gold">
      <span className="omed-starfield absolute inset-0" aria-hidden="true" />
      <Icon size={26} strokeWidth={1.5} className="relative" aria-hidden="true" />
    </span>
    <h2 className="mb-2 font-display text-2xl font-semibold text-text-primary">{title}</h2>
    <p className="mx-auto max-w-md text-sm leading-6 text-text-secondary">{message}</p>
    {actionLabel && to && (
      <Link to={to} className="omed-button-primary mt-6 px-6 py-2.5 text-sm">{actionLabel}</Link>
    )}
    {actionLabel && onAction && !to && (
      <button type="button" onClick={onAction} className="omed-button-primary mt-6 px-6 py-2.5 text-sm">{actionLabel}</button>
    )}
  </div>
);

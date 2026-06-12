import React from 'react';
import { BookOpenText, ChevronDown } from 'lucide-react';

interface PassageSelectorButtonProps {
  bookName: string;
  chapter: number;
  translationLabel: string;
  onClick: () => void;
}

/**
 * Bouton principal du lecteur. Remplace les anciens menus déroulants : il affiche
 * le passage courant (« Jean 3 · LSG ») et ouvre le sélecteur biblique au tap.
 */
export const PassageSelectorButton: React.FC<PassageSelectorButtonProps> = ({
  bookName,
  chapter,
  translationLabel,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-haspopup="dialog"
    className="flex min-h-12 items-center gap-2.5 rounded-2xl border border-border bg-bg-card px-4 text-left transition-colors hover:border-accent-gold/45"
  >
    <BookOpenText size={18} className="text-accent-gold" />
    <span className="min-w-0">
      <span className="block truncate text-base font-bold leading-tight text-text-primary">{bookName} {chapter}</span>
      <span className="block text-xs font-semibold uppercase tracking-wide text-text-muted">{translationLabel}</span>
    </span>
    <ChevronDown size={18} className="ml-1 shrink-0 text-text-muted" />
  </button>
);

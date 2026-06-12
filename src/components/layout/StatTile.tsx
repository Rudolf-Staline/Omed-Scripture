import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  hint?: string;
}

/**
 * Tuile de donnée personnelle (série de lecture, notes, prières…). Brique de
 * composition de la zone « Aujourd'hui » de l'accueil.
 */
export const StatTile: React.FC<StatTileProps> = ({ icon: Icon, label, value, hint }) => (
  <div className="omed-card flex items-center gap-3 p-3.5">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-gold/25 bg-accent-gold/10 text-accent-gold">
      <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
    </span>
    <span className="min-w-0">
      <span className="block font-display text-xl leading-none text-text-primary">{value}</span>
      <span className="mt-1 block truncate text-xs text-text-muted">{hint ?? label}</span>
    </span>
  </div>
);

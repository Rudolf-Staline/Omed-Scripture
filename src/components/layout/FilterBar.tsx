import React from 'react';
import clsx from 'clsx';

interface FilterBarProps {
  label?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Rail de filtres réutilisable (Notes, Recherche, Prière). Aligne un libellé
 * et une rangée de contrôles défilable horizontalement sur mobile, au lieu de
 * réimplémenter une barre de filtres ad hoc par page.
 */
export const FilterBar: React.FC<FilterBarProps> = ({ label, className, children }) => (
  <div className={clsx('flex flex-wrap items-center gap-2', className)} role="group" aria-label={label ?? 'Filtres'}>
    {label && (
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{label}</span>
    )}
    {children}
  </div>
);

interface FilterChipProps {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  'aria-label'?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({ active = false, onClick, children, ...rest }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    aria-label={rest['aria-label']}
    className={clsx(
      'min-h-9 rounded-full border px-3.5 text-sm font-semibold transition-colors',
      active
        ? 'border-accent-gold/45 bg-accent-gold/12 text-accent-gold'
        : 'border-border bg-bg-card/55 text-text-secondary hover:border-accent-gold/30 hover:text-text-primary'
    )}
  >
    {children}
  </button>
);

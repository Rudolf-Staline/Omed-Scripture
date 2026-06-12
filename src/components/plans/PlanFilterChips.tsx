import React from 'react';
import clsx from 'clsx';

interface ChipOption {
  id: string;
  label: string;
}

interface PlanFilterChipsProps {
  label: string;
  options: ChipOption[];
  value: string;
  onChange: (id: string) => void;
}

export const PlanFilterChips: React.FC<PlanFilterChipsProps> = ({ label, options, value, onChange }) => (
  <div>
    <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-text-muted">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={clsx(
            'min-h-9 rounded-full border px-3 text-sm font-semibold transition-colors',
            value === option.id ? 'border-accent-gold/50 bg-accent-gold/14 text-accent-gold' : 'border-border bg-bg-card text-text-secondary hover:text-text-primary'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

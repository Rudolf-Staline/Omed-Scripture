import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface PageHeroProps {
  kicker: string;
  title: string;
  intro?: string;
  icon?: LucideIcon;
  /** Actions optionnelles alignées à droite sur desktop. */
  actions?: React.ReactNode;
  /** Contenu additionnel sous l'intro (stats, méta…). */
  children?: React.ReactNode;
}

/**
 * Bloc d'entrée éditorial commun à toutes les pages. Compose un en-tête de
 * « marge de application » : filet vertical, kicker, grand titre serif,
 * intro, et un emplacement d'actions. Donne aux pages un rythme éditorial
 * homogène plutôt qu'un titre nu par page.
 */
export const PageHero: React.FC<PageHeroProps> = ({ kicker, title, intro, icon: Icon, actions, children }) => (
  <section className="omed-panel relative overflow-hidden p-6 md:p-8">
    <div className="omed-starfield pointer-events-none absolute inset-0" aria-hidden="true" />
    <div className="pointer-events-none absolute inset-y-6 left-6 hidden w-px bg-gradient-to-b from-transparent via-accent-gold/40 to-transparent sm:block" />
    <div className="relative sm:pl-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="omed-kicker mb-3">{kicker}</p>
          <h1 className="flex items-center gap-3 font-display text-3xl font-semibold leading-tight tracking-tight text-text-primary md:text-4xl">
            {Icon && <Icon className="shrink-0 text-accent-gold" strokeWidth={1.5} aria-hidden="true" />}
            <span className="text-balance">{title}</span>
          </h1>
          {intro && <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary md:text-base">{intro}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 md:justify-end">{actions}</div>}
      </div>
      {children && <div className="mt-6">{children}</div>}
    </div>
  </section>
);

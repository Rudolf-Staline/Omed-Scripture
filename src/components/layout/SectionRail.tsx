import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface SectionRailProps {
  title: string;
  /** Lien « tout voir » optionnel. */
  to?: string;
  actionLabel?: string;
  kicker?: string;
  children: React.ReactNode;
}

/**
 * Section titrée du canevas, avec un lien d'action discret. Structure les
 * zones de l'accueil et des pages de carnet en blocs nommés cohérents.
 */
export const SectionRail: React.FC<SectionRailProps> = ({ title, to, actionLabel = 'Tout voir', kicker, children }) => (
  <section className="omed-panel-soft p-5 md:p-6">
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {kicker && <p className="omed-kicker mb-1.5">{kicker}</p>}
        <h2 className="font-display text-xl text-text-primary md:text-2xl">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="inline-flex items-center gap-1 text-sm font-semibold text-accent-brown transition-colors hover:text-accent-gold">
          {actionLabel}
          <ChevronRight size={15} />
        </Link>
      )}
    </div>
    {children}
  </section>
);

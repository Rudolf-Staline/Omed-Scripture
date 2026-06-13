import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, Compass, Home, Search } from 'lucide-react';
import { PageCanvas } from '../../components/layout/PageCanvas';

export const NotFoundPage: React.FC = () => (
  <PageCanvas width="reading">
    <section className="empty-state flex flex-col items-center px-6 py-14 text-center">
      <span className="relative mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-accent-gold/25 bg-accent-gold/10 text-accent-gold">
        <span className="omed-starfield absolute inset-0" aria-hidden="true" />
        <Compass size={26} strokeWidth={1.5} className="relative" aria-hidden="true" />
      </span>
      <p className="mb-3 text-sm uppercase tracking-[0.18em] text-text-muted">Erreur 404</p>
      <h1 className="mb-2 font-display text-2xl font-semibold text-text-primary">Page introuvable</h1>
      <p className="mx-auto max-w-md text-sm leading-6 text-text-secondary">
        Cette adresse ne correspond à aucune page d’Omed Scripture. Choisissez un point de reprise pour continuer sans perdre votre navigation.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="omed-button-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"><Home size={16} /> Accueil</Link>
        <Link to="/reader" className="omed-button-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm"><BookOpenText size={16} /> Bible</Link>
        <Link to="/search" className="omed-button-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm"><Search size={16} /> Recherche</Link>
      </div>
    </section>
  </PageCanvas>
);

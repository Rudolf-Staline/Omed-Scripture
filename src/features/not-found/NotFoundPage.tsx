import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <div className="mx-auto max-w-2xl py-20 text-center">
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-accent-gold/30 bg-accent-gold/10 text-accent-gold">
      <BookOpenText size={28} strokeWidth={1.5} />
    </div>
    <p className="mb-2 text-sm uppercase tracking-[0.18em] text-text-muted">Erreur 404</p>
    <h1 className="font-display text-3xl font-bold text-text-primary">Page introuvable</h1>
    <p className="mx-auto mt-4 max-w-md text-text-secondary">
      Cette adresse ne correspond à aucune page d’Omed Scripture. Revenez à l’accueil pour reprendre votre lecture.
    </p>
    <Link
      to="/"
      className="omed-button-primary mt-8 px-5 py-3"
    >
      <Home size={18} />
      Retour à l’accueil
    </Link>
  </div>
);

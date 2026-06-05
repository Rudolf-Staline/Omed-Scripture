import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <div className="mx-auto max-w-2xl py-20 text-center">
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-bg-card text-accent-gold">
      <BookOpenText size={28} strokeWidth={1.5} />
    </div>
    <p className="mb-2 text-sm uppercase tracking-[0.18em] text-text-muted">Erreur 404</p>
    <h1 className="font-display text-3xl font-bold text-text-primary">Page introuvable</h1>
    <p className="mx-auto mt-4 max-w-md text-text-secondary">
      Cette adresse ne correspond à aucune page d’Omed Scripture. Revenez à l’accueil pour reprendre votre lecture.
    </p>
    <Link
      to="/"
      className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent-gold px-5 py-3 font-medium text-white transition-colors hover:bg-accent-brown"
    >
      <Home size={18} />
      Retour à l’accueil
    </Link>
  </div>
);

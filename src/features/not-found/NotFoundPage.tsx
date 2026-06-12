import React from 'react';
import { Compass } from 'lucide-react';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { EmptyIllustration } from '../../components/layout/EmptyIllustration';

export const NotFoundPage: React.FC = () => (
  <PageCanvas width="reading">
    <p className="mb-4 text-center text-sm uppercase tracking-[0.18em] text-text-muted">Erreur 404</p>
    <EmptyIllustration
      icon={Compass}
      title="Hors de la carte"
      message="Cette adresse ne correspond à aucune page d'Omed Scripture. Revenez à l'accueil pour reprendre votre lecture."
      actionLabel="Retour à l'accueil"
      to="/"
    />
  </PageCanvas>
);

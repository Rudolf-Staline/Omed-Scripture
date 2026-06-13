import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Omed Scripture route crashed', error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-bg-primary px-4 py-10 text-text-primary">
        <section className="omed-panel mx-auto max-w-2xl p-6 text-center md:p-8">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-gold/10 text-accent-gold">
            <AlertTriangle aria-hidden="true" />
          </span>
          <p className="omed-kicker mb-3">Erreur inattendue</p>
          <h1 className="font-display text-3xl font-semibold">Omed Scripture doit recharger cette vue</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-text-secondary">
            Vos données locales ne sont pas effacées. Rechargez la page ou revenez à l’accueil. Les détails techniques ne sont affichés qu’en développement.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => window.location.reload()} className="omed-button-primary inline-flex items-center gap-2 px-4 py-2 text-sm">
              <RefreshCw size={16} aria-hidden="true" /> Recharger
            </button>
            <Link to="/" onClick={() => this.setState({ hasError: false })} className="omed-button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm">
              <Home size={16} aria-hidden="true" /> Accueil
            </Link>
          </div>
        </section>
      </main>
    );
  }
}

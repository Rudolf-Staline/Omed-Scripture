import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, CalendarRange, ChevronRight, NotebookPen, Search } from 'lucide-react';
import { useBibleStore } from '../../store/useBibleStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useNotesStore } from '../../store/useNotesStore';
import { usePlansStore } from '../../store/usePlansStore';
import { READING_PLANS } from '../../data/readingPlans';
import { formatBibleReference, getBookName } from '../../utils/bibleBooks';

const QUICK_LINKS = [
  { label: 'Recherche', to: '/search', description: 'Interroger le texte sans quitter le rythme de lecture.', icon: Search },
  { label: 'Marque-pages', to: '/favorites', description: 'Revenir aux passages conservés.', icon: Bookmark },
  { label: 'Notes', to: '/notes', description: 'Relire vos annotations personnelles.', icon: NotebookPen },
  { label: 'Parcours', to: '/plans', description: 'Avancer jour après jour.', icon: CalendarRange },
];

export const HomePage: React.FC = () => {
  const { translation, bookId, chapter } = useBibleStore();
  const favorites = useFavoritesStore((state) => state.favorites);
  const notes = useNotesStore((state) => state.notes);
  const progress = usePlansStore((state) => state.progress);
  const continuePath = `/read/${translation}/${bookId}/${chapter}`;

  const recentNotes = [...notes].sort((a, b) => (b.dateModified ?? 0) - (a.dateModified ?? 0)).slice(0, 2);
  const recentFavorites = [...favorites].sort((a, b) => b.dateAdded - a.dateAdded).slice(0, 2);
  const activePlans = READING_PLANS.filter((plan) => progress[plan.id]).slice(0, 2);

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="reading-surface overflow-hidden p-6 md:p-9 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
          <div>
            <p className="omed-kicker mb-4">Accueil · dernière position</p>
            <h1 className="max-w-3xl font-display text-4xl leading-tight tracking-tight text-text-primary md:text-5xl">
              Reprendre dans {getBookName(bookId)}, chapitre {chapter}.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-text-secondary">
              Omed garde la trace du passage ouvert pour que l’interface disparaisse et que la lecture recommence immédiatement.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-bg-card/55 p-5">
            <p className="text-sm text-text-muted">Position conservée</p>
            <p className="mt-2 font-display text-2xl text-text-primary">{getBookName(bookId)} {chapter}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-accent-gold">{translation.toUpperCase()}</p>
            <Link to={continuePath} className="omed-button-primary mt-5 w-full px-5 py-3">
              Ouvrir le lecteur <ChevronRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="omed-panel-soft p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="omed-kicker">Accès rapide</p>
              <h2 className="mt-2 font-display text-2xl text-text-primary">Outils de lecture</h2>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {QUICK_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="group flex items-start gap-4 rounded-2xl border border-border bg-bg-card/45 p-4 hover:border-accent-gold/35 hover:bg-bg-card/80">
                <span className="mt-0.5 rounded-xl border border-border bg-bg-secondary p-2 text-accent-gold">
                  <link.icon size={18} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block font-semibold text-text-primary">{link.label}</span>
                  <span className="mt-1 block text-sm leading-6 text-text-secondary">{link.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <section className="omed-panel-soft p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl text-text-primary">Notes récentes</h2>
              <Link to="/notes" className="text-sm font-semibold text-accent-brown hover:text-accent-gold">Tout voir</Link>
            </div>
            {recentNotes.length > 0 ? (
              <div className="space-y-3">
                {recentNotes.map((note) => {
                  const [noteTranslation = '', noteBook = '', noteChapter = '', noteVerse = ''] = note.verseId.split('-');
                  return (
                    <Link key={note.id} to={`/read/${noteTranslation}/${noteBook}/${noteChapter}`} className="block rounded-2xl border border-border bg-bg-card/45 p-4 hover:border-accent-gold/30">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-gold">{formatBibleReference(noteBook, noteChapter, noteVerse)}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">{note.text}</p>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-border p-5 text-sm leading-6 text-text-muted">Vos notes apparaîtront ici dès qu’un verset sera annoté.</p>
            )}
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            <section className="omed-panel-soft p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl text-text-primary">Favoris</h2>
                <Link to="/favorites" className="text-sm font-semibold text-accent-brown hover:text-accent-gold">Ouvrir</Link>
              </div>
              {recentFavorites.length > 0 ? recentFavorites.map((favorite) => (
                <p key={favorite.id} className="mb-3 border-l border-accent-gold/40 pl-3 text-sm italic leading-6 text-text-secondary">{formatBibleReference(favorite.bookId, favorite.chapter, favorite.verse)} · {favorite.text}</p>
              )) : <p className="text-sm leading-6 text-text-muted">Aucun passage sauvegardé pour le moment.</p>}
            </section>

            <section className="omed-panel-soft p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl text-text-primary">Parcours</h2>
                <Link to="/plans" className="text-sm font-semibold text-accent-brown hover:text-accent-gold">Explorer</Link>
              </div>
              {activePlans.length > 0 ? activePlans.map((plan) => {
                const done = progress[plan.id]?.completedDays.length ?? 0;
                return <p key={plan.id} className="mb-3 text-sm leading-6 text-text-secondary"><span className="font-semibold text-text-primary">{plan.title}</span><br />{done}/{plan.durationDays} jours complétés</p>;
              }) : <p className="text-sm leading-6 text-text-muted">Choisissez un parcours pour structurer votre prochaine lecture.</p>}
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

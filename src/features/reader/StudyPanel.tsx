import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { NotebookPen, Bookmark, Highlighter } from 'lucide-react';
import { useNotesStore } from '../../store/useNotesStore';
import { useHighlightsStore } from '../../store/useHighlightsStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';

interface StudyPanelProps {
  translation: string;
  bookId: string;
  chapter: number;
}

const verseNumberFromId = (verseId: string): string => verseId.split('-').pop() ?? '?';

// Panneau « mode étude » : rassemble notes, surlignages et favoris du chapitre
// affiché, sans dupliquer la logique des stores.
export const StudyPanel: React.FC<StudyPanelProps> = ({ translation, bookId, chapter }) => {
  const notes = useNotesStore((state) => state.notes);
  const highlights = useHighlightsStore((state) => state.highlights);
  const favorites = useFavoritesStore((state) => state.favorites);

  const prefix = `${translation}-${bookId}-${chapter}-`;

  const chapterNotes = useMemo(
    () => notes.filter((note) => note.verseId.startsWith(prefix)),
    [notes, prefix]
  );
  const chapterHighlights = useMemo(
    () => Object.values(highlights).filter((h) => h.id.startsWith(prefix)),
    [highlights, prefix]
  );
  const chapterFavorites = useMemo(
    () => favorites.filter((f) => f.id.startsWith(prefix)),
    [favorites, prefix]
  );

  const isEmpty = chapterNotes.length === 0 && chapterHighlights.length === 0 && chapterFavorites.length === 0;

  return (
    <div className="space-y-4 rounded-[1.35rem] border border-border bg-bg-card/55 p-4 md:p-5">
      <div>
        <p className="omed-kicker">Mode étude</p>
        <h2 className="mt-1.5 font-display text-xl text-text-primary">Vos traces sur ce chapitre</h2>
      </div>

      {isEmpty ? (
        <p className="rounded-2xl border border-dashed border-border p-4 text-sm leading-6 text-text-muted">
          Aucune note, surlignage ou favori pour l’instant. Touchez un verset pour commencer l’étude.
        </p>
      ) : (
        <>
          {chapterNotes.length > 0 && (
            <section>
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                <NotebookPen size={13} /> Notes · {chapterNotes.length}
              </h3>
              <div className="space-y-2">
                {chapterNotes.map((note) => (
                  <div key={note.id} className="rounded-xl border border-border bg-bg-card/60 p-3">
                    <p className="text-xs font-semibold text-accent-gold">Verset {verseNumberFromId(note.verseId)}</p>
                    <p className="mt-1 line-clamp-3 text-sm leading-6 text-text-secondary">{note.text}</p>
                    {note.tags && note.tags.length > 0 && (
                      <p className="mt-1.5 text-xs text-text-muted">{note.tags.map((tag) => `#${tag}`).join(' ')}</p>
                    )}
                  </div>
                ))}
              </div>
              <Link to="/notes" className="mt-2 inline-block text-xs font-semibold text-accent-brown hover:text-accent-gold">Ouvrir le carnet de notes</Link>
            </section>
          )}

          {chapterHighlights.length > 0 && (
            <section>
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                <Highlighter size={13} /> Surlignages · {chapterHighlights.length}
              </h3>
              <p className="text-sm leading-6 text-text-secondary">
                Versets {chapterHighlights
                  .map((h) => verseNumberFromId(h.id))
                  .sort((a, b) => Number(a) - Number(b))
                  .join(', ')}
              </p>
            </section>
          )}

          {chapterFavorites.length > 0 && (
            <section>
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                <Bookmark size={13} /> Favoris · {chapterFavorites.length}
              </h3>
              <div className="space-y-2">
                {chapterFavorites.map((favorite) => (
                  <p key={favorite.id} className="border-l border-accent-gold/40 pl-2.5 text-sm italic leading-6 text-text-secondary">
                    v. {favorite.verse} · <span className="line-clamp-2">{favorite.text}</span>
                  </p>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

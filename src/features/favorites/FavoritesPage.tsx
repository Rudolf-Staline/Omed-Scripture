import React, { useMemo, useState } from 'react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useNavigate } from 'react-router-dom';
import { Trash2, Share2, ChevronRight, Bookmark } from 'lucide-react';
import { FEATURED_TRANSLATIONS } from '../../utils/bibleApi';
import { formatBibleReference, getBookOrder } from '../../utils/bibleBooks';
import toast from 'react-hot-toast';

export const FavoritesPage: React.FC = () => {
  const [sortMode, setSortMode] = useState<'date' | 'biblical'>('date');
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const navigate = useNavigate();

  const getTranslationName = (id: string) => {
    return FEATURED_TRANSLATIONS.find((t) => t.id === id)?.short || id.toUpperCase();
  };

  const handleShare = async (text: string, reference: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`« ${text} »\n${reference}`);
      toast.success('Texte copié !');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const sortedFavorites = useMemo(() => {
    const items = [...favorites];

    if (sortMode === 'date') {
      return items.sort((a, b) => b.dateAdded - a.dateAdded);
    }

    return items.sort((a, b) => {
      const bookA = getBookOrder(a.bookId);
      const bookB = getBookOrder(b.bookId);
      if (bookA !== bookB) return bookA - bookB;
      if (a.chapter !== b.chapter) return a.chapter - b.chapter;
      return a.verse - b.verse;
    });
  }, [favorites, sortMode]);

  if (favorites.length === 0) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <Bookmark size={48} className="mx-auto mb-4 text-accent-gold opacity-70" />
        <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">Aucun passage sauvegardé pour le moment.</h2>
        <p className="text-text-secondary">Vos marque-pages bibliques apparaîtront ici.</p>
        <button
          onClick={() => navigate('/')}
          className="omed-button-ghost mt-6 px-6 py-2.5 font-semibold"
        >
          Commencer à lire
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-4 md:py-8">
      <div className="mb-8 flex flex-col gap-4 rounded-[1.5rem] border border-border bg-bg-card/52 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="flex items-center gap-3 font-display text-3xl font-semibold text-text-primary">
          <Bookmark className="text-accent-gold" />
          Marque-pages
        </h1>
        <div className="flex items-center gap-2">
          <label htmlFor="bookmark-sort" className="text-sm text-text-secondary">Trier</label>
          <select
            id="bookmark-sort"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as 'date' | 'biblical')}
            className="rounded-xl border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
          >
            <option value="date">Date d'ajout (récent)</option>
            <option value="biblical">Ordre biblique</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedFavorites.map((verse) => {
          const reference = formatBibleReference(verse.bookId, verse.chapter, verse.verse);

          return (
            <div key={verse.id} className="group rounded-[1.35rem] border border-border bg-bg-card/62 p-6 shadow-[var(--shadow-soft)] transition-all hover:border-accent-gold/35">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-lg text-text-primary">{reference}</h3>
                  <span className="rounded-full border border-border bg-bg-secondary px-2.5 py-1 font-mono text-xs font-semibold text-text-muted">
                    {getTranslationName(verse.translation)}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                  <button
                    onClick={(e) => handleShare(verse.text, reference, e)}
                    className="rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-secondary hover:text-accent-gold"
                    title="Partager"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Retirer ce passage des marque-pages ?')) {
                        removeFavorite(verse.id);
                        toast.success('Marque-page retiré.');
                      }
                    }}
                    className="rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-secondary hover:text-[color:var(--color-danger)]"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="mb-6 border-l border-accent-gold/35 pl-4 font-body text-base italic leading-8 text-text-secondary">
                « {verse.text} »
              </p>

              <button
                onClick={() => navigate(`/read/${verse.translation}/${verse.bookId}/${verse.chapter}`)}
                className="inline-flex items-center gap-1 text-sm font-semibold text-accent-brown transition-colors hover:text-accent-gold"
              >
                Lire le contexte <ChevronRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

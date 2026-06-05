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
      <div className="max-w-3xl mx-auto py-20 text-center">
        <Bookmark size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
        <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">Aucun passage sauvegardé pour le moment.</h2>
        <p className="text-text-secondary">Vos marque-pages bibliques apparaîtront ici.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-bg-secondary text-text-primary rounded-lg font-medium hover:bg-border transition-colors"
        >
          Commencer à lire
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="font-display text-3xl font-bold text-text-primary flex items-center gap-3">
          <Bookmark className="text-accent-gold" />
          Marque-pages
        </h1>
        <div className="flex items-center gap-2">
          <label htmlFor="bookmark-sort" className="text-sm text-text-secondary">Trier</label>
          <select
            id="bookmark-sort"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as 'date' | 'biblical')}
            className="px-3 py-2 bg-bg-card border border-border rounded-lg text-sm text-text-primary"
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
            <div key={verse.id} className="bg-bg-card border border-border rounded-xl p-6 group hover:shadow-sm transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-lg text-text-primary">{reference}</h3>
                  <span className="text-xs font-mono font-medium text-text-muted px-2 py-0.5 bg-bg-secondary rounded">
                    {getTranslationName(verse.translation)}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleShare(verse.text, reference, e)}
                    className="p-1.5 text-text-muted hover:text-accent-gold rounded transition-colors"
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
                    className="p-1.5 text-text-muted hover:text-red-500 rounded transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="font-body text-base text-text-secondary mb-6 leading-relaxed italic">
                « {verse.text} »
              </p>

              <button
                onClick={() => navigate(`/read/${verse.translation}/${verse.bookId}/${verse.chapter}`)}
                className="flex items-center gap-1 text-sm font-medium text-accent-brown hover:text-accent-gold transition-colors"
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

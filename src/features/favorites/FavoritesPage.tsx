import React, { useMemo, useState } from 'react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import type { FavoriteVerse } from '../../store/useFavoritesStore';
import { useNavigate } from 'react-router-dom';
import { Trash2, Share2, ChevronRight, Bookmark } from 'lucide-react';
import { FEATURED_TRANSLATIONS } from '../../utils/bibleApi';
import { formatBibleReference, getBookName, getBookOrder } from '../../utils/bibleBooks';
import toast from 'react-hot-toast';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { PageHero } from '../../components/layout/PageHero';
import { FilterBar, FilterChip } from '../../components/layout/FilterBar';
import { EmptyIllustration } from '../../components/layout/EmptyIllustration';

type SortMode = 'date' | 'biblical';

export const FavoritesPage: React.FC = () => {
  const [sortMode, setSortMode] = useState<SortMode>('date');
  const [grouped, setGrouped] = useState(false);
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const navigate = useNavigate();

  const getTranslationName = (id: string) => FEATURED_TRANSLATIONS.find((t) => t.id === id)?.short || id.toUpperCase();

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
    if (sortMode === 'date') return items.sort((a, b) => b.dateAdded - a.dateAdded);
    return items.sort((a, b) => {
      const bookDiff = getBookOrder(a.bookId) - getBookOrder(b.bookId);
      if (bookDiff !== 0) return bookDiff;
      if (a.chapter !== b.chapter) return a.chapter - b.chapter;
      return a.verse - b.verse;
    });
  }, [favorites, sortMode]);

  const groups = useMemo(() => {
    if (!grouped) return null;
    const map = new Map<string, FavoriteVerse[]>();
    [...favorites]
      .sort((a, b) => getBookOrder(a.bookId) - getBookOrder(b.bookId) || a.chapter - b.chapter || a.verse - b.verse)
      .forEach((verse) => {
        const list = map.get(verse.bookId) ?? [];
        list.push(verse);
        map.set(verse.bookId, list);
      });
    return Array.from(map.entries()).map(([id, items]) => ({ id, name: getBookName(id), items }));
  }, [favorites, grouped]);

  const renderCard = (verse: FavoriteVerse) => {
    const reference = formatBibleReference(verse.bookId, verse.chapter, verse.verse);
    return (
      <article key={verse.id} className="group omed-card p-4 transition-all hover:border-accent-gold/35 sm:p-5">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-text-primary">{reference}</h3>
            <span className="rounded-full border border-border bg-bg-secondary px-2.5 py-0.5 font-mono text-xs font-semibold text-text-muted">{getTranslationName(verse.translation)}</span>
          </div>
          <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <button type="button" onClick={(e) => handleShare(verse.text, reference, e)} className="min-h-10 min-w-10 rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-secondary hover:text-accent-gold" aria-label={`Copier ${reference}`}><Share2 size={16} /></button>
            <button type="button" onClick={() => { if (window.confirm('Retirer ce passage des marque-pages ?')) { removeFavorite(verse.id); toast.success('Marque-page retiré.'); } }} className="min-h-10 min-w-10 rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-secondary hover:text-[color:var(--color-danger)]" aria-label={`Supprimer ${reference}`}><Trash2 size={16} /></button>
          </div>
        </div>
        <p className="mb-4 border-l-2 border-accent-gold/35 pl-4 font-body text-base italic leading-8 text-text-secondary">« {verse.text} »</p>
        <button type="button" onClick={() => navigate(`/read/${verse.translation}/${verse.bookId}/${verse.chapter}`)} className="inline-flex items-center gap-1 text-sm font-semibold text-accent-brown transition-colors hover:text-accent-gold">
          Lire le contexte <ChevronRight size={16} />
        </button>
      </article>
    );
  };

  if (favorites.length === 0) {
    return (
      <PageCanvas width="reading">
        <EmptyIllustration icon={Bookmark} title="Aucun passage sauvegardé" message="Vos marque-pages bibliques apparaîtront ici. Touchez un verset dans le lecteur pour le garder." actionLabel="Ouvrir le lecteur" to="/reader" />
      </PageCanvas>
    );
  }

  return (
    <PageCanvas width="list" className="space-y-6">
      <PageHero
        kicker="Carnet · marque-pages"
        title="Marque-pages"
        icon={Bookmark}
        intro="Les passages que vous avez choisi de garder, rassemblés."
        actions={
          <FilterBar label="">
            <FilterChip active={sortMode === 'date'} onClick={() => setSortMode('date')}>Récents</FilterChip>
            <FilterChip active={sortMode === 'biblical'} onClick={() => setSortMode('biblical')}>Ordre biblique</FilterChip>
            <FilterChip active={grouped} onClick={() => setGrouped((g) => !g)}>Par livre</FilterChip>
          </FilterBar>
        }
      />

      {groups ? (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.id}>
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg text-text-primary">
                {group.name}
                <span className="rounded-full border border-accent-gold/25 bg-accent-gold/10 px-2 py-0.5 text-xs font-semibold text-accent-gold">{group.items.length}</span>
              </h2>
              <div className="space-y-3">{group.items.map(renderCard)}</div>
            </section>
          ))}
        </div>
      ) : (
        <div className="space-y-4">{sortedFavorites.map(renderCard)}</div>
      )}
    </PageCanvas>
  );
};

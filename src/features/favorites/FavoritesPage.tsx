import React, { useMemo, useState } from 'react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import type { FavoriteVerse } from '../../store/useFavoritesStore';
import { useNavigate } from 'react-router-dom';
import { Trash2, Share2, Bookmark } from 'lucide-react';
import { FEATURED_TRANSLATIONS } from '../../utils/bibleApi';
import { formatBibleReference, getBookName, getBookOrder } from '../../utils/bibleBooks';
import toast from 'react-hot-toast';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { PageHero } from '../../components/layout/PageHero';
import { FilterBar, FilterChip } from '../../components/layout/FilterBar';
import { EmptyScene } from '../../components/layout/EmptyScene';
import { NotebookLayout } from '../../components/layout/NotebookLayout';
import { FilterRail } from '../../components/layout/FilterRail';
import { ReferenceCard } from '../../components/layout/ReferenceCard';

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
      <ReferenceCard
        key={verse.id}
        reference={reference}
        meta={getTranslationName(verse.translation)}
        text={<span className="italic">« {verse.text} »</span>}
        onOpen={() => navigate(`/read/${verse.translation}/${verse.bookId}/${verse.chapter}`)}
        openLabel="Lire le contexte"
        actions={(
          <>
            <button type="button" onClick={(e) => handleShare(verse.text, reference, e)} className="min-h-10 min-w-10 rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-secondary hover:text-accent-gold" aria-label={`Copier ${reference}`}><Share2 size={16} /></button>
            <button type="button" onClick={() => { if (window.confirm('Retirer ce passage des marque-pages ?')) { removeFavorite(verse.id); toast.success('Marque-page retiré.'); } }} className="min-h-10 min-w-10 rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-secondary hover:text-[color:var(--color-danger)]" aria-label={`Supprimer ${reference}`}><Trash2 size={16} /></button>
          </>
        )}
      />
    );
  };

  if (favorites.length === 0) {
    return (
      <PageCanvas width="reading">
        <EmptyScene icon={Bookmark} title="Aucun passage sauvegardé" message="Vos marque-pages bibliques apparaîtront ici. Touchez un verset dans le lecteur pour le garder." actionLabel="Ouvrir le lecteur" to="/reader" />
      </PageCanvas>
    );
  }

  return (
    <PageCanvas width="wide">
      <NotebookLayout
        hero={(
          <PageHero
            kicker="Carnet · marque-pages"
            title="Favoris"
            icon={Bookmark}
            intro="Les passages que vous avez choisi de garder, présentés comme des passages sauvegardés."
          />
        )}
        tools={(
          <FilterRail title="Classement">
            <FilterBar label="Tri">
              <FilterChip active={sortMode === 'date'} onClick={() => setSortMode('date')}>Récents</FilterChip>
              <FilterChip active={sortMode === 'biblical'} onClick={() => setSortMode('biblical')}>Ordre biblique</FilterChip>
              <FilterChip active={grouped} onClick={() => setGrouped((g) => !g)}>Par livre</FilterChip>
            </FilterBar>
            <p className="text-sm leading-6 text-text-muted">{favorites.length} passage{favorites.length > 1 ? 's' : ''} gardé{favorites.length > 1 ? 's' : ''} dans le carnet.</p>
          </FilterRail>
        )}
      >
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
      </NotebookLayout>
    </PageCanvas>
  );};

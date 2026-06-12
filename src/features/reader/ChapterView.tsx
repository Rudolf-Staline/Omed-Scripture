import React, { useEffect, useState } from 'react';
import { getChapter } from '../../utils/bibleApi';
import { formatBibleReference } from '../../utils/bibleBooks';
import type { Verse } from '../../utils/bibleApi';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useHighlightsStore } from '../../store/useHighlightsStore';
import type { HighlightColor } from '../../store/useHighlightsStore';
import { VerseActions } from './VerseActions';
import { cacheChapter, getCachedChapter } from '../../utils/chapterCache';
import { useOnlineStatus } from '../../utils/useOnlineStatus';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import clsx from 'clsx';

interface ChapterViewProps {
  translation: string;
  bookId: string;
  chapter: number;
}

export const ChapterView: React.FC<ChapterViewProps> = ({ translation, bookId, chapter }) => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);
  const isOnline = useOnlineStatus();

  const settings = useSettingsStore((state) => state.settings);
  const highlights = useHighlightsStore((state) => state.highlights);

  useEffect(() => {
    if (!selectedVerseId) return undefined;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedVerseId(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedVerseId]);

  useEffect(() => {
    let mounted = true;
    const fetchChapter = async () => {
      setLoading(true);
      setError(null);

      const cached = getCachedChapter(translation, bookId, chapter);
      if (!isOnline && cached) {
        setVerses(cached);
        setLoading(false);
        return;
      }

      if (!isOnline && !cached) {
        setVerses([]);
        setError('Ce chapitre n’est pas encore disponible sans connexion.');
        setLoading(false);
        return;
      }

      try {
        const data = await getChapter(translation, bookId, chapter);
        cacheChapter(translation, bookId, chapter, data);
        if (mounted) setVerses(data);
      } catch (err: unknown) {
        if (cached) {
          if (mounted) setVerses(cached);
        } else if (mounted) {
          setError(err instanceof Error ? err.message : 'Erreur lors du chargement du chapitre');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchChapter();
    return () => { mounted = false; };
  }, [translation, bookId, chapter, isOnline]);

  if (loading) return <LoadingState title="Chargement du chapitre" message="Nous ouvrons ce passage." />;
  if (error) return <ErrorState title="Chapitre indisponible" message={error} />;
  if (verses.length === 0) return <EmptyState title="Chapitre vide" message="Aucun verset n’a été reçu pour ce passage. Essayez un autre chapitre ou une autre traduction." />;

  const fontClass = settings.fontFamily === 'Lora' ? 'font-body' : 'font-sans';

  const sizeClasses = {
    S: 'text-base',
    M: 'text-lg',
    L: 'text-xl',
    XL: 'text-2xl',
  };

  const leadingClasses = {
    Normal: 'leading-[1.9]',
    Relaxed: 'leading-[2.05]',
    Large: 'leading-[2.2]',
  };

  const widthClasses = {
    Narrow: 'max-w-2xl',
    Comfortable: 'max-w-3xl',
    Wide: 'max-w-5xl',
  };

  const densityClasses = {
    Compact: 'space-y-2.5',
    Aired: 'space-y-4',
  };

  const getHighlightStyle = (color: HighlightColor) => {
    switch (color) {
      case 'yellow': return 'bg-accent-gold/18 border-b border-accent-gold/55 shadow-[inset_0_-0.32em_0_rgba(201,164,92,0.16)]';
      case 'blue': return 'bg-[color-mix(in_srgb,var(--color-info)_20%,transparent)] border-b border-[color-mix(in_srgb,var(--color-info)_55%,transparent)]';
      case 'green': return 'bg-accent-sage/18 border-b border-accent-sage/45';
      case 'pink': return 'bg-accent-brown/15 border-b border-accent-brown/40';
      case 'purple': return 'bg-[color-mix(in_srgb,var(--color-copper)_16%,transparent)] border-b border-[color-mix(in_srgb,var(--color-copper)_42%,transparent)]';
      default: return '';
    }
  };

  return (
    <article className={`reading-surface ${widthClasses[settings.readingWidth]} mx-auto px-5 py-8 pb-28 sm:px-8 sm:py-10 md:px-12 lg:px-16 ${fontClass} ${sizeClasses[settings.fontSize]} ${leadingClasses[settings.lineHeight]}`}>
      <header className="mb-9 border-b border-border/70 pb-6 text-center sm:text-left">
        <p className="omed-kicker mb-3">{translation.toUpperCase()}</p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
          {verses.length > 0 ? `${verses[0].book_name} ${chapter}` : `${bookId} ${chapter}`}
        </h2>
      </header>

      <div className={densityClasses[settings.readingDensity]}>
        {verses.map((verse) => {
          const verseId = `${translation}-${bookId}-${chapter}-${verse.verse}`;
          const isSelected = selectedVerseId === verseId;
          const highlight = highlights[verseId];

          return (
            <div
              key={verseId}
              className="group/verse relative -mx-2 cursor-pointer rounded-xl px-2 py-1.5 hover:bg-bg-card/35 focus:bg-bg-card/45 focus:outline-none focus:ring-1 focus:ring-accent-gold/40 focus-within:bg-bg-card/45 sm:-mx-3 sm:px-3"
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`${formatBibleReference(bookId, chapter, verse.verse)}. Touchez ou appuyez sur Entrée pour afficher les actions.`}
              onClick={() => setSelectedVerseId(isSelected ? null : verseId)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedVerseId(isSelected ? null : verseId);
                }
              }}
            >
              {isSelected && (
                <VerseActions verse={verse} verseId={verseId} translation={translation} bookId={bookId} onClose={() => setSelectedVerseId(null)} />
              )}
              <span className={clsx(
                'transition-all duration-200 rounded-lg px-1.5 py-0.5 -mx-1.5 decoration-accent-gold/35',
                highlight ? getHighlightStyle(highlight.color) : '',
                isSelected ? 'bg-bg-card ring-1 ring-accent-gold/30 shadow-sm' : ''
              )}>
                {settings.showVerseNumbers && (
                  <sup className="mr-2 inline-block select-none align-top font-mono text-[0.62em] font-semibold leading-none tracking-wide text-accent-gold/75">
                    {verse.verse}
                  </sup>
                )}
                <span className="text-text-primary/95">
                  {verse.text}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
};
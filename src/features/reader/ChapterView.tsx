import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Feather, WifiOff } from 'lucide-react';
import { getChapter } from '../../utils/bibleApi';
import type { Verse } from '../../utils/bibleApi';
import { formatBibleReference } from '../../utils/bibleBooks';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useHighlightsStore } from '../../store/useHighlightsStore';
import type { HighlightColor } from '../../store/useHighlightsStore';
import { VerseActions } from './VerseActions';
import { cacheChapter, getCachedChapter } from '../../utils/chapterCache';
import { useOnlineStatus } from '../../utils/useOnlineStatus';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';

interface ChapterViewProps {
  translation: string;
  bookId: string;
  chapter: number;
  comparison?: boolean;
  focus?: boolean;
}

export const ChapterView: React.FC<ChapterViewProps> = ({ translation, bookId, chapter, comparison = false, focus = false }) => {
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

  const annotatedCount = useMemo(
    () => verses.filter((verse) => highlights[`${translation}-${bookId}-${chapter}-${verse.verse}`]).length,
    [verses, highlights, translation, bookId, chapter]
  );

  if (loading) return <LoadingState title="Chargement du chapitre" message="Préparation du texte biblique." />;
  if (error) return <ErrorState title="Chapitre indisponible" message={error} />;
  if (verses.length === 0) return <EmptyState title="Chapitre vide" message="Aucun verset n’a été reçu pour ce passage. Essayez un autre chapitre ou une autre traduction." />;

  const fontClass = settings.fontFamily === 'Lora' ? 'font-body' : 'font-sans';
  const sizeClasses = { S: 'text-base', M: 'text-lg', L: 'text-xl', XL: 'text-2xl' };
  const leadingClasses = { Normal: 'leading-[1.85]', Relaxed: 'leading-[2.05]', Large: 'leading-[2.22]' };
  const widthClasses = { Narrow: 'max-w-3xl', Comfortable: 'max-w-4xl', Wide: 'max-w-6xl' };
  const densityClasses = { Compact: 'gap-2', Aired: 'gap-4' };

  const getHighlightStyle = (color: HighlightColor) => {
    switch (color) {
      case 'yellow': return 'bg-accent-gold/18 shadow-[inset_0_-0.34em_0_rgba(201,164,92,0.18)]';
      case 'blue': return 'bg-[color-mix(in_srgb,var(--color-info)_20%,transparent)]';
      case 'green': return 'bg-accent-sage/18';
      case 'pink': return 'bg-accent-brown/15';
      case 'purple': return 'bg-[color-mix(in_srgb,var(--color-copper)_16%,transparent)]';
      default: return '';
    }
  };

  return (
    <article className={clsx(
      'relative mx-auto overflow-visible rounded-[1.7rem] border border-border bg-bg-card shadow-[var(--shadow-soft)]',
      comparison ? 'p-4 sm:p-5' : 'px-3 py-5 sm:px-6 sm:py-7 lg:px-8',
      focus ? 'max-w-4xl border-accent-gold/25' : widthClasses[settings.readingWidth],
      fontClass,
      sizeClasses[settings.fontSize],
      leadingClasses[settings.lineHeight]
    )}>
      <header className={clsx('grid gap-4 border-b border-border/70 pb-6', comparison ? 'mb-5' : 'mb-8 md:grid-cols-[1fr_auto] md:items-end')}>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-text-muted">{comparison ? 'Comparaison' : 'Lecture'} · {translation.toUpperCase()}</p>
          <h2 className={clsx('font-bold tracking-tight text-text-primary', comparison ? 'text-2xl' : 'text-3xl sm:text-4xl')}>
            {verses[0]?.book_name ?? bookId} {chapter}
          </h2>
        </div>
        {!comparison && (
          <div className="rounded-[1.4rem] border border-border bg-bg-primary/45 p-4 text-sm text-text-secondary">
            <div className="flex items-center gap-2 font-semibold text-text-primary"><Feather size={16} className="text-accent-gold" /> Notes et surlignages</div>
            <p className="mt-1">{annotatedCount} annotation{annotatedCount > 1 ? 's' : ''} visible{annotatedCount > 1 ? 's' : ''} · {verses.length} versets</p>
          </div>
        )}
      </header>

      {!isOnline && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-border bg-bg-primary/55 px-4 py-3 text-sm text-text-secondary">
          <WifiOff size={16} className="text-accent-brown" /> Passage affiché depuis le cache local.
        </div>
      )}

      <div className={clsx('grid', densityClasses[settings.readingDensity])}>
        {verses.map((verse) => {
          const verseId = `${translation}-${bookId}-${chapter}-${verse.verse}`;
          const isSelected = selectedVerseId === verseId;
          const highlight = highlights[verseId];

          return (
            <section key={verseId} id={verseId} className={clsx('group/verse grid gap-2 rounded-[1.25rem] transition-all lg:grid-cols-[3rem_minmax(0,1fr)_18rem]', isSelected ? 'bg-bg-secondary p-3 ring-1 ring-accent-gold/35' : 'p-2 hover:bg-bg-secondary/70')}>
              <button
                type="button"
                className={clsx('flex min-h-10 items-start justify-center rounded-xl pt-2 text-sm font-bold transition-colors', isSelected ? 'bg-accent-gold/14 text-accent-gold' : 'text-text-muted group-hover/verse:text-accent-gold')}
                aria-label={`${formatBibleReference(bookId, chapter, verse.verse)}. Afficher les actions.`}
                onClick={() => setSelectedVerseId(isSelected ? null : verseId)}
              >
                {settings.showVerseNumbers ? verse.verse : '•'}
              </button>

              <button
                type="button"
                onClick={() => setSelectedVerseId(isSelected ? null : verseId)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedVerseId(isSelected ? null : verseId);
                  }
                }}
                className="min-w-0 rounded-xl px-2 py-2 text-left focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
              >
                <span className={clsx('decoration-accent-gold/35 rounded-xl px-1 py-0.5 text-text-primary/95 transition-all', highlight ? getHighlightStyle(highlight.color) : '', isSelected ? 'text-text-primary' : '')}>
                  {verse.text}
                </span>
              </button>

              <div className="min-w-0 lg:min-h-0">
                {isSelected ? (
                  <VerseActions verse={verse} verseId={verseId} translation={translation} bookId={bookId} onClose={() => setSelectedVerseId(null)} />
                ) : (
                  <div className="hidden h-full items-start justify-end pt-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-text-muted/75 lg:flex">
                    {highlight ? 'marqué' : 'marge'}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
};

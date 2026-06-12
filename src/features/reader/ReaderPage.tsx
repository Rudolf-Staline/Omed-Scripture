import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useBibleStore } from '../../store/useBibleStore';
import { BIBLE_BOOKS, FEATURED_TRANSLATIONS } from '../../utils/bibleApi';
import { ChapterView } from './ChapterView';
import { StudyPanel } from './StudyPanel';
import { AudioPlayer } from '../../components/AudioPlayer';
import { useOnlineStatus } from '../../utils/useOnlineStatus';
import { recordReadingDay } from '../../utils/readingActivity';
import { ChevronDown, ChevronLeft, ChevronRight, Headphones, GitCompare, SlidersHorizontal, WifiOff, Maximize2, Minimize2, NotebookPen } from 'lucide-react';

const SelectChevron = () => (
  <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
);

export const ReaderPage: React.FC = () => {
  const { translation, bookId, chapter } = useParams<{ translation: string; bookId: string; chapter: string }>();
  const navigate = useNavigate();
  const [showAudio, setShowAudio] = React.useState(false);
  const [focusMode, setFocusMode] = React.useState(false);
  const [studyMode, setStudyMode] = React.useState(false);
  const isOnline = useOnlineStatus();

  const storedTranslation = useBibleStore((state) => state.translation);
  const storedBookId = useBibleStore((state) => state.bookId);
  const storedChapter = useBibleStore((state) => state.chapter);
  const setPosition = useBibleStore((state) => state.setPosition);
  const compareTranslation = useBibleStore((state) => state.compareTranslation);
  const setCompareTranslation = useBibleStore((state) => state.setCompareTranslation);

  const effectiveTranslation = translation || storedTranslation || 'lsg';
  const effectiveBookId = bookId || storedBookId || 'jean';
  const chapterNum = parseInt(chapter || String(storedChapter || 1), 10);

  useEffect(() => {
    setPosition(effectiveTranslation, effectiveBookId, chapterNum);
  }, [effectiveTranslation, effectiveBookId, chapterNum, setPosition]);

  // Journal local d'activité : alimente la progression hebdomadaire de l'accueil.
  useEffect(() => {
    recordReadingDay();
  }, [effectiveTranslation, effectiveBookId, chapterNum]);

  useEffect(() => {
    if (!focusMode) return undefined;
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFocusMode(false);
    };
    window.addEventListener('keydown', exitOnEscape);
    return () => window.removeEventListener('keydown', exitOnEscape);
  }, [focusMode]);

  const currentBook = BIBLE_BOOKS.find((b) => b.id === effectiveBookId) || BIBLE_BOOKS[0];
  const currentTranslation = FEATURED_TRANSLATIONS.find((t) => t.id === effectiveTranslation);

  const goToPreviousChapter = () => {
    if (chapterNum > 1) {
      navigate(`/read/${effectiveTranslation}/${effectiveBookId}/${chapterNum - 1}`);
      return;
    }
    const index = BIBLE_BOOKS.findIndex((b) => b.id === effectiveBookId);
    if (index > 0) {
      const previous = BIBLE_BOOKS[index - 1];
      navigate(`/read/${effectiveTranslation}/${previous.id}/${previous.chapters}`);
    }
  };

  const goToNextChapter = () => {
    if (chapterNum < currentBook.chapters) {
      navigate(`/read/${effectiveTranslation}/${effectiveBookId}/${chapterNum + 1}`);
      return;
    }
    const index = BIBLE_BOOKS.findIndex((b) => b.id === effectiveBookId);
    if (index < BIBLE_BOOKS.length - 1) {
      const next = BIBLE_BOOKS[index + 1];
      navigate(`/read/${effectiveTranslation}/${next.id}/1`);
    }
  };

  const bookProgress = Math.round((chapterNum / currentBook.chapters) * 100);

  const selectClass = 'min-h-10 appearance-none rounded-xl border border-border bg-bg-card/72 pl-3 pr-8 text-sm font-semibold text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-accent-gold/35 focus:outline-none focus:ring-1 focus:ring-accent-gold/50 sm:min-h-11 sm:pl-3.5 sm:pr-9';

  return (
    <div className="flex h-full flex-col">
      {!focusMode && (
      <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-border bg-bg-primary/90 px-4 py-2.5 backdrop-blur-xl sm:-mx-6 sm:mb-5 sm:px-6 sm:py-3 md:-mx-10 md:px-10 lg:-mx-14 lg:px-14">
        <div className="mb-2 flex items-center justify-between gap-3 sm:mb-3">
          <div className="min-w-0">
            <p className="omed-kicker hidden sm:block">Lecteur</p>
            <h1 className="truncate font-display text-xl leading-tight text-text-primary sm:text-3xl">{currentBook.name} {chapterNum}</h1>
          </div>
          <span className="shrink-0 rounded-full border border-accent-gold/25 bg-accent-gold/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-gold sm:bg-transparent sm:text-text-muted">
            {currentTranslation?.short ?? effectiveTranslation.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 items-center gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
          <div className="relative col-span-2 sm:col-span-1 sm:min-w-[8rem] sm:flex-none">
            <select value={effectiveTranslation} onChange={(e) => navigate(`/read/${e.target.value}/${effectiveBookId}/${chapterNum}`)} className={`${selectClass} w-full`} aria-label="Traduction">
              {FEATURED_TRANSLATIONS.map((t) => <option key={t.id} value={t.id}>{t.short} · {t.name}</option>)}
            </select>
            <SelectChevron />
          </div>

          <div className="relative min-w-0 sm:min-w-[9rem] sm:flex-none">
            <select value={effectiveBookId} onChange={(e) => navigate(`/read/${effectiveTranslation}/${e.target.value}/1`)} className={`${selectClass} w-full`} aria-label="Livre">
              {BIBLE_BOOKS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <SelectChevron />
          </div>

          <div className="relative min-w-0 sm:min-w-[7.5rem] sm:flex-none">
            <select value={chapterNum} onChange={(e) => navigate(`/read/${effectiveTranslation}/${effectiveBookId}/${e.target.value}`)} className={`${selectClass} w-full`} aria-label="Chapitre">
              {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((c) => <option key={c} value={c}>Chapitre {c}</option>)}
            </select>
            <SelectChevron />
          </div>

          {!isOnline && (
            <span className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-accent-brown/35 bg-accent-brown/12 px-3 text-xs font-semibold text-accent-brown sm:min-h-10">
              <WifiOff size={14} />
              Hors ligne
            </span>
          )}

          <div className="hidden flex-1 md:block" />

          <div className="hidden items-center gap-2 sm:flex">
            <button type="button" onClick={() => setShowAudio(true)} className="omed-button-ghost min-h-11 px-3 text-sm" aria-label="Ouvrir l'audio">
              <Headphones size={17} strokeWidth={1.5} />
              <span>Audio</span>
            </button>

            <button type="button" onClick={() => setCompareTranslation(compareTranslation ? null : 'darby')} className={`min-h-11 rounded-xl border px-3 text-sm font-semibold ${compareTranslation ? 'border-accent-gold/45 bg-accent-gold/12 text-accent-gold' : 'omed-button-ghost'}`} aria-pressed={Boolean(compareTranslation)}>
              <GitCompare size={17} strokeWidth={1.5} />
              <span>Comparer</span>
            </button>

            <button type="button" onClick={() => setStudyMode((mode) => !mode)} className={`min-h-11 rounded-xl border px-3 text-sm font-semibold ${studyMode ? 'border-accent-gold/45 bg-accent-gold/12 text-accent-gold' : 'omed-button-ghost'}`} aria-pressed={studyMode}>
              <NotebookPen size={17} strokeWidth={1.5} />
              <span>Étude</span>
            </button>

            <button type="button" onClick={() => setFocusMode(true)} className="omed-button-ghost min-h-11 px-3 text-sm" aria-label="Activer le mode focus">
              <Maximize2 size={17} strokeWidth={1.5} />
              <span>Focus</span>
            </button>
          </div>

          <details className="col-span-2 sm:hidden">
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-center gap-2 rounded-xl border border-border bg-bg-card/55 px-3 text-sm font-semibold text-text-secondary [&::-webkit-details-marker]:hidden">
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              Options de lecture
            </summary>
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-bg-card/55 p-2">
              <button type="button" onClick={() => setShowAudio(true)} className="omed-button-ghost min-h-10 justify-center px-3 text-sm" aria-label="Ouvrir l'audio">
                <Headphones size={16} strokeWidth={1.5} />
                Audio
              </button>
              <button type="button" onClick={() => setCompareTranslation(compareTranslation ? null : 'darby')} className={`min-h-10 justify-center rounded-xl border px-3 text-sm font-semibold ${compareTranslation ? 'border-accent-gold/45 bg-accent-gold/12 text-accent-gold' : 'omed-button-ghost'}`} aria-pressed={Boolean(compareTranslation)}>
                <GitCompare size={16} strokeWidth={1.5} />
                Comparer
              </button>
              <button type="button" onClick={() => setStudyMode((mode) => !mode)} className={`min-h-10 justify-center rounded-xl border px-3 text-sm font-semibold ${studyMode ? 'border-accent-gold/45 bg-accent-gold/12 text-accent-gold' : 'omed-button-ghost'}`} aria-pressed={studyMode}>
                <NotebookPen size={16} strokeWidth={1.5} />
                Étude
              </button>
              <button type="button" onClick={() => setFocusMode(true)} className="omed-button-ghost min-h-10 justify-center px-3 text-sm" aria-label="Activer le mode focus">
                <Maximize2 size={16} strokeWidth={1.5} />
                Focus
              </button>
            </div>
          </details>
        </div>

        <div className="mt-2.5 flex items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-bg-secondary" role="progressbar" aria-valuemin={1} aria-valuemax={currentBook.chapters} aria-valuenow={chapterNum} aria-label={`Progression dans ${currentBook.name}`}>
            <div className="h-full rounded-full bg-accent-gold/70 transition-all duration-300" style={{ width: `${bookProgress}%` }} />
          </div>
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
            {chapterNum} / {currentBook.chapters}
          </span>
        </div>
      </header>
      )}

      <div className={clsx('flex-1', studyMode && !focusMode && 'lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:gap-6')}>
        <div className={`gap-5 ${compareTranslation ? 'grid lg:grid-cols-2' : 'block'}`}>
          <section className={compareTranslation ? 'min-w-0 border-b border-border pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5' : ''}>
            <ChapterView translation={effectiveTranslation} bookId={effectiveBookId} chapter={chapterNum} />
          </section>

          {compareTranslation && (
            <section className="min-w-0 lg:pl-1">
              <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-bg-card/45 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Comparaison</p>
                <div className="relative inline-flex">
                  <select value={compareTranslation} onChange={(e) => setCompareTranslation(e.target.value)} className={selectClass} aria-label="Traduction de comparaison">
                    {FEATURED_TRANSLATIONS.map((t) => <option key={t.id} value={t.id}>{t.short} · {t.name}</option>)}
                  </select>
                  <SelectChevron />
                </div>
              </div>
              <ChapterView translation={compareTranslation} bookId={effectiveBookId} chapter={chapterNum} />
            </section>
          )}
        </div>

        {studyMode && !focusMode && (
          <aside className="mt-6 lg:sticky lg:top-32 lg:mt-0">
            <StudyPanel translation={effectiveTranslation} bookId={effectiveBookId} chapter={chapterNum} />
          </aside>
        )}
      </div>

      {!focusMode && (
        <footer className="mt-8 mb-4 flex items-center justify-between gap-3 border-t border-border pt-5">
          <button type="button" onClick={goToPreviousChapter} className="omed-button-ghost min-h-11 px-3 text-sm">
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Chapitre précédent</span>
            <span className="sm:hidden">Précédent</span>
          </button>
          <button type="button" onClick={goToNextChapter} className="omed-button-ghost min-h-11 px-3 text-sm">
            <span className="hidden sm:inline">Chapitre suivant</span>
            <span className="sm:hidden">Suivant</span>
            <ChevronRight size={18} />
          </button>
        </footer>
      )}

      {focusMode && (
        <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-bg-card/96 px-2 py-1.5 shadow-[var(--shadow-panel)] backdrop-blur-xl">
          <button type="button" onClick={goToPreviousChapter} className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary" aria-label="Chapitre précédent">
            <ChevronLeft size={19} />
          </button>
          <button type="button" onClick={() => setFocusMode(false)} className="flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary" aria-label="Quitter le mode focus">
            <Minimize2 size={16} strokeWidth={1.6} />
            Quitter le focus
          </button>
          <button type="button" onClick={goToNextChapter} className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary" aria-label="Chapitre suivant">
            <ChevronRight size={19} />
          </button>
        </div>
      )}

      {showAudio && <AudioPlayer translation={effectiveTranslation} bookId={effectiveBookId} chapter={chapterNum} onClose={() => setShowAudio(false)} />}
    </div>
  );
};

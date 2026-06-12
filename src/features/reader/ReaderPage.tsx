import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { BookOpenText, ChevronLeft, ChevronRight, GitCompare, Headphones, Maximize2, Minimize2, NotebookPen, WifiOff } from 'lucide-react';
import { useBibleStore } from '../../store/useBibleStore';
import { BIBLE_BOOKS, FEATURED_TRANSLATIONS } from '../../utils/bibleApi';
import { ChapterView } from './ChapterView';
import { StudyPanel } from './StudyPanel';
import { AudioPlayer } from '../../components/AudioPlayer';
import { useOnlineStatus } from '../../utils/useOnlineStatus';
import { recordReadingDay } from '../../utils/readingActivity';

const getSupportedTranslation = (value?: string): string => FEATURED_TRANSLATIONS.some((item) => item.id === value) ? value! : 'lsg';
const getSupportedBook = (value?: string) => BIBLE_BOOKS.find((book) => book.id === value) ?? BIBLE_BOOKS.find((book) => book.id === 'jean') ?? BIBLE_BOOKS[0];
const clampChapter = (raw: string | number | undefined, max: number) => Math.min(Math.max(Number.parseInt(String(raw ?? 1), 10) || 1, 1), max);

export const ReaderPage: React.FC = () => {
  const params = useParams<{ translation: string; bookId: string; chapter: string }>();
  const navigate = useNavigate();
  const [showAudio, setShowAudio] = React.useState(false);
  const [focusMode, setFocusMode] = React.useState(false);
  const [studyMode, setStudyMode] = React.useState(false);
  const isOnline = useOnlineStatus();

  const stored = useBibleStore();
  const setPosition = useBibleStore((state) => state.setPosition);
  const compareTranslation = useBibleStore((state) => state.compareTranslation);
  const setCompareTranslation = useBibleStore((state) => state.setCompareTranslation);

  const effectiveTranslation = getSupportedTranslation(params.translation || stored.translation);
  const currentBook = getSupportedBook(params.bookId || stored.bookId);
  const chapterNum = clampChapter(params.chapter || stored.chapter, currentBook.chapters);
  const compareWith = compareTranslation || (effectiveTranslation === 'darby' ? 'lsg' : 'darby');

  useEffect(() => setPosition(effectiveTranslation, currentBook.id, chapterNum), [effectiveTranslation, currentBook.id, chapterNum, setPosition]);
  useEffect(() => recordReadingDay(), [effectiveTranslation, currentBook.id, chapterNum]);
  useEffect(() => {
    if (!focusMode) return undefined;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setFocusMode(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [focusMode]);

  const navigateTo = (nextTranslation = effectiveTranslation, nextBook = currentBook.id, nextChapter = chapterNum) => navigate(`/read/${nextTranslation}/${nextBook}/${nextChapter}`);
  const goPrevious = () => {
    if (chapterNum > 1) return navigateTo(effectiveTranslation, currentBook.id, chapterNum - 1);
    const index = BIBLE_BOOKS.findIndex((book) => book.id === currentBook.id);
    if (index > 0) {
      const previous = BIBLE_BOOKS[index - 1];
      navigateTo(effectiveTranslation, previous.id, previous.chapters);
    }
  };
  const goNext = () => {
    if (chapterNum < currentBook.chapters) return navigateTo(effectiveTranslation, currentBook.id, chapterNum + 1);
    const index = BIBLE_BOOKS.findIndex((book) => book.id === currentBook.id);
    if (index < BIBLE_BOOKS.length - 1) navigateTo(effectiveTranslation, BIBLE_BOOKS[index + 1].id, 1);
  };

  const selectClass = 'min-h-11 w-full rounded-2xl border border-border bg-bg-card px-3 text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/35';

  return (
    <div className={clsx('mx-auto space-y-4', focusMode ? 'max-w-5xl' : 'max-w-6xl')}>
      {!focusMode && (
        <header className="sticky top-0 z-30 -mx-4 border-b border-border bg-bg-primary/92 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:rounded-[1.7rem] lg:border lg:bg-bg-card lg:p-4 lg:shadow-[var(--shadow-soft)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-text-muted"><BookOpenText size={14} /> Bible</p>
              <h1 className="truncate text-2xl font-bold text-text-primary">{currentBook.name} {chapterNum}</h1>
            </div>
            {!isOnline && <span className="flex items-center gap-1 rounded-full bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary"><WifiOff size={14} /> Hors ligne</span>}
          </div>

          <div className="grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)_7rem_auto]">
            <label className="sr-only" htmlFor="translation-select">Traduction</label>
            <select id="translation-select" value={effectiveTranslation} onChange={(event) => navigateTo(event.target.value)} className={selectClass}>{FEATURED_TRANSLATIONS.map((item) => <option key={item.id} value={item.id}>{item.short}</option>)}</select>
            <label className="sr-only" htmlFor="book-select">Livre</label>
            <select id="book-select" value={currentBook.id} onChange={(event) => navigateTo(effectiveTranslation, event.target.value, 1)} className={selectClass}>{BIBLE_BOOKS.map((book) => <option key={book.id} value={book.id}>{book.name}</option>)}</select>
            <label className="sr-only" htmlFor="chapter-select">Chapitre</label>
            <select id="chapter-select" value={chapterNum} onChange={(event) => navigateTo(effectiveTranslation, currentBook.id, Number(event.target.value))} className={selectClass}>{Array.from({ length: currentBook.chapters }, (_, index) => index + 1).map((num) => <option key={num} value={num}>{num}</option>)}</select>
            <div className="grid grid-cols-4 gap-1 sm:flex">
              <button type="button" onClick={() => setShowAudio(true)} className="flex min-h-11 items-center justify-center rounded-2xl border border-border bg-bg-card px-3 text-text-secondary hover:text-text-primary" aria-label="Écouter ce chapitre"><Headphones size={18} /></button>
              <button type="button" onClick={() => setCompareTranslation(compareTranslation ? null : compareWith)} className={clsx('flex min-h-11 items-center justify-center rounded-2xl border px-3', compareTranslation ? 'border-accent-gold/45 bg-accent-gold/12 text-accent-gold' : 'border-border bg-bg-card text-text-secondary')} aria-label="Comparer une traduction"><GitCompare size={18} /></button>
              <button type="button" onClick={() => setStudyMode((value) => !value)} className={clsx('flex min-h-11 items-center justify-center rounded-2xl border px-3', studyMode ? 'border-accent-gold/45 bg-accent-gold/12 text-accent-gold' : 'border-border bg-bg-card text-text-secondary')} aria-label="Afficher notes et favoris"><NotebookPen size={18} /></button>
              <button type="button" onClick={() => setFocusMode(true)} className="flex min-h-11 items-center justify-center rounded-2xl border border-border bg-bg-card px-3 text-text-secondary hover:text-text-primary" aria-label="Activer le mode focus"><Maximize2 size={18} /></button>
            </div>
          </div>
        </header>
      )}

      {focusMode && <button type="button" onClick={() => setFocusMode(false)} className="fixed right-4 top-4 z-40 flex min-h-11 items-center gap-2 rounded-2xl bg-bg-card px-4 text-sm font-semibold shadow-[var(--shadow-soft)]"><Minimize2 size={17} /> Quitter</button>}

      <div className={clsx('grid gap-4', studyMode && !focusMode ? 'xl:grid-cols-[minmax(0,1fr)_22rem]' : '')}>
        <div className="min-w-0 space-y-4">
          <ChapterView translation={effectiveTranslation} bookId={currentBook.id} chapter={chapterNum} focus={focusMode} />
          {compareTranslation && !focusMode && <ChapterView translation={compareTranslation} bookId={currentBook.id} chapter={chapterNum} comparison />}
          <nav className="grid grid-cols-2 gap-3" aria-label="Navigation entre chapitres">
            <button type="button" onClick={goPrevious} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-bg-card font-semibold text-text-primary"><ChevronLeft size={18} /> Précédent</button>
            <button type="button" onClick={goNext} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent-gold font-semibold text-white">Suivant <ChevronRight size={18} /></button>
          </nav>
        </div>
        {studyMode && !focusMode && <StudyPanel translation={effectiveTranslation} bookId={currentBook.id} chapter={chapterNum} />}
      </div>
      {showAudio && <AudioPlayer translation={effectiveTranslation} bookId={currentBook.id} chapter={chapterNum} onClose={() => setShowAudio(false)} />}
    </div>
  );
};

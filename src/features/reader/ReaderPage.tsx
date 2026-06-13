import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { BookMarked, ChevronLeft, ChevronRight, GitCompare, Headphones, Maximize2, Minimize2, NotebookPen, WifiOff } from 'lucide-react';
import { useBibleStore } from '../../store/useBibleStore';
import { BIBLE_BOOKS } from '../../utils/bibleApi';
import { ChapterView } from './ChapterView';
import { StudyPanel } from './StudyPanel';
import { AudioPlayer } from '../../components/AudioPlayer';
import { BiblePicker } from '../../components/reader/BiblePicker';
import { PassageSelectorButton } from '../../components/reader/PassageSelectorButton';
import { useOnlineStatus } from '../../utils/useOnlineStatus';
import { recordReadingDay } from '../../utils/readingActivity';
import { clampChapterForBook, getSupportedBook, getSupportedTranslation, getTranslationLabel } from '../../utils/bibleNavigation';
import { useStudyStore } from '../../store/useStudyStore';
import { formatStudyReference } from '../../utils/study';

export const ReaderPage: React.FC = () => {
  const params = useParams<{ translation: string; bookId: string; chapter: string }>();
  const navigate = useNavigate();
  const [showAudio, setShowAudio] = React.useState(false);
  const [focusMode, setFocusMode] = React.useState(false);
  const [studyMode, setStudyMode] = React.useState(false);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const isOnline = useOnlineStatus();

  const stored = useBibleStore();
  const setPosition = useBibleStore((state) => state.setPosition);
  const compareTranslation = useBibleStore((state) => state.compareTranslation);
  const setCompareTranslation = useBibleStore((state) => state.setCompareTranslation);
  const createStudySession = useStudyStore((state) => state.createStudySession);

  const effectiveTranslation = getSupportedTranslation(params.translation || stored.translation);
  const currentBook = getSupportedBook(params.bookId || stored.bookId);
  const chapterNum = clampChapterForBook(currentBook.id, params.chapter || stored.chapter);
  const compareWith = compareTranslation || (effectiveTranslation === 'darby' ? 'lsg' : 'darby');

  useEffect(() => setPosition(effectiveTranslation, currentBook.id, chapterNum), [effectiveTranslation, currentBook.id, chapterNum, setPosition]);
  useEffect(() => recordReadingDay(), [effectiveTranslation, currentBook.id, chapterNum]);
  useEffect(() => {
    if (!focusMode) return undefined;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setFocusMode(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [focusMode]);

  const navigateTo = (nextTranslation = effectiveTranslation, nextBook = currentBook.id, nextChapter = chapterNum) =>
    navigate(`/read/${nextTranslation}/${nextBook}/${clampChapterForBook(nextBook, nextChapter)}`);
  const goPrevious = () => {
    if (chapterNum > 1) return navigateTo(effectiveTranslation, currentBook.id, chapterNum - 1);
    const index = BIBLE_BOOKS.findIndex((book) => book.id === currentBook.id);
    if (index > 0) {
      const previous = BIBLE_BOOKS[index - 1];
      navigateTo(effectiveTranslation, previous.id, previous.chapters);
    }
  };
  const startStudySession = () => {
    const reference = formatStudyReference({ bookId: currentBook.id, chapter: chapterNum });
    const id = createStudySession({
      translation: effectiveTranslation,
      bookId: currentBook.id,
      chapter: chapterNum,
      reference,
      title: `Étude — ${reference}`,
    });
    navigate(`/study/${id}`);
  };

  const goNext = () => {
    if (chapterNum < currentBook.chapters) return navigateTo(effectiveTranslation, currentBook.id, chapterNum + 1);
    const index = BIBLE_BOOKS.findIndex((book) => book.id === currentBook.id);
    if (index < BIBLE_BOOKS.length - 1) navigateTo(effectiveTranslation, BIBLE_BOOKS[index + 1].id, 1);
  };

  const bookIndex = BIBLE_BOOKS.findIndex((book) => book.id === currentBook.id);
  const actionButton = (active: boolean) => clsx(
    'flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors',
    active ? 'border-accent-gold/45 bg-accent-gold/12 text-accent-gold' : 'border-border bg-bg-card text-text-secondary hover:text-text-primary'
  );

  return (
    <div className={clsx('mx-auto space-y-4', focusMode ? 'max-w-3xl' : 'max-w-4xl')}>
      {!focusMode && (
        <header className="sticky top-0 z-30 -mx-4 border-b border-border bg-bg-primary/92 px-4 py-2.5 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:rounded-[1.7rem] lg:border lg:bg-bg-card lg:px-4 lg:py-3 lg:shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2">
            <PassageSelectorButton
              bookName={currentBook.name}
              chapter={chapterNum}
              translationLabel={getTranslationLabel(effectiveTranslation)}
              onClick={() => setPickerOpen(true)}
            />
            <div className="ml-auto flex items-center gap-1.5">
              {!isOnline && <span className="mr-1 flex items-center gap-1 rounded-full bg-bg-secondary px-2.5 py-1 text-xs font-semibold text-text-secondary"><WifiOff size={13} /> <span className="hidden sm:inline">Hors ligne</span></span>}
              <button type="button" onClick={startStudySession} className={actionButton(false)} aria-label="Étudier ce passage" title="Étudier ce passage"><BookMarked size={18} /></button>
              <button type="button" onClick={() => setShowAudio(true)} className={actionButton(false)} aria-label="Écouter ce chapitre"><Headphones size={18} /></button>
              <button type="button" onClick={() => setCompareTranslation(compareTranslation ? null : compareWith)} className={actionButton(Boolean(compareTranslation))} aria-label="Comparer une traduction"><GitCompare size={18} /></button>
              <button type="button" onClick={() => setStudyMode((value) => !value)} className={clsx(actionButton(studyMode), 'hidden sm:flex')} aria-label="Afficher notes et favoris"><NotebookPen size={18} /></button>
              <button type="button" onClick={() => setFocusMode(true)} className={actionButton(false)} aria-label="Activer le mode focus"><Maximize2 size={18} /></button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button type="button" onClick={startStudySession} className="inline-flex min-h-9 items-center gap-2 rounded-2xl border border-accent-gold/30 bg-accent-gold/10 px-3 text-xs font-bold text-accent-gold sm:hidden"><BookMarked size={14} /> Étudier ce passage</button>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-secondary">
              <div className="h-full rounded-full bg-accent-gold/70" style={{ width: `${Math.round((chapterNum / currentBook.chapters) * 100)}%` }} />
            </div>
            <span className="shrink-0 text-xs font-semibold text-text-muted">Chap. {chapterNum}/{currentBook.chapters} · Livre {bookIndex + 1}/{BIBLE_BOOKS.length}</span>
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

      <BiblePicker
        open={pickerOpen}
        translation={effectiveTranslation}
        bookId={currentBook.id}
        chapter={chapterNum}
        onClose={() => setPickerOpen(false)}
        onSelect={(t, b, c) => navigateTo(t, b, c)}
      />
      {showAudio && <AudioPlayer translation={effectiveTranslation} bookId={currentBook.id} chapter={chapterNum} onClose={() => setShowAudio(false)} />}
    </div>
  );
};

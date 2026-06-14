import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { BookMarked, ChevronLeft, ChevronRight, GitCompare, Headphones, Maximize2, Minimize2, NotebookPen, WifiOff } from 'lucide-react';
// Présentation reconstruite avec les primitives BaseKit (via la façade `src/ui`).
// La couche données, le routing et les stores restent intacts.
import { Stack, Inline, Card, Button, IconButton, Badge, Progress } from '../../ui';
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
  // Helper de tonalité BaseKit pour les actions de la barre d'outils :
  // une action active emprunte la tonalité « primary » (or laiton) en variante douce.
  const toolbarTone = (active: boolean) => ({
    tone: active ? ('primary' as const) : ('neutral' as const),
    variant: active ? ('soft' as const) : ('ghost' as const),
  });

  return (
    <Stack gap="md" className={clsx('mx-auto', focusMode ? 'max-w-3xl' : 'max-w-4xl')}>
      {!focusMode && (
        <Card
          variant="outlined"
          padding="none"
          radius="xl"
          className="sticky top-0 z-30 -mx-4 border-x-0 border-t-0 border-b border-border bg-bg-primary/92 px-4 py-2.5 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border lg:bg-bg-card lg:px-4 lg:py-3 lg:shadow-[var(--shadow-soft)]"
        >
          <Inline align="center" gap="sm">
            <PassageSelectorButton
              bookName={currentBook.name}
              chapter={chapterNum}
              translationLabel={getTranslationLabel(effectiveTranslation)}
              onClick={() => setPickerOpen(true)}
            />
            <Inline align="center" gap="xs" className="ml-auto">
              {!isOnline && (
                <Badge tone="warning" variant="soft" iconLeft={<WifiOff size={13} />} className="mr-1">
                  <span className="hidden sm:inline">Hors ligne</span>
                </Badge>
              )}
              <IconButton size="lg" {...toolbarTone(false)} onClick={startStudySession} aria-label="Étudier ce passage" title="Étudier ce passage" icon={<BookMarked size={18} />} />
              <IconButton size="lg" {...toolbarTone(false)} onClick={() => setShowAudio(true)} aria-label="Écouter ce chapitre" icon={<Headphones size={18} />} />
              <IconButton size="lg" {...toolbarTone(Boolean(compareTranslation))} onClick={() => setCompareTranslation(compareTranslation ? null : compareWith)} aria-label="Comparer une traduction" icon={<GitCompare size={18} />} />
              <IconButton size="lg" {...toolbarTone(studyMode)} onClick={() => setStudyMode((value) => !value)} aria-label="Afficher notes et favoris" className="hidden sm:inline-flex" icon={<NotebookPen size={18} />} />
              <IconButton size="lg" {...toolbarTone(false)} onClick={() => setFocusMode(true)} aria-label="Activer le mode focus" icon={<Maximize2 size={18} />} />
            </Inline>
          </Inline>
          <Inline align="center" gap="sm" wrap className="mt-2">
            <Button size="sm" tone="primary" variant="soft" onClick={startStudySession} iconLeft={<BookMarked size={14} />} className="sm:hidden">
              Étudier ce passage
            </Button>
            <Progress value={chapterNum} max={currentBook.chapters} tone="primary" className="h-1.5 flex-1" />
            <span className="shrink-0 text-xs font-semibold text-text-muted">Chap. {chapterNum}/{currentBook.chapters} · Livre {bookIndex + 1}/{BIBLE_BOOKS.length}</span>
          </Inline>
        </Card>
      )}

      {focusMode && (
        <Button
          tone="neutral"
          variant="soft"
          onClick={() => setFocusMode(false)}
          iconLeft={<Minimize2 size={17} />}
          className="fixed right-4 top-4 z-40 shadow-[var(--shadow-soft)]"
        >
          Quitter
        </Button>
      )}

      <div className={clsx('grid gap-4', studyMode && !focusMode ? 'xl:grid-cols-[minmax(0,1fr)_22rem]' : '')}>
        <Stack gap="md" className="min-w-0">
          <ChapterView translation={effectiveTranslation} bookId={currentBook.id} chapter={chapterNum} focus={focusMode} />
          {compareTranslation && !focusMode && <ChapterView translation={compareTranslation} bookId={currentBook.id} chapter={chapterNum} comparison />}
          <nav className="grid grid-cols-2 gap-3" aria-label="Navigation entre chapitres">
            <Button fullWidth tone="neutral" variant="outline" onClick={goPrevious} iconLeft={<ChevronLeft size={18} />}>Précédent</Button>
            <Button fullWidth tone="primary" variant="solid" onClick={goNext} iconRight={<ChevronRight size={18} />}>Suivant</Button>
          </nav>
        </Stack>
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
    </Stack>
  );
};

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronDown, ChevronLeft, ChevronRight, Crosshair, GitCompare, Headphones, Maximize2, Minimize2, NotebookPen, PanelRightOpen, WifiOff } from 'lucide-react';
import { useBibleStore } from '../../store/useBibleStore';
import { BIBLE_BOOKS, FEATURED_TRANSLATIONS } from '../../utils/bibleApi';
import { ChapterView } from './ChapterView';
import { StudyPanel } from './StudyPanel';
import { AudioPlayer } from '../../components/AudioPlayer';
import { useOnlineStatus } from '../../utils/useOnlineStatus';
import { recordReadingDay } from '../../utils/readingActivity';

const SelectChevron = () => <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />;

const getSupportedTranslation = (value?: string): string => (
  FEATURED_TRANSLATIONS.some((translation) => translation.id === value) ? value! : 'lsg'
);

const getSupportedBook = (value?: string) => (
  BIBLE_BOOKS.find((book) => book.id === value) ?? BIBLE_BOOKS.find((book) => book.id === 'jean') ?? BIBLE_BOOKS[0]
);

const clampChapter = (rawChapter: string | number | undefined, maxChapters: number): number => {
  const parsed = Number.parseInt(String(rawChapter ?? 1), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, maxChapters);
};

export const ReaderPage: React.FC = () => {
  const { translation, bookId, chapter } = useParams<{ translation: string; bookId: string; chapter: string }>();
  const navigate = useNavigate();
  const [showAudio, setShowAudio] = React.useState(false);
  const [focusMode, setFocusMode] = React.useState(false);
  const [studyMode, setStudyMode] = React.useState(true);
  const isOnline = useOnlineStatus();

  const storedTranslation = useBibleStore((state) => state.translation);
  const storedBookId = useBibleStore((state) => state.bookId);
  const storedChapter = useBibleStore((state) => state.chapter);
  const setPosition = useBibleStore((state) => state.setPosition);
  const compareTranslation = useBibleStore((state) => state.compareTranslation);
  const setCompareTranslation = useBibleStore((state) => state.setCompareTranslation);

  const effectiveTranslation = getSupportedTranslation(translation || storedTranslation || 'lsg');
  const currentBook = getSupportedBook(bookId || storedBookId || 'jean');
  const effectiveBookId = currentBook.id;
  const chapterNum = clampChapter(chapter || storedChapter || 1, currentBook.chapters);
  const defaultCompareTranslation = effectiveTranslation === 'darby' ? 'lsg' : 'darby';
  const currentTranslation = FEATURED_TRANSLATIONS.find((t) => t.id === effectiveTranslation);

  useEffect(() => {
    setPosition(effectiveTranslation, effectiveBookId, chapterNum);
  }, [effectiveTranslation, effectiveBookId, chapterNum, setPosition]);

  useEffect(() => {
    recordReadingDay();
  }, [effectiveTranslation, effectiveBookId, chapterNum]);

  useEffect(() => {
    if (!focusMode) return undefined;
    document.body.classList.add('omed-focus-reading');
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFocusMode(false);
    };
    window.addEventListener('keydown', exitOnEscape);
    return () => {
      document.body.classList.remove('omed-focus-reading');
      window.removeEventListener('keydown', exitOnEscape);
    };
  }, [focusMode]);

  const goToPreviousChapter = () => {
    if (chapterNum > 1) {
      navigate(`/read/${effectiveTranslation}/${effectiveBookId}/${chapterNum - 1}`);
      return;
    }
    const index = BIBLE_BOOKS.findIndex((book) => book.id === effectiveBookId);
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
    const index = BIBLE_BOOKS.findIndex((book) => book.id === effectiveBookId);
    if (index < BIBLE_BOOKS.length - 1) {
      const next = BIBLE_BOOKS[index + 1];
      navigate(`/read/${effectiveTranslation}/${next.id}/1`);
    }
  };

  const bookProgress = Math.round((chapterNum / currentBook.chapters) * 100);
  const selectClass = 'min-h-11 w-full appearance-none rounded-2xl border border-border bg-bg-card/78 pl-3 pr-9 text-sm font-semibold text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-accent-gold/35 focus:outline-none focus:ring-2 focus:ring-accent-gold/35';

  return (
    <div className={clsx('reader-chapel relative', focusMode && 'reader-chapel--focus')}>
      {!focusMode && (
        <section className="mb-6 overflow-hidden rounded-[2.2rem] border border-border bg-bg-card/56 p-4 shadow-[var(--shadow-soft)] sm:p-5 lg:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
            <div>
              <p className="omed-kicker mb-4">Codex Reader · manuscrit actif</p>
              <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                <h1 className="font-display text-5xl font-semibold leading-none tracking-[-0.055em] text-text-primary sm:text-6xl lg:text-7xl">{currentBook.name}</h1>
                <span className="rounded-[1.2rem] border border-accent-gold/30 bg-accent-gold/12 px-4 py-2 font-display text-3xl text-accent-gold">{chapterNum}</span>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">La référence devient le centre : passage, traduction, étude et audio gravitent autour du manuscrit.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="relative"><select value={effectiveTranslation} onChange={(e) => navigate(`/read/${e.target.value}/${effectiveBookId}/${chapterNum}`)} className={selectClass} aria-label="Choisir la traduction">{FEATURED_TRANSLATIONS.map((t) => <option key={t.id} value={t.id}>{t.short} · {t.name}</option>)}</select><SelectChevron /></div>
              <div className="relative"><select value={effectiveBookId} onChange={(e) => navigate(`/read/${effectiveTranslation}/${e.target.value}/1`)} className={selectClass} aria-label="Choisir le livre">{BIBLE_BOOKS.map((book) => <option key={book.id} value={book.id}>{book.name}</option>)}</select><SelectChevron /></div>
              <div className="relative"><select value={chapterNum} onChange={(e) => navigate(`/read/${effectiveTranslation}/${effectiveBookId}/${e.target.value}`)} className={selectClass} aria-label="Choisir le chapitre">{Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((chapterValue) => <option key={chapterValue} value={chapterValue}>Chapitre {chapterValue}</option>)}</select><SelectChevron /></div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-primary/70" role="progressbar" aria-valuemin={1} aria-valuemax={currentBook.chapters} aria-valuenow={chapterNum} aria-label={`Progression dans ${currentBook.name}`}>
                <div className="h-full rounded-full bg-accent-gold transition-all duration-300" style={{ width: `${bookProgress}%` }} />
              </div>
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-text-muted">{bookProgress}%</span>
            </div>
            <div className="flex snap-x gap-2 overflow-x-auto pb-1 lg:overflow-visible lg:pb-0">
              {!isOnline && <span className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border border-border px-3 text-sm font-semibold text-accent-brown"><WifiOff size={16} /> Cache</span>}
              <button type="button" onClick={() => setShowAudio(true)} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border border-border bg-bg-primary/55 px-3 text-sm font-semibold text-text-secondary hover:border-accent-gold/35 hover:text-accent-gold"><Headphones size={16} /> Audio</button>
              <button type="button" onClick={() => setCompareTranslation(compareTranslation ? null : defaultCompareTranslation)} className={clsx('inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border px-3 text-sm font-semibold', compareTranslation ? 'border-accent-gold/45 bg-accent-gold/14 text-accent-gold' : 'border-border bg-bg-primary/55 text-text-secondary hover:border-accent-gold/35 hover:text-accent-gold')}><GitCompare size={16} /> Comparer</button>
              <button type="button" onClick={() => setStudyMode((mode) => !mode)} className={clsx('inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border px-3 text-sm font-semibold', studyMode ? 'border-accent-gold/45 bg-accent-gold/14 text-accent-gold' : 'border-border bg-bg-primary/55 text-text-secondary hover:border-accent-gold/35 hover:text-accent-gold')}><NotebookPen size={16} /> Étude</button>
              <button type="button" onClick={() => setFocusMode(true)} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border border-border bg-bg-primary/55 px-3 text-sm font-semibold text-text-secondary hover:border-accent-gold/35 hover:text-accent-gold"><Maximize2 size={16} /> Focus</button>
            </div>
          </div>
        </section>
      )}

      <section className={clsx('grid gap-6', focusMode ? 'mx-auto max-w-6xl' : studyMode ? 'xl:grid-cols-[minmax(0,1fr)_21rem]' : '')}>
        <div className="min-w-0 space-y-6">
          <div className={clsx(compareTranslation && !focusMode ? 'grid gap-6 2xl:grid-cols-2' : '')}>
            <ChapterView translation={effectiveTranslation} bookId={effectiveBookId} chapter={chapterNum} focus={focusMode} />
            {compareTranslation && !focusMode && (
              <div className="min-w-0 rounded-[2rem] border border-accent-gold/22 bg-bg-primary/35 p-3">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
                  <div>
                    <p className="omed-kicker">Comparaison distincte</p>
                    <p className="mt-1 text-sm text-text-muted">Deuxième témoin aligné visuellement.</p>
                  </div>
                  <div className="relative min-w-44"><select value={compareTranslation} onChange={(e) => setCompareTranslation(e.target.value)} className={selectClass} aria-label="Traduction de comparaison">{FEATURED_TRANSLATIONS.map((t) => <option key={t.id} value={t.id}>{t.short} · {t.name}</option>)}</select><SelectChevron /></div>
                </div>
                <ChapterView translation={compareTranslation} bookId={effectiveBookId} chapter={chapterNum} comparison />
              </div>
            )}
          </div>

          {!focusMode && (
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={goToPreviousChapter} disabled={effectiveBookId === BIBLE_BOOKS[0].id && chapterNum === 1} className="group flex min-h-16 items-center justify-between rounded-[1.6rem] border border-border bg-bg-card/52 px-4 text-left text-sm font-semibold text-text-secondary transition-colors hover:border-accent-gold/35 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-45">
                <ChevronLeft size={20} /><span>Chapitre précédent</span>
              </button>
              <button type="button" onClick={goToNextChapter} disabled={effectiveBookId === BIBLE_BOOKS[BIBLE_BOOKS.length - 1].id && chapterNum === currentBook.chapters} className="group flex min-h-16 items-center justify-between rounded-[1.6rem] border border-border bg-bg-card/52 px-4 text-left text-sm font-semibold text-text-secondary transition-colors hover:border-accent-gold/35 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-45">
                <span>Chapitre suivant</span><ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {studyMode && !focusMode && (
          <aside className="min-w-0 xl:sticky xl:top-6 xl:self-start">
            <div className="mb-4 rounded-[1.8rem] border border-border bg-bg-card/52 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-primary"><PanelRightOpen size={17} className="text-accent-gold" /> Console d’étude</div>
              <p className="mt-2 text-sm leading-6 text-text-secondary">Notes, références et prières restent dans la colonne d’atelier, hors du flux du manuscrit.</p>
            </div>
            <StudyPanel translation={effectiveTranslation} bookId={effectiveBookId} chapter={chapterNum} />
          </aside>
        )}
      </section>

      {focusMode && (
        <div className="verse-action-surface fixed bottom-[calc(1.1rem+env(safe-area-inset-bottom))] left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full px-2 py-1.5">
          <button type="button" onClick={goToPreviousChapter} className="flex min-h-12 min-w-12 items-center justify-center rounded-full text-text-secondary hover:bg-bg-secondary hover:text-text-primary" aria-label="Chapitre précédent"><ChevronLeft size={19} /></button>
          <div className="hidden items-center gap-2 px-3 text-sm font-semibold text-text-secondary sm:flex"><Crosshair size={16} className="text-accent-gold" /> {currentBook.name} {chapterNum} · {currentTranslation?.short}</div>
          <button type="button" onClick={() => setFocusMode(false)} className="flex min-h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-text-secondary hover:bg-bg-secondary hover:text-text-primary" aria-label="Quitter le mode focus"><Minimize2 size={16} /> Quitter</button>
          <button type="button" onClick={goToNextChapter} className="flex min-h-12 min-w-12 items-center justify-center rounded-full text-text-secondary hover:bg-bg-secondary hover:text-text-primary" aria-label="Chapitre suivant"><ChevronRight size={19} /></button>
        </div>
      )}

      {showAudio && <AudioPlayer translation={effectiveTranslation} bookId={effectiveBookId} chapter={chapterNum} onClose={() => setShowAudio(false)} />}
    </div>
  );
};

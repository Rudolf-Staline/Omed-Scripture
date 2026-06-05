import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBibleStore } from '../../store/useBibleStore';
import { BIBLE_BOOKS, FEATURED_TRANSLATIONS } from '../../utils/bibleApi';
import { ChapterView } from './ChapterView';
import { AudioPlayer } from '../../components/AudioPlayer';
import { useOnlineStatus } from '../../utils/useOnlineStatus';
import { ChevronDown, ChevronLeft, ChevronRight, Headphones, GitCompare, WifiOff } from 'lucide-react';

const SelectChevron = () => (
  <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
);

export const ReaderPage: React.FC = () => {
  const { translation, bookId, chapter } = useParams<{ translation: string; bookId: string; chapter: string }>();
  const navigate = useNavigate();
  const [showAudio, setShowAudio] = React.useState(false);
  const isOnline = useOnlineStatus();

  const setPosition = useBibleStore((state) => state.setPosition);
  const compareTranslation = useBibleStore((state) => state.compareTranslation);
  const setCompareTranslation = useBibleStore((state) => state.setCompareTranslation);

  const chapterNum = parseInt(chapter || '1', 10);

  useEffect(() => {
    if (translation && bookId && chapter) {
      setPosition(translation, bookId, chapterNum);
    }
  }, [translation, bookId, chapter, chapterNum, setPosition]);

  const currentBook = BIBLE_BOOKS.find((b) => b.id === bookId) || BIBLE_BOOKS[0];
  const currentTranslation = FEATURED_TRANSLATIONS.find((t) => t.id === translation);

  const selectClass = 'min-h-11 appearance-none rounded-xl border border-border bg-bg-card/72 pl-3.5 pr-9 text-sm font-semibold text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-accent-gold/35 focus:outline-none focus:ring-1 focus:ring-accent-gold/50';

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-20 -mx-4 mb-5 border-b border-border bg-bg-primary/88 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 lg:-mx-14 lg:px-14">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="omed-kicker">Lecteur</p>
            <h1 className="font-display text-2xl leading-tight text-text-primary sm:text-3xl">{currentBook.name} {chapterNum}</h1>
          </div>
          <p className="hidden text-right text-xs uppercase tracking-[0.18em] text-text-muted sm:block">{currentTranslation?.short ?? translation?.toUpperCase()}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[8rem] flex-1 sm:flex-none">
            <select value={translation} onChange={(e) => navigate(`/read/${e.target.value}/${bookId}/${chapterNum}`)} className={`${selectClass} w-full`} aria-label="Traduction">
              {FEATURED_TRANSLATIONS.map((t) => <option key={t.id} value={t.id}>{t.short} · {t.name}</option>)}
            </select>
            <SelectChevron />
          </div>

          <div className="relative min-w-[9rem] flex-[1.4] sm:flex-none">
            <select value={bookId} onChange={(e) => navigate(`/read/${translation}/${e.target.value}/1`)} className={`${selectClass} w-full`} aria-label="Livre">
              {BIBLE_BOOKS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <SelectChevron />
          </div>

          <div className="relative min-w-[7.5rem] flex-1 sm:flex-none">
            <select value={chapterNum} onChange={(e) => navigate(`/read/${translation}/${bookId}/${e.target.value}`)} className={`${selectClass} w-full`} aria-label="Chapitre">
              {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((c) => <option key={c} value={c}>Chapitre {c}</option>)}
            </select>
            <SelectChevron />
          </div>

          {!isOnline && (
            <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-accent-brown/35 bg-accent-brown/12 px-3 text-xs font-semibold text-accent-brown">
              <WifiOff size={14} />
              Hors ligne
            </span>
          )}

          <div className="hidden flex-1 md:block" />

          <button type="button" onClick={() => setShowAudio(true)} className="omed-button-ghost min-h-11 px-3 text-sm" aria-label="Ouvrir l'audio">
            <Headphones size={17} strokeWidth={1.5} />
            <span className="hidden sm:inline">Audio</span>
          </button>

          <button type="button" onClick={() => setCompareTranslation(compareTranslation ? null : 'kjv')} className={`min-h-11 rounded-xl border px-3 text-sm font-semibold ${compareTranslation ? 'border-accent-gold/45 bg-accent-gold/12 text-accent-gold' : 'omed-button-ghost'}`} aria-pressed={Boolean(compareTranslation)}>
            <GitCompare size={17} strokeWidth={1.5} />
            <span className="hidden sm:inline">Comparer</span>
          </button>
        </div>
      </header>

      <div className={`flex-1 gap-5 ${compareTranslation ? 'grid lg:grid-cols-2' : 'block'}`}>
        <section className={compareTranslation ? 'min-w-0 border-b border-border pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5' : ''}>
          <ChapterView translation={translation || 'lsg'} bookId={bookId || 'jean'} chapter={chapterNum} />
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
            <ChapterView translation={compareTranslation} bookId={bookId || 'jean'} chapter={chapterNum} />
          </section>
        )}
      </div>

      <footer className="mt-8 mb-4 flex items-center justify-between gap-3 border-t border-border pt-5">
        <button type="button" onClick={() => chapterNum > 1 ? navigate(`/read/${translation}/${bookId}/${chapterNum - 1}`) : (() => { const i = BIBLE_BOOKS.findIndex((b) => b.id === bookId); if (i > 0) { const p = BIBLE_BOOKS[i - 1]; navigate(`/read/${translation}/${p.id}/${p.chapters}`); } })()} className="omed-button-ghost min-h-11 px-3 text-sm">
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Chapitre précédent</span>
          <span className="sm:hidden">Précédent</span>
        </button>
        <button type="button" onClick={() => chapterNum < currentBook.chapters ? navigate(`/read/${translation}/${bookId}/${chapterNum + 1}`) : (() => { const i = BIBLE_BOOKS.findIndex((b) => b.id === bookId); if (i < BIBLE_BOOKS.length - 1) { const n = BIBLE_BOOKS[i + 1]; navigate(`/read/${translation}/${n.id}/1`); } })()} className="omed-button-ghost min-h-11 px-3 text-sm">
          <span className="hidden sm:inline">Chapitre suivant</span>
          <span className="sm:hidden">Suivant</span>
          <ChevronRight size={18} />
        </button>
      </footer>

      {showAudio && <AudioPlayer translation={translation || 'kjv'} bookId={bookId || 'jean'} chapter={chapterNum} onClose={() => setShowAudio(false)} />}
    </div>
  );
};

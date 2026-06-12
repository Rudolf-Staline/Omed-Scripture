import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, BookOpenText } from 'lucide-react';
import { useUiStore } from '../store/useUiStore';
import { DAILY_VERSE_TRANSLATION } from '../data/dailyVerses';
import { formatBibleReference } from '../utils/bibleBooks';

// Mode méditation : un verset, plein écran, avec un halo de respiration lent.
// Sortie au clavier (Échap) ou par le bouton de fermeture.
export const MeditationOverlay: React.FC = () => {
  const verse = useUiStore((state) => state.meditationVerse);
  const close = useUiStore((state) => state.closeMeditation);
  const navigate = useNavigate();

  useEffect(() => {
    if (!verse) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [verse, close]);

  if (!verse) return null;

  const reference = formatBibleReference(verse.bookId, verse.chapter, verse.verse);

  const openChapter = () => {
    close();
    navigate(`/read/${DAILY_VERSE_TRANSLATION}/${verse.bookId}/${verse.chapter}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mode méditation"
      className="fixed inset-0 z-[95] flex flex-col items-center justify-center overflow-hidden bg-bg-deep px-6 text-center"
    >
      <div className="pointer-events-none absolute inset-0 omed-starfield" aria-hidden="true" />
      <div
        className="meditation-ring pointer-events-none absolute h-[42rem] w-[42rem] max-w-[120vw] rounded-full border border-accent-gold/25"
        style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 62%)' }}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={close}
        aria-label="Quitter la méditation"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg-card/60 text-text-secondary backdrop-blur transition-colors hover:text-text-primary"
      >
        <X size={20} />
      </button>

      <div className="relative max-w-2xl">
        <p className="omed-kicker mb-6 text-accent-gold/80">Respirez · lisez lentement</p>
        <blockquote className="font-body text-2xl leading-relaxed text-text-primary sm:text-3xl sm:leading-[1.6]">
          « {verse.text} »
        </blockquote>
        <p className="mt-7 font-display text-lg font-semibold text-accent-gold">— {reference}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={openChapter} className="omed-button-ghost min-h-11 px-4 text-sm">
            <BookOpenText size={16} strokeWidth={1.6} />
            Ouvrir le chapitre
          </button>
          <button type="button" onClick={close} className="omed-button-primary min-h-11 px-5 text-sm">
            Terminer
          </button>
        </div>
        <p className="mt-6 text-xs text-text-muted">Échap pour quitter</p>
      </div>
    </div>
  );
};

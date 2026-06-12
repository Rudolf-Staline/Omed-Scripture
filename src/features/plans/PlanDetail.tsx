import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { usePlansStore } from '../../store/usePlansStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { READING_PLANS, type ReadingPlanPassage } from '../../data/readingPlans';
import { formatBibleReference } from '../../utils/bibleBooks';

const formatPassage = (passage: ReadingPlanPassage): string =>
  passage.chapterEnd
    ? `${formatBibleReference(passage.bookId, passage.chapterStart)}–${passage.chapterEnd}`
    : formatBibleReference(passage.bookId, passage.chapterStart);

export const PlanDetail: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  const progress = usePlansStore((state) => state.progress);
  const markDayComplete = usePlansStore((state) => state.markDayComplete);
  const unmarkDayComplete = usePlansStore((state) => state.unmarkDayComplete);
  const defaultTranslation = useSettingsStore((state) => state.settings.defaultTranslation) || 'lsg';

  const plan = READING_PLANS.find((p) => p.id === planId);
  const planProgress = progress[planId || ''];

  if (!plan || !planProgress || plan.status === 'planned') {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center text-text-muted">
        Parcours introuvable, non commencé ou pas encore disponible.
        <br />
        <button onClick={() => navigate('/plans')} className="mt-4 text-accent-brown underline">Retour aux parcours</button>
      </div>
    );
  }

  const completedCount = planProgress.completedDays.length;
  const percentage = Math.round((completedCount / plan.durationDays) * 100);
  const completedSet = new Set(planProgress.completedDays);
  const nextReading = plan.readings.find((reading) => !completedSet.has(reading.day)) ?? null;
  const currentDay = nextReading ? nextReading.day : plan.durationDays;
  const isFinished = completedCount >= plan.durationDays;

  return (
    <div className="mx-auto max-w-4xl py-4 md:py-8">
      <button onClick={() => navigate('/plans')} className="mb-6 flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary">
        <ArrowLeft size={16} />
        Retour aux parcours
      </button>

      <div className="reading-surface mb-8 p-6 md:p-8">
        <h1 className="mb-3 font-display text-4xl font-semibold tracking-tight text-text-primary">{plan.title}</h1>
        <p className="mb-6 font-body leading-8 text-text-secondary">{plan.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-sm">
          <div className="rounded-2xl border border-border bg-bg-card/45 p-4">
            <p className="text-text-muted">Progression</p>
            <p className="text-text-primary font-semibold">{completedCount} / {plan.durationDays} jours</p>
          </div>
          <div className="rounded-2xl border border-border bg-bg-card/45 p-4">
            <p className="text-text-muted">Avancement</p>
            <p className="text-text-primary font-semibold">{percentage}%</p>
          </div>
          <div className="rounded-2xl border border-border bg-bg-card/45 p-4">
            <p className="text-text-muted">Étape actuelle</p>
            <p className="text-text-primary font-semibold">Jour {currentDay}</p>
          </div>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-bg-secondary">
          <div className="h-full rounded-full bg-accent-gold transition-all duration-500 ease-out" style={{ width: `${percentage}%` }} />
        </div>

        {isFinished ? (
          <p className="mt-5 rounded-2xl border border-accent-sage/35 bg-accent-sage/10 p-4 text-sm font-semibold leading-6 text-accent-sage">
            Parcours achevé. Que cette lecture continue de porter du fruit.
          </p>
        ) : nextReading && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent-gold/30 bg-accent-gold/8 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-gold">Reprendre ici</p>
              <p className="mt-1 font-semibold text-text-primary">
                Jour {nextReading.day}{nextReading.title ? ` · ${nextReading.title}` : ''} — {nextReading.passages.map(formatPassage).join(', ')}
              </p>
            </div>
            {nextReading.passages[0] && (
              <button
                onClick={() => navigate(`/read/${defaultTranslation}/${nextReading.passages[0].bookId}/${nextReading.passages[0].chapterStart}`)}
                className="omed-button-primary min-h-11 px-4 text-sm"
              >
                <BookOpen size={15} />
                Ouvrir la lecture du jour
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-text-primary">Le chemin</h2>

        {/* Chemin vertical : filet de liaison + nœuds d'étape */}
        <ol className="relative ml-3 space-y-3 border-l border-border pl-6">
          {plan.readings.map((reading) => {
            const isCompleted = planProgress.completedDays.includes(reading.day);
            const isCurrent = !isCompleted && reading.day === currentDay;
            const firstPassage = reading.passages[0];

            return (
              <li key={reading.day} className="relative">
                {/* Nœud sur le filet */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-[1.95rem] top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? 'border-accent-sage bg-accent-sage/30'
                      : isCurrent
                        ? 'border-accent-gold bg-accent-gold/25'
                        : 'border-border bg-bg-card'
                  }`}
                >
                  {isCompleted && <span className="h-1.5 w-1.5 rounded-full bg-accent-sage" />}
                </span>

                <div className={`rounded-[1.25rem] border p-4 transition-colors ${
                  isCurrent ? 'border-accent-gold/45 bg-accent-gold/8' : isCompleted ? 'border-accent-sage/30 bg-accent-sage/8' : 'border-border bg-bg-card/60'
                }`}>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-text-primary">
                      Jour {reading.day}{reading.title ? ` · ${reading.title}` : ''}
                      {isCurrent && <span className="ml-2 rounded-full border border-accent-gold/40 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-gold">Aujourd'hui</span>}
                    </p>
                    <button
                      type="button"
                      onClick={() => { if (isCompleted) unmarkDayComplete(plan.id, reading.day); else markDayComplete(plan.id, reading.day); }}
                      className={`min-h-9 rounded-xl border px-3 text-xs font-semibold transition-colors ${isCompleted ? 'border-accent-sage text-accent-sage' : 'border-border text-text-secondary hover:border-accent-gold/50'}`}
                      aria-pressed={isCompleted}
                    >
                      {isCompleted ? 'Fait ✓' : 'Marquer comme fait'}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-text-secondary">{reading.passages.map(formatPassage).join(', ')}</p>
                    {firstPassage && (
                      <button type="button" onClick={() => navigate(`/read/${defaultTranslation}/${firstPassage.bookId}/${firstPassage.chapterStart}`)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-brown transition-colors hover:text-accent-gold">
                        <BookOpen size={15} /> Ouvrir
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

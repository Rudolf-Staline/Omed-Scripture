import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { usePlansStore } from '../../store/usePlansStore';
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
  const currentDay = Math.min(completedCount + 1, plan.durationDays);

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
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-text-primary">Étapes du parcours</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {plan.readings.map((reading) => {
            const isCompleted = planProgress.completedDays.includes(reading.day);
            const firstPassage = reading.passages[0];

            return (
              <div key={reading.day} className={`rounded-[1.25rem] border p-4 transition-colors ${isCompleted ? 'border-accent-sage/40 bg-accent-sage/12' : 'border-border bg-bg-card/60'}`}>
                <div className="flex items-center justify-between mb-3 gap-3">
                  <div>
                    <p className="text-xs text-text-muted">Étape</p>
                    <p className="font-semibold text-text-primary">Jour {reading.day}{reading.title ? ` · ${reading.title}` : ''}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (isCompleted) unmarkDayComplete(plan.id, reading.day);
                      else markDayComplete(plan.id, reading.day);
                    }}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${isCompleted ? 'border-accent-sage text-accent-sage' : 'border-border text-text-secondary hover:border-accent-gold/50'}`}
                  >
                    {isCompleted ? 'Marqué comme fait' : 'Marquer comme fait'}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-text-secondary">Lecture suggérée : {reading.passages.map(formatPassage).join(', ')}</p>
                  {firstPassage && (
                    <button onClick={() => navigate(`/read/kjv/${firstPassage.bookId}/${firstPassage.chapterStart}`)} className="inline-flex items-center gap-2 text-sm font-semibold text-accent-brown hover:text-accent-gold">
                      <BookOpen size={15} />
                      Ouvrir
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

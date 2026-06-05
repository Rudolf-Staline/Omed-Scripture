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
      <div className="py-20 text-center text-text-muted">
        Parcours introuvable, non commencé ou pas encore disponible.
        <br />
        <button onClick={() => navigate('/plans')} className="text-accent-brown underline mt-4">Retour aux parcours</button>
      </div>
    );
  }

  const completedCount = planProgress.completedDays.length;
  const percentage = Math.round((completedCount / plan.durationDays) * 100);
  const currentDay = Math.min(completedCount + 1, plan.durationDays);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <button onClick={() => navigate('/plans')} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 text-sm font-medium">
        <ArrowLeft size={16} />
        Retour aux parcours
      </button>

      <div className="bg-bg-card border border-border rounded-2xl p-8 mb-8">
        <h1 className="font-display text-3xl font-bold mb-3 text-text-primary">{plan.title}</h1>
        <p className="font-body text-text-secondary mb-6 leading-relaxed">{plan.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-sm">
          <div className="rounded-lg border border-border p-3 bg-bg-secondary/40">
            <p className="text-text-muted">Progression</p>
            <p className="text-text-primary font-semibold">{completedCount} / {plan.durationDays} jours</p>
          </div>
          <div className="rounded-lg border border-border p-3 bg-bg-secondary/40">
            <p className="text-text-muted">Avancement</p>
            <p className="text-text-primary font-semibold">{percentage}%</p>
          </div>
          <div className="rounded-lg border border-border p-3 bg-bg-secondary/40">
            <p className="text-text-muted">Étape actuelle</p>
            <p className="text-text-primary font-semibold">Jour {currentDay}</p>
          </div>
        </div>

        <div className="h-2 w-full bg-bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-accent-gold transition-all duration-500 ease-out" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-text-primary">Étapes du parcours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plan.readings.map((reading) => {
            const isCompleted = planProgress.completedDays.includes(reading.day);
            const firstPassage = reading.passages[0];

            return (
              <div key={reading.day} className={`rounded-xl border p-4 transition-colors ${isCompleted ? 'border-accent-sage/40 bg-accent-sage/10' : 'border-border bg-bg-card'}`}>
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
                    className={`text-xs font-medium px-3 py-1.5 rounded border ${isCompleted ? 'border-accent-sage text-accent-sage' : 'border-border text-text-secondary hover:border-accent-gold/50'}`}
                  >
                    {isCompleted ? 'Marqué comme fait' : 'Marquer comme fait'}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-text-secondary">Lecture suggérée : {reading.passages.map(formatPassage).join(', ')}</p>
                  {firstPassage && (
                    <button onClick={() => navigate(`/read/kjv/${firstPassage.bookId}/${firstPassage.chapterStart}`)} className="inline-flex items-center gap-2 text-sm font-medium text-accent-brown hover:underline">
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

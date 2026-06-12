import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Clock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { PageHero } from '../../components/layout/PageHero';
import { useMemoryStore } from '../../store/useMemoryStore';
import { formatDueLabel, getDueMemoryVerses, getMemoryStats } from '../../utils/memory';
import type { MemoryReviewGrade, MemoryVerse } from '../../types/memory';

const REVIEW_ACTIONS: { grade: MemoryReviewGrade; label: string; helper: string }[] = [
  { grade: 'again', label: 'Encore', helper: '10 min' },
  { grade: 'hard', label: 'Difficile', helper: '1 j' },
  { grade: 'good', label: 'Bien', helper: 'selon rythme' },
  { grade: 'easy', label: 'Facile', helper: '+ long' },
];

const FILTERS = [
  { id: 'due', label: 'À revoir' },
  { id: 'all', label: 'Tous' },
  { id: 'mastered', label: 'Maîtrisés' },
] as const;

type MemoryFilter = typeof FILTERS[number]['id'];

const MemoryCard: React.FC<{ item: MemoryVerse; onReview: (grade: MemoryReviewGrade) => void; onRemove: () => void }> = ({ item, onReview, onRemove }) => (
  <article className="rounded-[1.65rem] border border-border bg-bg-card p-4 shadow-[var(--shadow-soft)]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-gold">{item.reference} · {item.translation.toUpperCase()}</p>
        <p className="mt-3 text-lg leading-8 text-text-primary">« {item.text} »</p>
      </div>
      <button type="button" onClick={onRemove} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-text-muted hover:bg-bg-secondary hover:text-[color:var(--color-danger)]" aria-label={`Retirer ${item.reference}`}>
        <Trash2 size={17} />
      </button>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
      <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1"><Clock size={13} /> {formatDueLabel(item.dueAt)}</span>
      <span className="rounded-full border border-border px-3 py-1">{item.reviewCount} révision{item.reviewCount > 1 ? 's' : ''}</span>
      <span className="rounded-full border border-border px-3 py-1">{item.status}</span>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {REVIEW_ACTIONS.map((action) => (
        <button key={action.grade} type="button" onClick={() => onReview(action.grade)} className="rounded-2xl border border-border bg-bg-primary px-3 py-2 text-left font-semibold text-text-primary hover:border-accent-gold/45 hover:bg-accent-gold/10">
          <span className="block text-sm">{action.label}</span>
          <span className="block text-[0.65rem] uppercase tracking-[0.14em] text-text-muted">{action.helper}</span>
        </button>
      ))}
    </div>
    <Link to={`/read/${item.translation}/${item.bookId}/${item.chapter}`} className="mt-4 inline-flex min-h-10 items-center rounded-2xl border border-border px-4 text-sm font-semibold text-text-primary hover:border-accent-gold/45">
      Ouvrir le chapitre
    </Link>
  </article>
);

export const MemoryPage: React.FC = () => {
  const memoryVerses = useMemoryStore((state) => state.memoryVerses);
  const reviewMemoryVerse = useMemoryStore((state) => state.reviewMemoryVerse);
  const removeMemoryVerse = useMemoryStore((state) => state.removeMemoryVerse);
  const [filter, setFilter] = useState<MemoryFilter>('due');

  const stats = useMemo(() => getMemoryStats(memoryVerses), [memoryVerses]);
  const due = useMemo(() => getDueMemoryVerses(memoryVerses), [memoryVerses]);
  const visible = useMemo(() => {
    if (filter === 'due') return due;
    if (filter === 'mastered') return memoryVerses.filter((item) => item.status === 'mastered');
    return [...memoryVerses].sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt));
  }, [due, filter, memoryVerses]);

  const handleReview = (item: MemoryVerse, grade: MemoryReviewGrade) => {
    reviewMemoryVerse(item.id, grade);
    toast.success('Révision enregistrée.');
  };

  const handleRemove = (item: MemoryVerse) => {
    removeMemoryVerse(item.id);
    toast('Verset retiré de la mémorisation.');
  };

  return (
    <PageCanvas width="wide" className="space-y-6">
      <PageHero kicker="Mémorisation" title="Versets à retenir" icon={Brain} intro="Ajoutez des versets depuis le lecteur, révisez-les avec un rythme simple, puis laissez Omed vous montrer ce qui revient aujourd’hui.">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-3xl border border-border bg-bg-primary/65 p-4"><p className="text-2xl font-bold text-text-primary">{stats.total}</p><p className="text-sm text-text-muted">versets</p></div>
          <div className="rounded-3xl border border-border bg-bg-primary/65 p-4"><p className="text-2xl font-bold text-text-primary">{stats.due}</p><p className="text-sm text-text-muted">à revoir</p></div>
          <div className="rounded-3xl border border-border bg-bg-primary/65 p-4"><p className="text-2xl font-bold text-text-primary">{stats.mastered}</p><p className="text-sm text-text-muted">maîtrisés</p></div>
          <div className="rounded-3xl border border-border bg-bg-primary/65 p-4"><p className="text-2xl font-bold text-text-primary">{stats.nextDueAt ? formatDueLabel(stats.nextDueAt) : '—'}</p><p className="text-sm text-text-muted">prochaine révision</p></div>
        </div>
      </PageHero>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrer les versets à mémoriser">
        {FILTERS.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setFilter(tab.id)} className={`inline-flex min-h-11 items-center rounded-2xl border px-4 font-semibold ${filter === tab.id ? 'border-accent-gold bg-accent-gold text-white' : 'border-border bg-bg-card text-text-secondary hover:text-text-primary'}`} aria-pressed={filter === tab.id}>
            {tab.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <section className="rounded-[1.8rem] border border-dashed border-border bg-bg-card p-8 text-center">
          <Brain className="mx-auto text-accent-gold" size={38} />
          <h2 className="mt-4 text-2xl font-bold text-text-primary">{memoryVerses.length === 0 ? 'Aucun verset à mémoriser' : 'Rien à revoir ici'}</h2>
          <p className="mx-auto mt-2 max-w-xl text-text-secondary">Touchez un verset dans le lecteur, puis choisissez l’action de mémorisation pour l’ajouter ici.</p>
          <Link to="/reader" className="mt-5 inline-flex min-h-11 items-center rounded-2xl bg-accent-gold px-5 font-bold text-white">Ouvrir la Bible</Link>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2" aria-label="Versets de mémorisation">
          {visible.map((item) => <MemoryCard key={item.id} item={item} onReview={(grade) => handleReview(item, grade)} onRemove={() => handleRemove(item)} />)}
        </section>
      )}
    </PageCanvas>
  );
};

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpenText, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { EmptyScene } from '../../components/layout/EmptyScene';
import { FilterBar, FilterChip } from '../../components/layout/FilterBar';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { PageHero } from '../../components/layout/PageHero';
import { useBibleStore } from '../../store/useBibleStore';
import { useStudyStore } from '../../store/useStudyStore';
import type { StudySessionStatus } from '../../types/study';
import { formatStudyReference, getStudyStats } from '../../utils/study';
import { StudySessionCard } from './StudySessionCard';

const FILTERS: Array<{ id: StudySessionStatus | 'all'; label: string }> = [
  { id: 'all', label: 'Toutes' },
  { id: 'draft', label: 'Brouillons' },
  { id: 'completed', label: 'Terminées' },
  { id: 'archived', label: 'Archivées' },
];

export const StudyPage: React.FC = () => {
  const navigate = useNavigate();
  const { translation, bookId, chapter } = useBibleStore();
  const sessions = useStudyStore((state) => state.sessions);
  const createStudySession = useStudyStore((state) => state.createStudySession);
  const archiveStudySession = useStudyStore((state) => state.archiveStudySession);
  const deleteStudySession = useStudyStore((state) => state.deleteStudySession);
  const [filter, setFilter] = useState<StudySessionStatus | 'all'>('all');
  const [query, setQuery] = useState('');

  const stats = useMemo(() => getStudyStats(sessions), [sessions]);
  const visibleSessions = useMemo(() => {
    const term = query.trim().toLowerCase();
    return sessions
      .filter((session) => filter === 'all' || session.status === filter)
      .filter((session) => !term || session.title.toLowerCase().includes(term) || session.reference.toLowerCase().includes(term) || session.tags.some((tag) => tag.toLowerCase().includes(term)));
  }, [sessions, filter, query]);

  const createFromCurrentPassage = () => {
    const reference = formatStudyReference({ bookId, chapter });
    const id = createStudySession({ translation, bookId, chapter, reference, title: `Étude — ${reference}` });
    navigate(`/study/${id}`);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Supprimer définitivement cette session d’étude ?')) return;
    deleteStudySession(id);
    toast.success('Session supprimée.');
  };

  return (
    <PageCanvas width="wide">
      <div className="space-y-6">
        <PageHero
          kicker="Étude biblique"
          title="Études bibliques"
          icon={BookOpenText}
          intro="Un espace pour observer le texte, l’interpréter dans son contexte, appliquer la Parole et répondre par la prière."
          actions={<button type="button" onClick={createFromCurrentPassage} className="omed-button-primary min-h-11 px-5"><Plus size={17} /> Nouvelle étude</button>}
        />

        <section className="grid gap-3 sm:grid-cols-4" aria-label="Statistiques des études">
          {[['Sessions', stats.total], ['Brouillons', stats.drafts], ['Terminées', stats.completed], ['Ce mois-ci', stats.thisMonth]].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-border bg-bg-card p-4"><p className="text-2xl font-bold text-text-primary">{value}</p><p className="text-sm text-text-muted">{label}</p></article>
          ))}
        </section>

        <section className="rounded-[1.7rem] border border-border bg-bg-card p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_18rem]">
            <FilterBar label="Statut">
              {FILTERS.map((item) => <FilterChip key={item.id} active={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</FilterChip>)}
            </FilterBar>
            <label className="relative block" htmlFor="study-search">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input id="study-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Titre, référence ou tag…" className="min-h-11 w-full rounded-2xl border border-border bg-bg-primary pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold" />
            </label>
          </div>
        </section>

        {visibleSessions.length === 0 ? (
          <EmptyScene icon={BookOpenText} title="Aucune étude pour ce filtre" message="Lancez une étude depuis le Reader ou créez-en une à partir de votre passage actuel." actionLabel="Nouvelle étude" onAction={createFromCurrentPassage} />
        ) : (
          <section className="grid gap-4 lg:grid-cols-2" aria-label="Sessions d’étude">
            {visibleSessions.map((session) => <StudySessionCard key={session.id} session={session} onArchive={(id) => { archiveStudySession(id); toast.success('Session archivée.'); }} onDelete={handleDelete} />)}
          </section>
        )}
      </div>
    </PageCanvas>
  );
};

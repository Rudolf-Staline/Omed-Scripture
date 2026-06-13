import React from 'react';
import { Link } from 'react-router-dom';
import { Archive, BookOpenText, Clock, Trash2 } from 'lucide-react';
import type { StudySession } from '../../types/study';

const STATUS_LABELS = { draft: 'Brouillon', completed: 'Terminée', archived: 'Archivée' } as const;

const excerpt = (session: StudySession) => {
  const text = session.observation || session.application || session.interpretation || 'Aucune note structurée pour le moment.';
  return text.length > 150 ? `${text.slice(0, 150)}…` : text;
};

export const StudySessionCard: React.FC<{
  session: StudySession;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ session, onArchive, onDelete }) => (
  <article className="rounded-[1.7rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)]">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-gold">{session.reference} · {session.translation.toUpperCase()}</p>
        <h2 className="mt-1 text-xl font-bold text-text-primary">{session.title}</h2>
      </div>
      <span className="rounded-full bg-bg-secondary px-3 py-1 text-xs font-bold text-text-secondary">{STATUS_LABELS[session.status]}</span>
    </div>
    <p className="mt-4 line-clamp-3 text-sm leading-6 text-text-secondary">{excerpt(session)}</p>
    {session.tags.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{session.tags.map((tag) => <span key={tag} className="rounded-full bg-accent-gold/10 px-2.5 py-1 text-xs font-semibold text-accent-gold">#{tag}</span>)}</div>}
    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
      <span className="mr-auto flex items-center gap-1.5 text-xs font-semibold text-text-muted"><Clock size={14} /> Mis à jour {new Date(session.updatedAt).toLocaleDateString('fr-FR')}</span>
      <Link to={`/study/${session.id}`} className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-accent-gold px-4 text-sm font-bold text-white"><BookOpenText size={16} /> Ouvrir</Link>
      {session.status !== 'archived' && <button type="button" onClick={() => onArchive(session.id)} className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-border px-3 text-sm font-semibold text-text-primary"><Archive size={15} /> Archiver</button>}
      <button type="button" onClick={() => onDelete(session.id)} className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-[color:var(--color-danger)]/25 px-3 text-sm font-semibold text-[color:var(--color-danger)]"><Trash2 size={15} /> Supprimer</button>
    </div>
  </article>
);

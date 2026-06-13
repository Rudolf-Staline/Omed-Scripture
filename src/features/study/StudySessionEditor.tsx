import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Archive, BookOpenText, Check, HandHeart, NotebookPen, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { EmptyScene } from '../../components/layout/EmptyScene';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { useCollectionsStore } from '../../store/useCollectionsStore';
import { useNotesStore } from '../../store/useNotesStore';
import { usePrayerStore } from '../../store/usePrayerStore';
import { useStudyStore } from '../../store/useStudyStore';
import type { StudySession } from '../../types/study';

const TAG_EXAMPLES = ['foi', 'sagesse', 'paix', 'repentance', 'gratitude', 'courage', 'espérance'];

type Draft = Pick<StudySession, 'title' | 'observation' | 'interpretation' | 'application' | 'prayer' | 'tags' | 'linkedCollectionIds'>;

const toDraft = (session: StudySession): Draft => ({
  title: session.title,
  observation: session.observation,
  interpretation: session.interpretation,
  application: session.application,
  prayer: session.prayer,
  tags: session.tags,
  linkedCollectionIds: session.linkedCollectionIds ?? [],
});

const StudyTextarea: React.FC<{ id: string; label: string; question: string; value: string; onChange: (value: string) => void }> = ({ id, label, question, value, onChange }) => (
  <label htmlFor={id} className="block rounded-[1.5rem] border border-border bg-bg-card p-4">
    <span className="block text-lg font-bold text-text-primary">{label}</span>
    <span className="mt-1 block text-sm text-accent-gold">{question}</span>
    <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} rows={7} className="mt-3 w-full rounded-2xl border border-border bg-bg-primary p-4 text-base leading-7 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-gold" placeholder="Écrivez librement vos notes structurées…" />
  </label>
);

export const StudySessionEditor: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const sessions = useStudyStore((state) => state.sessions);
  const updateStudySession = useStudyStore((state) => state.updateStudySession);
  const completeStudySession = useStudyStore((state) => state.completeStudySession);
  const archiveStudySession = useStudyStore((state) => state.archiveStudySession);
  const deleteStudySession = useStudyStore((state) => state.deleteStudySession);
  const addPrayer = usePrayerStore((state) => state.addPrayer);
  const addNote = useNotesStore((state) => state.addNote);
  const collections = useCollectionsStore((state) => state.collections);
  const session = useMemo(() => sessions.find((item) => item.id === sessionId), [sessions, sessionId]);
  const [draft, setDraft] = useState<Draft | null>(() => session ? toDraft(session) : null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !draft) return undefined;
    const timer = window.setTimeout(() => {
      updateStudySession(session.id, draft);
      setLastSavedAt(new Date().toISOString());
    }, 900);
    return () => window.clearTimeout(timer);
  }, [draft, session, updateStudySession]);

  if (!session || !draft) {
    return <PageCanvas><EmptyScene icon={BookOpenText} title="Session introuvable" message="Cette étude n’existe plus ou n’a pas encore été synchronisée sur cet appareil." actionLabel="Retour aux études" to="/study" /></PageCanvas>;
  }

  const saveNow = () => {
    updateStudySession(session.id, draft);
    setLastSavedAt(new Date().toISOString());
    toast.success('Étude enregistrée.');
  };

  const markCompleted = () => {
    saveNow();
    completeStudySession(session.id);
    toast.success('Étude marquée comme terminée.');
  };

  const archive = () => {
    saveNow();
    archiveStudySession(session.id);
    toast.success('Étude archivée.');
  };

  const remove = () => {
    if (!window.confirm('Supprimer définitivement cette session d’étude ?')) return;
    deleteStudySession(session.id);
    toast.success('Session supprimée.');
    navigate('/study');
  };

  const createPrayer = () => {
    if (!draft.prayer.trim()) {
      toast.error('Ajoutez d’abord un texte dans la section Prière.');
      return;
    }
    const prayerId = addPrayer({ title: draft.title, content: draft.prayer.trim(), category: 'meditation', verseRef: session.reference });
    updateStudySession(session.id, { linkedPrayerIds: [...(session.linkedPrayerIds ?? []), prayerId] });
    toast.success('Prière ajoutée au journal.');
  };

  const createNote = () => {
    const text = [draft.observation, draft.interpretation, draft.application].filter(Boolean).join('\n\n');
    if (!text.trim()) {
      toast.error('Ajoutez d’abord une observation, interprétation ou application.');
      return;
    }
    const noteId = addNote({ verseId: `${session.translation}-${session.bookId}-${session.chapter}`, verseText: session.reference, text, tags: draft.tags });
    updateStudySession(session.id, { linkedNoteIds: [...(session.linkedNoteIds ?? []), noteId] });
    toast.success('Note liée créée.');
  };

  const toggleCollection = (collectionId: string) => {
    setDraft((current) => {
      if (!current) return current;
      const currentIds = current.linkedCollectionIds ?? [];
      const linkedCollectionIds = currentIds.includes(collectionId) ? currentIds.filter((id) => id !== collectionId) : [...currentIds, collectionId];
      return { ...current, linkedCollectionIds };
    });
  };

  const setTagsFromInput = (value: string) => {
    setDraft((current) => current ? { ...current, tags: value.split(',').map((tag) => tag.trim()).filter(Boolean) } : current);
  };

  return (
    <PageCanvas width="wide">
      <div className="space-y-5">
        <header className="rounded-[2rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-gold">{session.reference} · {session.translation.toUpperCase()} · {session.status}</p>
              <label htmlFor="study-title" className="sr-only">Titre de l’étude</label>
              <input id="study-title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="mt-2 w-full rounded-2xl border border-transparent bg-transparent text-3xl font-bold text-text-primary focus:border-border focus:bg-bg-primary focus:px-3 focus:outline-none" />
              <p className="mt-2 text-sm text-text-muted">Autosave local activé. {lastSavedAt ? `Dernier enregistrement : ${new Date(lastSavedAt).toLocaleTimeString('fr-FR')}` : 'Modifiez un champ pour enregistrer.'}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={`/read/${session.translation}/${session.bookId}/${session.chapter}`} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-border px-4 font-semibold text-text-primary"><BookOpenText size={17} /> Ouvrir le passage</Link>
              <button type="button" onClick={saveNow} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-border px-4 font-semibold text-text-primary"><Save size={17} /> Enregistrer</button>
              <button type="button" onClick={markCompleted} className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-accent-gold px-4 font-bold text-white"><Check size={17} /> Terminer</button>
            </div>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <main className="space-y-4">
            <StudyTextarea id="study-observation" label="Observation" question="Que dit réellement le texte ?" value={draft.observation} onChange={(value) => setDraft({ ...draft, observation: value })} />
            <StudyTextarea id="study-interpretation" label="Interprétation" question="Que signifie ce passage dans son contexte ?" value={draft.interpretation} onChange={(value) => setDraft({ ...draft, interpretation: value })} />
            <StudyTextarea id="study-application" label="Application" question="Comment ce passage doit-il transformer ma journée ?" value={draft.application} onChange={(value) => setDraft({ ...draft, application: value })} />
            <StudyTextarea id="study-prayer" label="Prière" question="Comment puis-je répondre à Dieu par la prière ?" value={draft.prayer} onChange={(value) => setDraft({ ...draft, prayer: value })} />
          </main>

          <aside className="space-y-4">
            <section className="rounded-[1.5rem] border border-border bg-bg-card p-4">
              <label htmlFor="study-tags" className="font-bold text-text-primary">Tags</label>
              <input id="study-tags" value={draft.tags.join(', ')} onChange={(event) => setTagsFromInput(event.target.value)} placeholder="foi, paix, courage" className="mt-2 min-h-11 w-full rounded-2xl border border-border bg-bg-primary px-4 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold" />
              <div className="mt-3 flex flex-wrap gap-2">{TAG_EXAMPLES.map((tag) => <button key={tag} type="button" onClick={() => setDraft({ ...draft, tags: Array.from(new Set([...draft.tags, tag])) })} className="rounded-full bg-bg-secondary px-2.5 py-1 text-xs font-semibold text-text-secondary">{tag}</button>)}</div>
            </section>

            <section className="rounded-[1.5rem] border border-border bg-bg-card p-4">
              <h2 className="font-bold text-text-primary">Collections liées</h2>
              {collections.length === 0 ? <p className="mt-2 text-sm text-text-muted">Aucune collection existante à associer.</p> : <div className="mt-3 space-y-2">{collections.map((collection) => <label key={collection.id} className="flex items-center gap-2 rounded-2xl border border-border bg-bg-primary p-3 text-sm font-semibold text-text-primary"><input type="checkbox" checked={(draft.linkedCollectionIds ?? []).includes(collection.id)} onChange={() => toggleCollection(collection.id)} className="h-4 w-4 accent-accent-gold" /> {collection.title}</label>)}</div>}
            </section>

            <section className="rounded-[1.5rem] border border-border bg-bg-card p-4">
              <h2 className="font-bold text-text-primary">Lier aux carnets</h2>
              <div className="mt-3 grid gap-2">
                <button type="button" onClick={createPrayer} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-border px-4 font-semibold text-text-primary"><HandHeart size={17} /> Créer une prière liée</button>
                <button type="button" onClick={createNote} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-border px-4 font-semibold text-text-primary"><NotebookPen size={17} /> Créer une note liée</button>
              </div>
              <p className="mt-3 text-xs text-text-muted">Liens : {(session.linkedPrayerIds ?? []).length} prière(s), {(session.linkedNoteIds ?? []).length} note(s), {(draft.linkedCollectionIds ?? []).length} collection(s).</p>
            </section>

            <section className="rounded-[1.5rem] border border-border bg-bg-card p-4">
              <h2 className="font-bold text-text-primary">Actions</h2>
              <div className="mt-3 grid gap-2">
                <button type="button" onClick={archive} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-border px-4 font-semibold text-text-primary"><Archive size={17} /> Archiver</button>
                <button type="button" onClick={remove} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[color:var(--color-danger)]/25 px-4 font-semibold text-[color:var(--color-danger)]"><Trash2 size={17} /> Supprimer</button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </PageCanvas>
  );
};

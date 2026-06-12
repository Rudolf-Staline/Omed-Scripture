import React, { useMemo, useState } from 'react';
import { useNotesStore } from '../../store/useNotesStore';
import { useNavigate } from 'react-router-dom';
import { Edit3, Trash2, Check, X, Search, NotebookPen, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatBibleReference, getBookName, getBookOrder } from '../../utils/bibleBooks';
import { formatTagsInput, parseTagsInput } from '../../utils/noteTags';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { PageHero } from '../../components/layout/PageHero';
import { FilterBar, FilterChip } from '../../components/layout/FilterBar';
import { EmptyScene } from '../../components/layout/EmptyScene';
import { NotebookLayout } from '../../components/layout/NotebookLayout';
import { FilterRail } from '../../components/layout/FilterRail';

const formatDate = (value?: number) => {
  if (!value) return 'Date indisponible';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Date indisponible';
  return parsed.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
};

type SortMode = 'date' | 'biblical';

const splitVerseId = (verseId: string) => {
  const [translation = '', bookId = '', chapter = '', verse = ''] = verseId.split('-');
  return { translation, bookId, chapter, verse };
};

export const NotesPage: React.FC = () => {
  const notes = useNotesStore((state) => state.notes);
  const updateNote = useNotesStore((state) => state.updateNote);
  const removeNote = useNotesStore((state) => state.removeNote);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editTags, setEditTags] = useState('');
  const [query, setQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [bookFilter, setBookFilter] = useState<string>('tous');
  const [sortMode, setSortMode] = useState<SortMode>('date');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach((note) => (note.tags ?? []).forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [notes]);

  const booksInNotes = useMemo(() => {
    const ids = new Set(notes.map((note) => splitVerseId(note.verseId).bookId).filter(Boolean));
    return Array.from(ids).map((id) => ({ id, name: getBookName(id) })).sort((a, b) => getBookOrder(a.id) - getBookOrder(b.id));
  }, [notes]);

  const handleEditClick = (noteId: string, currentText: string, currentTags?: string[]) => {
    setEditingId(noteId);
    setEditText(currentText);
    setEditTags(formatTagsInput(currentTags));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditTags('');
  };

  const handleSaveEdit = (noteId: string) => {
    if (!editText.trim()) {
      toast.error('La note ne peut pas être vide.');
      return;
    }
    updateNote(noteId, editText.trim(), parseTagsInput(editTags));
    handleCancelEdit();
    toast.success('Note mise à jour.');
  };

  const handleCopyNote = async (noteText: string, verseText: string, reference: string) => {
    try {
      await navigator.clipboard.writeText(`« ${verseText} »\n— ${reference}\n\nNote : ${noteText}`);
      toast.success('Note copiée avec sa référence !');
    } catch {
      toast.error('Impossible de copier la note.');
    }
  };

  const visibleNotes = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = notes.filter((note) => {
      const { translation, bookId, chapter, verse } = splitVerseId(note.verseId);
      if (tagFilter && !(note.tags ?? []).includes(tagFilter)) return false;
      if (bookFilter !== 'tous' && bookId !== bookFilter) return false;
      if (!term) return true;
      const reference = formatBibleReference(bookId, chapter, verse).toLowerCase();
      return (
        note.text.toLowerCase().includes(term) ||
        note.verseText.toLowerCase().includes(term) ||
        reference.includes(term) ||
        translation.toLowerCase().includes(term) ||
        (note.tags ?? []).some((tag) => tag.includes(term))
      );
    });

    if (sortMode === 'date') return filtered.sort((a, b) => (b.dateModified ?? 0) - (a.dateModified ?? 0));
    return filtered.sort((a, b) => {
      const idA = splitVerseId(a.verseId);
      const idB = splitVerseId(b.verseId);
      const bookDiff = getBookOrder(idA.bookId) - getBookOrder(idB.bookId);
      if (bookDiff !== 0) return bookDiff;
      const chapterDiff = Number(idA.chapter) - Number(idB.chapter);
      if (chapterDiff !== 0) return chapterDiff;
      return Number(idA.verse) - Number(idB.verse);
    });
  }, [notes, query, tagFilter, bookFilter, sortMode]);

  if (notes.length === 0) {
    return (
      <PageCanvas width="reading">
        <EmptyScene icon={NotebookPen} title="Carnet d'étude" message="Vos notes apparaîtront ici. Touchez un verset dans le lecteur pour annoter un passage." actionLabel="Ouvrir le lecteur" to="/reader" />
      </PageCanvas>
    );
  }

  return (
    <PageCanvas width="wide">
      <NotebookLayout
        hero={<PageHero kicker="Carnet · étude" title="Mes notes d'étude" icon={NotebookPen} intro="Un espace personnel pour conserver ce qui vous parle pendant la lecture." />}
        tools={(
          <FilterRail title="Index du carnet">
          <label className="relative block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher…" aria-label="Rechercher dans les notes" className="min-h-11 w-full rounded-2xl border border-border bg-bg-card/70 pl-10 pr-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-gold" />
          </label>

          <div className="rounded-2xl border border-border bg-bg-card/50 p-4">
            <p className="omed-kicker mb-3">Trier</p>
            <FilterBar label="">
              <FilterChip active={sortMode === 'date'} onClick={() => setSortMode('date')}>Récentes</FilterChip>
              <FilterChip active={sortMode === 'biblical'} onClick={() => setSortMode('biblical')}>Ordre biblique</FilterChip>
            </FilterBar>

            {booksInNotes.length > 1 && (
              <label className="mt-4 block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Livre</span>
                <select value={bookFilter} onChange={(e) => setBookFilter(e.target.value)} aria-label="Filtrer par livre" className="min-h-10 w-full rounded-xl border border-border bg-bg-card/70 px-3 text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold">
                  <option value="tous">Tous les livres</option>
                  {booksInNotes.map((book) => <option key={book.id} value={book.id}>{book.name}</option>)}
                </select>
              </label>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="rounded-2xl border border-border bg-bg-card/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="omed-kicker">Tags</p>
                {tagFilter && <button type="button" onClick={() => setTagFilter(null)} className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-text-primary"><X size={12} /> Tout</button>}
              </div>
              <FilterBar label="">
                {allTags.map((tag) => (
                  <FilterChip key={tag} active={tagFilter === tag} onClick={() => setTagFilter(tagFilter === tag ? null : tag)}>#{tag}</FilterChip>
                ))}
              </FilterBar>
            </div>
          )}
          </FilterRail>
        )}
      >
        <div className="min-w-0">
          {visibleNotes.length === 0 ? (
            <div className="empty-state px-6 py-12 text-center">
              <h2 className="mb-2 font-display text-xl text-text-primary">Aucun résultat</h2>
              <p className="text-sm text-text-secondary">Aucune note ne correspond à ces critères. Essayez un autre mot-clé ou réinitialisez les filtres.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleNotes.map((note) => {
                const { translation, bookId, chapter, verse } = splitVerseId(note.verseId);
                const reference = formatBibleReference(bookId, chapter || '?', verse || '?');
                const hasVerseText = Boolean(note.verseText && note.verseText.trim());

                return (
                  <article key={note.id} className="omed-card p-4 sm:p-5">
                    <header className="mb-3 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="font-display text-lg font-semibold text-text-primary">{reference}</h2>
                        <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-accent-gold">{translation || 'n/a'} · {formatDate(note.dateModified)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => handleCopyNote(note.text, note.verseText, reference)} className="min-h-10 min-w-10 rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-secondary hover:text-accent-gold" aria-label="Copier la note avec sa référence"><Copy size={15} /></button>
                        <button type="button" onClick={() => handleEditClick(note.id, note.text, note.tags)} className="min-h-10 min-w-10 rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-secondary hover:text-accent-gold" aria-label="Modifier la note"><Edit3 size={15} /></button>
                        <button type="button" onClick={() => { if (window.confirm('Supprimer cette note ?')) { removeNote(note.id); toast.success('Note supprimée.'); } }} className="min-h-10 min-w-10 rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-secondary hover:text-[color:var(--color-danger)]" aria-label="Supprimer la note"><Trash2 size={15} /></button>
                      </div>
                    </header>

                    {hasVerseText && (
                      <p className="mb-3 border-l-2 border-accent-gold/40 pl-3 text-sm italic leading-7 text-text-secondary">« {note.verseText} »</p>
                    )}

                    {editingId === note.id ? (
                      <div>
                        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} aria-label="Texte de la note" className="min-h-[120px] w-full rounded-2xl border border-border bg-bg-primary p-3 font-body text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold" />
                        <label className="mt-3 block text-xs uppercase tracking-wide text-text-muted" htmlFor={`note-tags-${note.id}`}>Tags (séparés par des virgules)</label>
                        <input id={`note-tags-${note.id}`} value={editTags} onChange={(e) => setEditTags(e.target.value)} placeholder="grâce, prière, étude…" className="mt-1 w-full rounded-2xl border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold" />
                        <div className="mt-3 flex justify-end gap-2">
                          <button type="button" onClick={handleCancelEdit} className="inline-flex items-center gap-1 rounded-xl px-4 py-2 font-medium text-text-muted transition-colors hover:bg-bg-secondary"><X size={16} /> Annuler</button>
                          <button type="button" onClick={() => handleSaveEdit(note.id)} className="omed-button-primary px-4 py-2"><Check size={16} /> Enregistrer</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap font-body leading-8 text-text-primary">{note.text}</p>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-1.5">
                            {(note.tags ?? []).map((tag) => (
                              <button key={tag} type="button" onClick={() => setTagFilter(tag)} className="rounded-full border border-accent-gold/25 bg-accent-gold/8 px-2.5 py-0.5 text-xs font-semibold text-accent-gold transition-colors hover:border-accent-gold/50">#{tag}</button>
                            ))}
                          </div>
                          <button type="button" onClick={() => navigate(`/read/${translation}/${bookId}/${chapter}`)} className="text-sm font-semibold text-accent-brown transition-colors hover:text-accent-gold">Relire le chapitre</button>
                        </div>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </NotebookLayout>
    </PageCanvas>
  );
};

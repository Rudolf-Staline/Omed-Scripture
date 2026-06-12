import React, { useMemo, useState } from 'react';
import { useNotesStore } from '../../store/useNotesStore';
import { useNavigate } from 'react-router-dom';
import { Edit3, Trash2, Check, X, Search, BookOpenText, Copy, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { formatBibleReference, getBookName, getBookOrder } from '../../utils/bibleBooks';
import { formatTagsInput, parseTagsInput } from '../../utils/noteTags';

const formatDate = (value?: number) => {
  if (!value) return 'Date indisponible';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Date indisponible';
  return parsed.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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
    return Array.from(ids)
      .map((id) => ({ id, name: getBookName(id) }))
      .sort((a, b) => getBookOrder(a.id) - getBookOrder(b.id));
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
    const content = `« ${verseText} »\n— ${reference}\n\nNote : ${noteText}`;
    try {
      await navigator.clipboard.writeText(content);
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

    if (sortMode === 'date') {
      return filtered.sort((a, b) => (b.dateModified ?? 0) - (a.dateModified ?? 0));
    }

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
      <div className="mx-auto max-w-3xl py-20 text-center">
        <BookOpenText size={46} className="mx-auto mb-4 text-accent-gold opacity-70" />
        <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">Carnet de notes</h2>
        <p className="text-text-secondary max-w-lg mx-auto">
          Vos notes apparaîtront ici lorsque vous annoterez un passage. Touchez un verset dans le lecteur pour commencer.
        </p>
        <button
          onClick={() => navigate('/')}
          className="omed-button-ghost mt-6 px-6 py-2.5 font-semibold"
        >
          Commencer à lire
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-4 md:py-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-text-primary">Mes notes d'étude</h1>
      <p className="mt-3 mb-7 max-w-2xl text-text-secondary">
        Un espace personnel pour conserver ce qui vous parle pendant la lecture.
      </p>

      <div className="mb-6 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par référence, tag ou contenu…"
              className="min-h-12 w-full rounded-2xl border border-border bg-bg-card/70 pl-10 pr-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-gold"
            />
          </label>
          {booksInNotes.length > 1 && (
            <select
              value={bookFilter}
              onChange={(e) => setBookFilter(e.target.value)}
              aria-label="Filtrer par livre"
              className="min-h-12 rounded-2xl border border-border bg-bg-card/70 px-3 text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold"
            >
              <option value="tous">Tous les livres</option>
              {booksInNotes.map((book) => (
                <option key={book.id} value={book.id}>{book.name}</option>
              ))}
            </select>
          )}
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            aria-label="Trier les notes"
            className="min-h-12 rounded-2xl border border-border bg-bg-card/70 px-3 text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold"
          >
            <option value="date">Plus récentes</option>
            <option value="biblical">Ordre biblique</option>
          </select>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Tag size={14} className="text-text-muted" aria-hidden="true" />
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                aria-pressed={tagFilter === tag}
                className={clsx(
                  'min-h-8 rounded-full border px-3 text-xs font-semibold transition-colors',
                  tagFilter === tag
                    ? 'border-accent-gold/45 bg-accent-gold/12 text-accent-gold'
                    : 'border-border bg-bg-card/55 text-text-secondary hover:border-accent-gold/30 hover:text-text-primary'
                )}
              >
                #{tag}
              </button>
            ))}
            {tagFilter && (
              <button type="button" onClick={() => setTagFilter(null)} className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-text-primary">
                <X size={12} /> Réinitialiser
              </button>
            )}
          </div>
        )}
      </div>

      {visibleNotes.length === 0 ? (
        <div className="rounded-[1.5rem] border border-border bg-bg-card/60 p-10 text-center">
          <h2 className="font-display text-xl text-text-primary mb-2">Aucun résultat</h2>
          <p className="text-text-secondary">
            Aucune note ne correspond à ces critères. Essayez un autre mot-clé ou réinitialisez les filtres.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {visibleNotes.map((note) => {
            const { translation, bookId, chapter, verse } = splitVerseId(note.verseId);
            const reference = formatBibleReference(bookId, chapter || '?', verse || '?');
            const hasVerseText = Boolean(note.verseText && note.verseText.trim());
            const createdAt = formatDate(note.dateAdded);
            const modifiedAt = formatDate(note.dateModified);

            return (
              <article key={note.id} className="omed-card p-5">
                <header className="flex flex-wrap justify-between items-start gap-3 mb-4">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-text-primary">{reference}</h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-accent-gold">
                      Traduction : {translation || 'n/a'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyNote(note.text, note.verseText, reference)}
                      className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent-gold/50 hover:text-accent-gold"
                      title="Copier la note avec sa référence"
                    >
                      <Copy size={14} /> Copier
                    </button>
                    <button
                      onClick={() => handleEditClick(note.id, note.text, note.tags)}
                      className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent-gold/50 hover:text-accent-gold"
                      title="Modifier"
                    >
                      <Edit3 size={14} /> Modifier
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Supprimer cette note ?')) {
                          removeNote(note.id);
                          toast.success('Note supprimée.');
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-[color:var(--color-danger)]/50 hover:text-[color:var(--color-danger)]"
                      title="Supprimer"
                    >
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                </header>

                <section className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Extrait</p>
                    <p className="border-l border-accent-gold/40 pl-3 text-sm italic leading-7 text-text-secondary">
                      {hasVerseText ? `« ${note.verseText} »` : 'Extrait indisponible pour ce verset.'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Note</p>
                    {editingId === note.id ? (
                      <div>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="min-h-[130px] w-full rounded-2xl border border-border bg-bg-primary p-3 font-body text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold"
                        />
                        <label className="mt-3 block text-xs uppercase tracking-wide text-text-muted" htmlFor={`note-tags-${note.id}`}>
                          Tags (séparés par des virgules)
                        </label>
                        <input
                          id={`note-tags-${note.id}`}
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          placeholder="grâce, prière, étude…"
                          className="mt-1 w-full rounded-2xl border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold"
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            onClick={handleCancelEdit}
                            className="inline-flex items-center gap-1 rounded-xl px-4 py-2 font-medium text-text-muted transition-colors hover:bg-bg-secondary"
                          >
                            <X size={16} /> Annuler
                          </button>
                          <button
                            onClick={() => handleSaveEdit(note.id)}
                            className="omed-button-primary px-4 py-2"
                          >
                            <Check size={16} /> Enregistrer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap font-body leading-8 text-text-primary">{note.text}</p>
                        {note.tags && note.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {note.tags.map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => setTagFilter(tag)}
                                className="rounded-full border border-accent-gold/25 bg-accent-gold/8 px-2.5 py-0.5 text-xs font-semibold text-accent-gold transition-colors hover:border-accent-gold/50"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </section>

                <footer className="mt-5 pt-4 border-t border-border/70 flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted">
                  <div className="space-y-0.5">
                    <p>Créée le {createdAt}</p>
                    <p>Dernière modification : {modifiedAt}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/read/${translation}/${bookId}/${chapter}`)}
                    className="font-semibold text-accent-brown transition-colors hover:text-accent-gold"
                  >
                    Relire le chapitre
                  </button>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

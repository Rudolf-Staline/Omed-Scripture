import React, { useMemo, useState } from 'react';
import { useNotesStore } from '../../store/useNotesStore';
import { useNavigate } from 'react-router-dom';
import { Edit3, Trash2, Check, X, Search, BookOpenText } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatBibleReference } from '../../utils/bibleBooks';

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

export const NotesPage: React.FC = () => {
  const notes = useNotesStore((state) => state.notes);
  const updateNote = useNotesStore((state) => state.updateNote);
  const removeNote = useNotesStore((state) => state.removeNote);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [query, setQuery] = useState('');

  const handleEditClick = (noteId: string, currentText: string) => {
    setEditingId(noteId);
    setEditText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = (noteId: string) => {
    if (!editText.trim()) {
      toast.error('La note ne peut pas être vide.');
      return;
    }
    updateNote(noteId, editText.trim());
    setEditingId(null);
    setEditText('');
    toast.success('Note mise à jour.');
  };

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => (b.dateModified ?? 0) - (a.dateModified ?? 0)),
    [notes]
  );

  const filteredNotes = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return sortedNotes;

    return sortedNotes.filter((note) => {
      const [translation = '', bookId = '', chapter = '', verse = ''] = note.verseId.split('-');
      const reference = formatBibleReference(bookId, chapter, verse).toLowerCase();

      return (
        note.text.toLowerCase().includes(term) ||
        note.verseText.toLowerCase().includes(term) ||
        reference.includes(term) ||
        translation.toLowerCase().includes(term)
      );
    });
  }, [query, sortedNotes]);

  if (notes.length === 0) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <BookOpenText size={46} className="mx-auto mb-4 text-accent-gold opacity-70" />
        <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">Carnet de notes</h2>
        <p className="text-text-secondary max-w-lg mx-auto">
          Vos notes apparaîtront ici lorsque vous annoterez un passage.
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

      <div className="mb-6">
        <label className="relative block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par référence, traduction ou contenu…"
            className="min-h-12 w-full rounded-2xl border border-border bg-bg-card/70 pl-10 pr-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-gold"
          />
        </label>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="rounded-[1.5rem] border border-border bg-bg-card/60 p-10 text-center">
          <h2 className="font-display text-xl text-text-primary mb-2">Aucun résultat</h2>
          <p className="text-text-secondary">
            Aucune note ne correspond à votre recherche. Essayez un autre mot-clé.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredNotes.map((note) => {
            const [translation = 'n/a', bookId = '', chapter = '?', verse = '?'] = note.verseId.split('-');
            const reference = formatBibleReference(bookId, chapter, verse);
            const hasVerseText = Boolean(note.verseText && note.verseText.trim());
            const createdAt = formatDate(note.dateAdded);
            const modifiedAt = formatDate(note.dateModified);

            return (
              <article key={note.id} className="rounded-[1.35rem] border border-border bg-bg-card/62 p-5 shadow-[var(--shadow-soft)]">
                <header className="flex flex-wrap justify-between items-start gap-3 mb-4">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-text-primary">{reference}</h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-accent-gold">
                      Traduction : {translation}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(note.id, note.text)}
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
                      <p className="whitespace-pre-wrap font-body leading-8 text-text-primary">{note.text}</p>
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

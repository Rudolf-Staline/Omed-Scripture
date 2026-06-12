import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { ArrowLeft, Check, Search, X } from 'lucide-react';
import { FEATURED_TRANSLATIONS } from '../../data/translations';
import {
  getBooksByTestament,
  getSupportedBook,
  searchBooks,
  type BibleBook,
  type Testament,
} from '../../utils/bibleNavigation';

interface BiblePickerProps {
  open: boolean;
  translation: string;
  bookId: string;
  chapter: number;
  onClose: () => void;
  /** Appelé avec la sélection finale ; le parent gère la navigation /read. */
  onSelect: (translation: string, bookId: string, chapter: number) => void;
}

export const TestamentTabs: React.FC<{ value: Testament; onChange: (value: Testament) => void }> = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-1 rounded-2xl bg-bg-secondary p-1" role="tablist" aria-label="Testament">
    {(['AT', 'NT'] as Testament[]).map((testament) => (
      <button
        key={testament}
        type="button"
        role="tab"
        aria-selected={value === testament}
        onClick={() => onChange(testament)}
        className={clsx(
          'min-h-10 rounded-xl text-sm font-bold transition-colors',
          value === testament ? 'bg-accent-gold text-white shadow-[var(--shadow-soft)]' : 'text-text-secondary hover:text-text-primary'
        )}
      >
        {testament === 'AT' ? 'Ancien Testament' : 'Nouveau Testament'}
      </button>
    ))}
  </div>
);

export const TranslationSelector: React.FC<{ value: string; onChange: (id: string) => void }> = ({ value, onChange }) => (
  <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Traduction">
    {FEATURED_TRANSLATIONS.map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => onChange(item.id)}
        aria-pressed={value === item.id}
        title={item.name}
        className={clsx(
          'flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-bold transition-colors',
          value === item.id ? 'border-accent-gold/50 bg-accent-gold/14 text-accent-gold' : 'border-border bg-bg-card text-text-secondary hover:text-text-primary'
        )}
      >
        {value === item.id && <Check size={14} />} {item.short}
      </button>
    ))}
  </div>
);

export const BookGrid: React.FC<{ books: BibleBook[]; selectedId: string; onSelect: (book: BibleBook) => void }> = ({ books, selectedId, onSelect }) => {
  if (books.length === 0) {
    return <p className="px-1 py-6 text-center text-sm text-text-muted">Aucun livre ne correspond.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {books.map((book) => (
        <button
          key={book.id}
          type="button"
          onClick={() => onSelect(book)}
          className={clsx(
            'flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 text-left text-sm font-semibold transition-colors',
            book.id === selectedId ? 'border-accent-gold/50 bg-accent-gold/12 text-accent-gold' : 'border-border bg-bg-card text-text-primary hover:border-accent-gold/40'
          )}
        >
          <span className="truncate">{book.name}</span>
          <span className="shrink-0 text-xs font-bold text-text-muted">{book.chapters}</span>
        </button>
      ))}
    </div>
  );
};

export const ChapterGrid: React.FC<{ count: number; current: number; onSelect: (chapter: number) => void }> = ({ count, current, onSelect }) => (
  <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-8">
    {Array.from({ length: count }, (_, index) => index + 1).map((num) => (
      <button
        key={num}
        type="button"
        onClick={() => onSelect(num)}
        className={clsx(
          'flex min-h-11 items-center justify-center rounded-xl border text-sm font-bold transition-colors',
          num === current ? 'border-accent-gold/50 bg-accent-gold text-white' : 'border-border bg-bg-card text-text-primary hover:border-accent-gold/45'
        )}
      >
        {num}
      </button>
    ))}
  </div>
);

// Wrapper : ne monte le panneau (et son état local) que lorsqu'il est ouvert.
// Cela réinitialise naturellement la sélection à chaque ouverture, sans effet.
export const BiblePicker: React.FC<BiblePickerProps> = (props) => {
  if (!props.open) return null;
  return <BiblePickerPanel {...props} />;
};

const BiblePickerPanel: React.FC<BiblePickerProps> = ({ translation, bookId, chapter, onClose, onSelect }) => {
  const initialBook = getSupportedBook(bookId);
  const [step, setStep] = useState<'book' | 'chapter'>('book');
  const [testament, setTestament] = useState<Testament>(initialBook.testament === 'NT' ? 'NT' : 'AT');
  const [draftTranslation, setDraftTranslation] = useState(translation);
  const [draftBook, setDraftBook] = useState<BibleBook>(initialBook);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const byTestament = useMemo(() => getBooksByTestament(), []);
  const visibleBooks = useMemo(
    () => (query.trim() ? searchBooks(query) : byTestament[testament]),
    [query, testament, byTestament]
  );

  const handleBookSelect = (book: BibleBook) => {
    setDraftBook(book);
    setStep('chapter');
  };

  const handleChapterSelect = (value: number) => {
    onSelect(draftTranslation, draftBook.id, value);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label="Choisir un passage">
      <button type="button" aria-label="Fermer" onClick={onClose} className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
      <div className="relative flex max-h-[88vh] w-full flex-col rounded-t-[1.8rem] border border-border bg-bg-primary shadow-[var(--shadow-panel)] sm:max-w-2xl sm:rounded-[1.8rem]">
        <header className="flex items-center gap-2 border-b border-border px-4 py-3">
          {step === 'chapter' ? (
            <button type="button" onClick={() => setStep('book')} className="flex h-10 w-10 items-center justify-center rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary" aria-label="Retour aux livres"><ArrowLeft size={19} /></button>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center text-accent-gold" aria-hidden="true"><Search size={18} /></span>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{step === 'book' ? 'Choisir un livre' : 'Choisir un chapitre'}</p>
            <p className="truncate font-bold text-text-primary">{step === 'book' ? 'Bible' : draftBook.name}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary" aria-label="Fermer le sélecteur"><X size={19} /></button>
        </header>

        <div className="space-y-3 border-b border-border px-4 py-3">
          <TranslationSelector value={draftTranslation} onChange={setDraftTranslation} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {step === 'book' ? (
            <div className="space-y-3">
              <label className="relative block" htmlFor="bible-picker-search">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="bible-picker-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher un livre…"
                  className="min-h-11 w-full rounded-xl border border-border bg-bg-card pl-10 pr-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/35"
                />
              </label>
              {!query.trim() && <TestamentTabs value={testament} onChange={setTestament} />}
              <BookGrid books={visibleBooks} selectedId={draftBook.id} onSelect={handleBookSelect} />
            </div>
          ) : (
            <ChapterGrid count={draftBook.chapters} current={draftBook.id === bookId ? chapter : 0} onSelect={handleChapterSelect} />
          )}
        </div>
      </div>
    </div>
  );
};

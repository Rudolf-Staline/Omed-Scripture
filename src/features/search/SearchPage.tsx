import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ChevronRight, Loader2, History, Sparkles, X } from 'lucide-react';
import clsx from 'clsx';
import { searchVerses, FEATURED_TRANSLATIONS, BIBLE_BOOKS } from '../../utils/bibleApi';
import type { SearchResult } from '../../utils/bibleApi';
import { useSettingsStore } from '../../store/useSettingsStore';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { addSearchHistoryEntry, clearSearchHistory, getSearchHistory } from '../../utils/searchHistory';
import { splitByTerm } from '../../utils/highlightTerm';
import { getBookName } from '../../utils/bibleBooks';

const SEARCH_DIRECT_TRANSLATIONS = ['lsg', 'darby', 'kjv', 'web', 'bbe'];

const THEME_SUGGESTIONS = ['amour', 'pardon', 'espérance', 'paix', 'prière', 'grâce', 'consolation', 'sagesse'];

type TestamentFilter = 'tous' | 'AT' | 'NT';

const HighlightedText: React.FC<{ text: string; term: string }> = ({ text, term }) => (
  <>
    {splitByTerm(text, term).map((segment, index) =>
      segment.match ? (
        <mark key={index} className="rounded bg-accent-gold/25 px-0.5 text-text-primary">{segment.text}</mark>
      ) : (
        <React.Fragment key={index}>{segment.text}</React.Fragment>
      )
    )}
  </>
);

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchedTerm, setSearchedTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [history, setHistory] = useState<string[]>(() => getSearchHistory());
  const [testamentFilter, setTestamentFilter] = useState<TestamentFilter>('tous');
  const [bookFilter, setBookFilter] = useState<string>('tous');
  const navigate = useNavigate();
  const defaultTranslation = useSettingsStore((state) => state.settings.defaultTranslation);
  const [translation, setTranslation] = useState(defaultTranslation);

  const translationName = useMemo(() => {
    return FEATURED_TRANSLATIONS.find((t) => t.id === translation)?.short || translation.toUpperCase();
  }, [translation]);

  const searchIsFallback = !SEARCH_DIRECT_TRANSLATIONS.includes(translation);

  const runSearch = async (rawQuery: string) => {
    const cleanQuery = rawQuery.trim();
    if (!cleanQuery) return;

    setQuery(cleanQuery);
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setTestamentFilter('tous');
    setBookFilter('tous');

    try {
      const data = await searchVerses(translation, cleanQuery);
      setResults(data);
      setSearchedTerm(cleanQuery);
      setHistory(addSearchHistoryEntry(cleanQuery));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'La recherche n’a pas abouti. Veuillez réessayer.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const booksInResults = useMemo(() => {
    const ids = Array.from(new Set(results.map((r) => r.book_id)));
    return ids
      .map((id) => ({ id, name: getBookName(id) }))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }, [results]);

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      if (bookFilter !== 'tous' && result.book_id !== bookFilter) return false;
      if (testamentFilter !== 'tous') {
        const book = BIBLE_BOOKS.find((b) => b.id === result.book_id);
        if (!book || book.testament !== testamentFilter) return false;
      }
      return true;
    });
  }, [results, bookFilter, testamentFilter]);

  const navigateToVerse = (bookId: string, chapterId: string) => {
    const parsedChapter = Number.parseInt(chapterId.includes('.') ? chapterId.split('.')[1] : chapterId, 10);
    const targetBook = BIBLE_BOOKS.find((book) => book.id === bookId.toLowerCase())
      ?? BIBLE_BOOKS.find((book) => book.id.toLowerCase().startsWith(bookId.toLowerCase()));
    const chapterNum = Number.isFinite(parsedChapter) ? parsedChapter : 1;
    navigate(`/read/${translation}/${targetBook?.id ?? 'jean'}/${chapterNum}`);
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setHistory([]);
  };

  return (
    <div className="mx-auto max-w-4xl py-4 md:py-8">
      <section className="reading-surface mb-7 p-6 md:p-8">
        <p className="omed-kicker mb-3">Recherche biblique</p>
        <h1 className="font-display text-4xl tracking-tight text-text-primary md:text-5xl">Chercher dans le texte.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary md:text-base">Un champ calme pour retrouver un mot, une expression ou un passage, puis ouvrir le chapitre dans son contexte.</p>

        <form onSubmit={handleSearch} className="mt-7">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1" htmlFor="bible-search-input">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                id="bible-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Exemple : amour, pardon, Jean 3"
                aria-label="Recherche biblique"
                className="min-h-14 w-full rounded-2xl border border-border bg-bg-card/72 py-3.5 pl-12 pr-4 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-gold/50"
              />
            </label>
            <select
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              aria-label="Traduction de recherche"
              className="min-h-14 rounded-2xl border border-border bg-bg-card/72 px-3 text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold/50 sm:max-w-36"
            >
              {FEATURED_TRANSLATIONS.map((t) => (
                <option key={t.id} value={t.id}>{t.short}</option>
              ))}
            </select>
            <button type="submit" disabled={loading || !query.trim()} className="omed-button-primary min-h-14 px-6 disabled:cursor-not-allowed disabled:opacity-55">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Recherche…' : 'Rechercher'}
            </button>
          </div>
        </form>

        {!hasSearched && (
          <div className="mt-6 space-y-4">
            {history.length > 0 && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                    <History size={13} /> Recherches récentes
                  </p>
                  <button type="button" onClick={handleClearHistory} className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted transition-colors hover:text-[color:var(--color-danger)]">
                    <X size={12} /> Effacer
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((entry) => (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => runSearch(entry)}
                      className="min-h-9 rounded-full border border-border bg-bg-card/55 px-3.5 text-sm text-text-secondary transition-colors hover:border-accent-gold/40 hover:text-text-primary"
                    >
                      {entry}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                <Sparkles size={13} /> Pistes de méditation
              </p>
              <div className="flex flex-wrap gap-2">
                {THEME_SUGGESTIONS.map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => runSearch(theme)}
                    className="min-h-9 rounded-full border border-accent-gold/25 bg-accent-gold/8 px-3.5 text-sm font-medium text-accent-gold transition-colors hover:border-accent-gold/50"
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {searchIsFallback && (
        <div className="mb-6 rounded-2xl border border-accent-brown/25 bg-accent-brown/10 p-4 text-sm leading-relaxed text-text-secondary">
          La recherche textuelle n’est pas entièrement prise en charge pour <strong className="text-text-primary">{translationName}</strong>. Une version compatible peut être utilisée pour éviter les interruptions.
        </div>
      )}

      {error && <ErrorState compact title="Recherche interrompue" message={error} />}

      <section className="space-y-4">
        {loading && (
          <div className="omed-panel-soft p-5 text-text-secondary"><Loader2 className="mr-2 inline animate-spin" size={16} />Recherche en cours, merci de patienter.</div>
        )}

        {!loading && results.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <h2 className="omed-kicker">
              {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''}
              {filteredResults.length !== results.length ? ` (sur ${results.length})` : ''}
            </h2>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <div className="grid grid-cols-3 gap-1 rounded-full border border-border bg-bg-card/55 p-1 sm:flex" role="group" aria-label="Filtrer par testament">
                {(['tous', 'AT', 'NT'] as TestamentFilter[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTestamentFilter(value)}
                    aria-pressed={testamentFilter === value}
                    className={clsx(
                      'min-h-8 rounded-full px-3 text-xs font-semibold transition-colors',
                      testamentFilter === value ? 'bg-accent-gold/15 text-accent-gold' : 'text-text-muted hover:text-text-primary'
                    )}
                  >
                    {value === 'tous' ? 'Tous' : value}
                  </button>
                ))}
              </div>
              {booksInResults.length > 1 && (
                <select
                  value={bookFilter}
                  onChange={(e) => setBookFilter(e.target.value)}
                  aria-label="Filtrer par livre"
                  className="min-h-10 w-full rounded-full border border-border bg-bg-card/55 px-3 text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold/50 sm:w-auto"
                >
                  <option value="tous">Tous les livres</option>
                  {booksInResults.map((book) => (
                    <option key={book.id} value={book.id}>{book.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {!loading && !error && hasSearched && results.length === 0 && (
          <EmptyState compact title="Aucun passage trouvé" message="Affinez votre recherche avec un mot plus précis ou une autre formulation." />
        )}

        {!loading && !error && results.length > 0 && filteredResults.length === 0 && (
          <EmptyState compact title="Aucun résultat avec ces filtres" message="Élargissez le testament ou le livre pour retrouver les passages." />
        )}

        {filteredResults.map((result, idx) => (
          <article key={`${result.book_id}-${result.chapter_id}-${idx}`} className="group omed-card p-5 hover:border-accent-gold/35 md:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-2xl font-semibold text-text-primary">{result.reference}</h3>
              <span className="rounded-full border border-accent-gold/25 bg-accent-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-accent-gold">
                {translationName}
              </span>
            </div>
            <p className="font-body text-base leading-8 text-text-secondary">
              <HighlightedText text={result.text} term={searchedTerm} />
            </p>
            <button type="button" onClick={() => navigateToVerse(result.book_id, result.chapter_id)} className="mt-5 inline-flex min-h-10 items-center gap-1 rounded-xl px-1 text-sm font-semibold text-accent-brown hover:text-accent-gold">
              Ouvrir le chapitre <ChevronRight size={16} />
            </button>
          </article>
        ))}
      </section>
    </div>
  );
};

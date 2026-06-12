import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ChevronRight, Loader2, History, Sparkles, X } from 'lucide-react';
import { searchVerses, FEATURED_TRANSLATIONS, BIBLE_BOOKS } from '../../utils/bibleApi';
import type { SearchResult } from '../../utils/bibleApi';
import { useSettingsStore } from '../../store/useSettingsStore';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { FilterBar, FilterChip } from '../../components/layout/FilterBar';
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

  const translationName = useMemo(
    () => FEATURED_TRANSLATIONS.find((t) => t.id === translation)?.short || translation.toUpperCase(),
    [translation]
  );
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
    return ids.map((id) => ({ id, name: getBookName(id) })).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }, [results]);

  const filteredResults = useMemo(() => results.filter((result) => {
    if (bookFilter !== 'tous' && result.book_id !== bookFilter) return false;
    if (testamentFilter !== 'tous') {
      const book = BIBLE_BOOKS.find((b) => b.id === result.book_id);
      if (!book || book.testament !== testamentFilter) return false;
    }
    return true;
  }), [results, bookFilter, testamentFilter]);

  // Regroupement des résultats par livre pour une lecture en atlas.
  const groupedResults = useMemo(() => {
    const groups = new Map<string, SearchResult[]>();
    filteredResults.forEach((result) => {
      const list = groups.get(result.book_id) ?? [];
      list.push(result);
      groups.set(result.book_id, list);
    });
    return Array.from(groups.entries()).map(([id, items]) => ({ id, name: getBookName(id), items }));
  }, [filteredResults]);

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
    <PageCanvas width="wide">
      {/* En-tête : champ de recherche dominant */}
      <section className="reading-surface relative overflow-hidden p-6 md:p-8">
        <div className="omed-starfield pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <p className="omed-kicker mb-3">Exploration biblique</p>
          <h1 className="font-display text-4xl tracking-tight text-text-primary md:text-5xl">Chercher dans le texte.</h1>
          <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
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
            <select value={translation} onChange={(e) => setTranslation(e.target.value)} aria-label="Traduction de recherche" className="min-h-14 rounded-2xl border border-border bg-bg-card/72 px-3 text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold/50 sm:max-w-36">
              {FEATURED_TRANSLATIONS.map((t) => <option key={t.id} value={t.id}>{t.short}</option>)}
            </select>
            <button type="submit" disabled={loading || !query.trim()} className="omed-button-primary min-h-14 px-6 disabled:cursor-not-allowed disabled:opacity-55">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Recherche…' : 'Rechercher'}
            </button>
          </form>
          {searchIsFallback && (
            <p className="mt-4 rounded-2xl border border-accent-brown/25 bg-accent-brown/10 p-3 text-sm leading-relaxed text-text-secondary">
              La recherche textuelle n'est pas entièrement prise en charge pour <strong className="text-text-primary">{translationName}</strong> ; une version compatible peut être utilisée.
            </p>
          )}
        </div>
      </section>

      {/* Atlas : rail de filtres + résultats */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[17rem_1fr] lg:items-start">
        <aside className="space-y-5 lg:sticky lg:top-6">
          {results.length > 0 && (
            <div className="omed-panel-soft p-4">
              <p className="omed-kicker mb-3">Filtrer</p>
              <FilterBar label="Testament" className="mb-3">
                {(['tous', 'AT', 'NT'] as TestamentFilter[]).map((value) => (
                  <FilterChip key={value} active={testamentFilter === value} onClick={() => setTestamentFilter(value)}>
                    {value === 'tous' ? 'Tous' : value}
                  </FilterChip>
                ))}
              </FilterBar>
              {booksInResults.length > 1 && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Livre</span>
                  <select value={bookFilter} onChange={(e) => setBookFilter(e.target.value)} aria-label="Filtrer par livre" className="min-h-10 w-full rounded-xl border border-border bg-bg-card/70 px-3 text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold/50">
                    <option value="tous">Tous les livres</option>
                    {booksInResults.map((book) => <option key={book.id} value={book.id}>{book.name}</option>)}
                  </select>
                </label>
              )}
            </div>
          )}

          {history.length > 0 && (
            <div className="omed-panel-soft p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-1.5 omed-kicker"><History size={12} /> Récent</p>
                <button type="button" onClick={handleClearHistory} className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted transition-colors hover:text-[color:var(--color-danger)]"><X size={12} /> Effacer</button>
              </div>
              <FilterBar label="">
                {history.map((entry) => <FilterChip key={entry} onClick={() => runSearch(entry)}>{entry}</FilterChip>)}
              </FilterBar>
            </div>
          )}

          <div className="omed-panel-soft p-4">
            <p className="mb-3 flex items-center gap-1.5 omed-kicker"><Sparkles size={12} /> Méditation</p>
            <FilterBar label="">
              {THEME_SUGGESTIONS.map((theme) => (
                <FilterChip key={theme} onClick={() => runSearch(theme)}>{theme}</FilterChip>
              ))}
            </FilterBar>
          </div>
        </aside>

        <section className="min-w-0 space-y-4">
          {error && <ErrorState compact title="Recherche interrompue" message={error} />}
          {loading && <div className="omed-panel-soft p-5 text-text-secondary"><Loader2 className="mr-2 inline animate-spin" size={16} />Recherche en cours…</div>}

          {!loading && results.length > 0 && (
            <p className="omed-kicker">{filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''}{filteredResults.length !== results.length ? ` (sur ${results.length})` : ''}</p>
          )}

          {!loading && !error && hasSearched && results.length === 0 && (
            <EmptyState compact title="Aucun passage trouvé" message="Affinez votre recherche avec un mot plus précis ou une autre formulation." />
          )}
          {!loading && !error && results.length > 0 && filteredResults.length === 0 && (
            <EmptyState compact title="Aucun résultat avec ces filtres" message="Élargissez le testament ou le livre pour retrouver les passages." />
          )}
          {!loading && !hasSearched && (
            <div className="empty-state px-6 py-12 text-center text-sm leading-6 text-text-secondary">
              Lancez une recherche ou choisissez un thème de méditation pour explorer le texte.
            </div>
          )}

          {groupedResults.map((group) => (
            <div key={group.id} className="omed-panel-soft overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/70 px-5 py-3">
                <h2 className="font-display text-lg font-semibold text-text-primary">{group.name}</h2>
                <span className="rounded-full border border-accent-gold/25 bg-accent-gold/10 px-2.5 py-0.5 text-xs font-semibold text-accent-gold">{group.items.length}</span>
              </div>
              <ul className="divide-y divide-border/60">
                {group.items.map((result, idx) => (
                  <li key={`${result.book_id}-${result.chapter_id}-${idx}`} className="p-5">
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <h3 className="font-display text-base font-semibold text-text-primary">{result.reference}</h3>
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">{translationName}</span>
                    </div>
                    <p className="font-body text-sm leading-7 text-text-secondary"><HighlightedText text={result.text} term={searchedTerm} /></p>
                    <button onClick={() => navigateToVerse(result.book_id, result.chapter_id)} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-brown transition-colors hover:text-accent-gold">
                      Ouvrir le chapitre <ChevronRight size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </PageCanvas>
  );
};

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ChevronRight, Loader2 } from 'lucide-react';
import { searchVerses, FEATURED_TRANSLATIONS, BIBLE_BOOKS } from '../../utils/bibleApi';
import type { SearchResult } from '../../utils/bibleApi';
import { useSettingsStore } from '../../store/useSettingsStore';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';

const SEARCH_DIRECT_TRANSLATIONS = ['lsg', 'darby', 'kjv', 'web', 'bbe'];

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const settings = useSettingsStore((state) => state.settings);
  const translation = settings.defaultTranslation;

  const translationName = useMemo(() => {
    return FEATURED_TRANSLATIONS.find((t) => t.id === translation)?.short || translation.toUpperCase();
  }, [translation]);

  const searchIsFallback = !SEARCH_DIRECT_TRANSLATIONS.includes(translation);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchVerses(translation, cleanQuery);
      setResults(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'La recherche n’a pas abouti. Veuillez réessayer.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const navigateToVerse = (bookId: string, chapterId: string) => {
    const chapterNum = chapterId.includes('.') ? chapterId.split('.')[1] : chapterId;
    const apiBookToLocal = BIBLE_BOOKS.find((b) => b.id.toLowerCase().startsWith(bookId.toLowerCase()))?.id || bookId.toLowerCase();
    navigate(`/read/${translation}/${apiBookToLocal}/${chapterNum}`);
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
            <button type="submit" disabled={loading || !query.trim()} className="omed-button-primary min-h-14 px-6 disabled:cursor-not-allowed disabled:opacity-55">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Recherche…' : 'Rechercher'}
            </button>
          </div>
        </form>
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
          <h2 className="omed-kicker">{results.length} résultat{results.length > 1 ? 's' : ''}</h2>
        )}

        {!loading && !error && hasSearched && results.length === 0 && (
          <EmptyState compact title="Aucun passage trouvé" message="Affinez votre recherche avec un mot plus précis ou une autre formulation." />
        )}

        {results.map((result, idx) => (
          <article key={idx} className="group rounded-2xl border border-border bg-bg-card/62 p-5 shadow-[var(--shadow-soft)] hover:border-accent-gold/35 md:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-2xl font-semibold text-text-primary">{result.reference}</h3>
              <span className="rounded-full border border-accent-gold/25 bg-accent-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-accent-gold">
                {translationName}
              </span>
            </div>
            <p className="font-body text-base leading-8 text-text-secondary">{result.text}</p>
            <button onClick={() => navigateToVerse(result.book_id, result.chapter_id)} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent-brown hover:text-accent-gold">
              Ouvrir le chapitre <ChevronRight size={16} />
            </button>
          </article>
        ))}
      </section>
    </div>
  );
};

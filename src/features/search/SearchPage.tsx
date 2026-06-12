import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Loader2, Search as SearchIcon, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { BIBLE_BOOKS, FEATURED_TRANSLATIONS, searchVerses } from '../../utils/bibleApi';
import type { SearchResult } from '../../utils/bibleApi';
import { useSettingsStore } from '../../store/useSettingsStore';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { addSearchHistoryEntry, clearSearchHistory, getSearchHistory } from '../../utils/searchHistory';
import { splitByTerm } from '../../utils/highlightTerm';
import { getBookName } from '../../utils/bibleBooks';
import { TOPICS } from '../../data/topics';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { getPlansForTopic, getPopularTopics, getRecommendedTopics, getSuggestedPassages, groupSearchResultsByBook } from '../../utils/discover';
import { READING_PLANS } from '../../data/readingPlans';

type TestamentFilter = 'tous' | 'AT' | 'NT';

const HighlightedText: React.FC<{ text: string; term: string }> = ({ text, term }) => <>{splitByTerm(text, term).map((segment, index) => segment.match ? <mark key={index} className="rounded bg-accent-gold/25 px-0.5 text-text-primary">{segment.text}</mark> : <React.Fragment key={index}>{segment.text}</React.Fragment>)}</>;

export const SearchPage: React.FC = () => {
  const defaultTranslation = useSettingsStore((state) => state.settings.defaultTranslation);
  const preferredTopics = useOnboardingStore((state) => state.preferences.topics);
  const [query, setQuery] = useState('');
  const [searchedTerm, setSearchedTerm] = useState('');
  const [translation, setTranslation] = useState(defaultTranslation);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<string[]>(() => getSearchHistory());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [testamentFilter, setTestamentFilter] = useState<TestamentFilter>('tous');
  const [bookFilter, setBookFilter] = useState('tous');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const navigate = useNavigate();

  const translationName = FEATURED_TRANSLATIONS.find((item) => item.id === translation)?.short ?? translation.toUpperCase();
  const selectedTopic = useMemo(() => TOPICS.find((topic) => topic.id === selectedTopicId) ?? null, [selectedTopicId]);

  const runSearch = async (raw: string) => {
    const clean = raw.trim();
    if (!clean) return;
    setQuery(clean);
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setTestamentFilter('tous');
    setBookFilter('tous');
    setSelectedTopicId(null);
    try {
      const data = await searchVerses(translation, clean);
      setResults(data);
      setSearchedTerm(clean);
      setHistory(addSearchHistoryEntry(clean));
    } catch (err) {
      setResults([]);
      setError(err instanceof Error ? err.message : 'La recherche n’a pas abouti.');
    } finally {
      setLoading(false);
    }
  };

  const booksInResults = useMemo(() => Array.from(new Set(results.map((result) => result.book_id))).map((id) => ({ id, name: getBookName(id) })).sort((a, b) => a.name.localeCompare(b.name, 'fr')), [results]);
  const filteredResults = useMemo(() => results.filter((result) => {
    if (bookFilter !== 'tous' && result.book_id !== bookFilter) return false;
    if (testamentFilter !== 'tous') {
      const book = BIBLE_BOOKS.find((item) => item.id === result.book_id);
      if (!book || book.testament !== testamentFilter) return false;
    }
    return true;
  }), [results, bookFilter, testamentFilter]);

  const groupedResults = useMemo(() => groupSearchResultsByBook(filteredResults), [filteredResults]);
  const recommendedTopics = useMemo(() => getRecommendedTopics(preferredTopics), [preferredTopics]);
  const popularTopics = useMemo(() => getPopularTopics(6), []);
  const suggestedPassages = useMemo(() => getSuggestedPassages(recommendedTopics, 4), [recommendedTopics]);


  const selectTopic = (topicId: string) => {
    const topic = TOPICS.find((item) => item.id === topicId);
    if (!topic) return;
    setSelectedTopicId(topic.id);
    setQuery(topic.query);
    setResults([]);
    setSearchedTerm('');
    setError(null);
    setHasSearched(false);
    setTestamentFilter('tous');
    setBookFilter('tous');
  };

  const linkedPlansForTopic = selectedTopic ? getPlansForTopic(selectedTopic) : [];

  const openResult = (result: SearchResult) => {
    const chapter = Number.parseInt(result.chapter_id.includes('.') ? result.chapter_id.split('.')[1] : result.chapter_id, 10) || 1;
    const book = BIBLE_BOOKS.find((item) => item.id === result.book_id.toLowerCase()) ?? BIBLE_BOOKS.find((item) => item.id.toLowerCase().startsWith(result.book_id.toLowerCase()));
    navigate(`/read/${translation}/${book?.id ?? 'jean'}/${chapter}`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="rounded-[2rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent-gold"><Sparkles size={15} /> Découvrir</p>
        <h1 className="mt-2 text-3xl font-bold text-text-primary">Rechercher un passage ou un thème</h1>
        <form onSubmit={(event) => { event.preventDefault(); runSearch(query); }} className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_9rem_auto]">
          <label className="relative" htmlFor="discover-search"><SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} /><input id="discover-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher amour, paix, Jean 3…" className="min-h-14 w-full rounded-2xl border border-border bg-bg-primary pl-12 pr-4 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/35" /></label>
          <label className="sr-only" htmlFor="discover-translation">Traduction</label>
          <select id="discover-translation" value={translation} onChange={(event) => setTranslation(event.target.value)} className="min-h-14 rounded-2xl border border-border bg-bg-primary px-4 font-semibold text-text-primary">{FEATURED_TRANSLATIONS.map((item) => <option key={item.id} value={item.id}>{item.short}</option>)}</select>
          <button type="submit" disabled={loading} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-accent-gold px-5 font-semibold text-white disabled:opacity-60">{loading ? <Loader2 className="animate-spin" size={18} /> : <SearchIcon size={18} />} Rechercher</button>
        </form>
      </header>

      <section className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
          {results.length > 0 && <div className="rounded-3xl border border-border bg-bg-card p-4"><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-text-muted"><SlidersHorizontal size={14} /> Filtres</p><div className="flex flex-wrap gap-2">{(['tous', 'AT', 'NT'] as TestamentFilter[]).map((value) => <button key={value} type="button" onClick={() => setTestamentFilter(value)} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${testamentFilter === value ? 'bg-accent-gold text-white' : 'bg-bg-secondary text-text-secondary'}`}>{value === 'tous' ? 'Tous' : value}</button>)}</div>{booksInResults.length > 1 && <select value={bookFilter} onChange={(event) => setBookFilter(event.target.value)} className="mt-3 min-h-11 w-full rounded-2xl border border-border bg-bg-primary px-3 text-sm text-text-primary"><option value="tous">Tous les livres</option>{booksInResults.map((book) => <option key={book.id} value={book.id}>{book.name}</option>)}</select>}</div>}
          <div className="rounded-3xl border border-border bg-bg-card p-4"><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-text-muted"><Sparkles size={14} /> Thèmes</p><div className="flex flex-wrap gap-2">{TOPICS.map((topic) => <button key={topic.id} type="button" onClick={() => selectTopic(topic.id)} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${selectedTopicId === topic.id ? 'bg-accent-gold text-white' : 'bg-bg-secondary text-text-secondary hover:text-text-primary'}`}>{topic.label}</button>)}</div></div>
          {history.length > 0 && <div className="rounded-3xl border border-border bg-bg-card p-4"><div className="mb-3 flex items-center justify-between"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-text-muted"><History size={14} /> Historique</p><button type="button" onClick={() => { clearSearchHistory(); setHistory([]); }} className="text-text-muted" aria-label="Effacer l’historique"><X size={15} /></button></div><div className="flex flex-wrap gap-2">{history.map((entry) => <button key={entry} type="button" onClick={() => runSearch(entry)} className="rounded-full bg-bg-secondary px-3 py-1.5 text-sm font-semibold text-text-secondary">{entry}</button>)}</div></div>}
        </aside>

        <section className="min-w-0 space-y-3">
          {error && <ErrorState compact title="Recherche interrompue" message={error} />}
          {loading && <div className="rounded-3xl border border-border bg-bg-card p-5 text-text-secondary"><Loader2 className="mr-2 inline animate-spin" size={16} /> Recherche en cours…</div>}
          {!loading && !error && hasSearched && results.length === 0 && <EmptyState compact title="Aucun passage trouvé" message="Essayez un mot plus court, une autre traduction ou un thème proposé." />}
          {!loading && selectedTopic && (
            <article className="rounded-3xl border border-accent-gold/35 bg-accent-gold/8 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-gold">Thème sélectionné</p>
              <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">{selectedTopic.label}</h2>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">{selectedTopic.description}</p>
                </div>
                <button type="button" onClick={() => runSearch(selectedTopic.query)} className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-accent-gold px-4 text-sm font-semibold text-white"><SearchIcon size={16} /> Rechercher ce thème</button>
              </div>
              {selectedTopic.references && selectedTopic.references.length > 0 && <div className="mt-4"><p className="text-sm font-bold text-text-primary">Références suggérées</p><div className="mt-2 flex flex-wrap gap-2">{selectedTopic.references.map((ref) => <button key={ref.label} type="button" onClick={() => navigate(`/read/${translation}/${ref.bookId}/${ref.chapter}`)} className="rounded-full border border-border bg-bg-card px-3 py-1.5 text-sm font-semibold text-text-primary hover:border-accent-gold/45">{ref.label}</button>)}</div></div>}
              {linkedPlansForTopic.length > 0 && <div className="mt-4"><p className="text-sm font-bold text-text-primary">Plans liés</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{linkedPlansForTopic.map((plan) => <button key={plan.id} type="button" onClick={() => navigate(`/plans/${plan.id}`)} className="rounded-2xl border border-border bg-bg-card p-3 text-left hover:border-accent-gold/45"><span className="block font-semibold text-text-primary">{plan.title}</span><span className="text-xs text-text-secondary">{plan.durationDays} jours · {plan.theme ?? plan.category ?? 'Plan'}</span></button>)}</div></div>}
            </article>
          )}
          {!loading && !hasSearched && !selectedTopic && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-text-secondary">Thèmes recommandés pour vous</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {recommendedTopics.map((topic) => (
                  <article key={topic.id} className="flex flex-col rounded-3xl border border-border bg-bg-card p-4">
                    <button type="button" onClick={() => selectTopic(topic.id)} className="text-left">
                      <p className="text-base font-bold text-text-primary">{topic.label}</p>
                      <p className="mt-0.5 text-sm text-text-secondary">{topic.description}</p>
                    </button>
                    {topic.references && topic.references.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {topic.references.map((ref) => (
                          <button key={ref.label} type="button" onClick={() => navigate(`/read/${translation}/${ref.bookId}/${ref.chapter}`)} className="rounded-full bg-bg-secondary px-2.5 py-1 text-xs font-semibold text-text-secondary hover:text-text-primary">{ref.label}</button>
                        ))}
                      </div>
                    )}
                    {topic.planIds && topic.planIds.length > 0 && (() => {
                      const plan = READING_PLANS.find((item) => item.id === topic.planIds?.[0]);
                      return plan ? <button type="button" onClick={() => navigate(`/plans/${plan.id}`)} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-accent-gold">Plan lié : {plan.title}</button> : null;
                    })()}
                  </article>
                ))}
              </div>
              <div className="mt-5 grid gap-3 lg:grid-cols-2">
                <div className="rounded-3xl border border-border bg-bg-card p-4"><p className="text-sm font-bold text-text-primary">Thèmes populaires</p><div className="mt-3 flex flex-wrap gap-2">{popularTopics.map((topic) => <button key={topic.id} type="button" onClick={() => selectTopic(topic.id)} className="rounded-full bg-bg-secondary px-3 py-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary">{topic.label}</button>)}</div></div>
                <div className="rounded-3xl border border-border bg-bg-card p-4"><p className="text-sm font-bold text-text-primary">Passages suggérés</p><div className="mt-3 flex flex-wrap gap-2">{suggestedPassages.map((ref) => <button key={`${ref.topicId}-${ref.label}`} type="button" onClick={() => navigate(`/read/${translation}/${ref.bookId}/${ref.chapter}`)} className="rounded-full bg-bg-secondary px-3 py-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary">{ref.label}</button>)}</div></div>
              </div>
            </div>
          )}
          {!loading && results.length > 0 && <p className="text-sm font-semibold text-text-secondary">{filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''} · {groupedResults.length} livre{groupedResults.length > 1 ? 's' : ''} · {translationName}</p>}
          {groupedResults.map((group) => (
            <section key={group.bookId} className="space-y-2">
              <h3 className="sticky top-0 z-10 bg-bg-primary/90 py-1 text-sm font-bold uppercase tracking-wide text-accent-gold backdrop-blur">{group.name} <span className="text-text-muted">· {group.items.length}</span></h3>
              {group.items.map((result, index) => <article key={`${result.book_id}-${result.chapter_id}-${index}`} className="rounded-3xl border border-border bg-bg-card p-4"><p className="font-bold text-accent-gold">{result.reference}</p><p className="mt-2 leading-7 text-text-primary"><HighlightedText text={result.text} term={searchedTerm} /></p><button type="button" onClick={() => openResult(result)} className="mt-3 min-h-10 rounded-2xl border border-border bg-bg-primary px-3 text-sm font-semibold text-text-primary">Ouvrir le chapitre</button></article>)}
            </section>
          ))}
        </section>
      </section>
    </div>
  );
};

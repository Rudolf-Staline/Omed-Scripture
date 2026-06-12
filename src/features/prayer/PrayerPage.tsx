import React, { useMemo, useState } from 'react';
import { HandHeart, Plus, Search, Check, X, Archive, Trash2, Edit3, Undo2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePrayerStore, PRAYER_CATEGORIES } from '../../store/usePrayerStore';
import type { PrayerCategory, PrayerEntry, PrayerStatus } from '../../store/usePrayerStore';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { PageHero } from '../../components/layout/PageHero';
import { FilterBar, FilterChip } from '../../components/layout/FilterBar';
import { EmptyIllustration } from '../../components/layout/EmptyIllustration';

const CATEGORY_LABELS: Record<PrayerCategory, string> = {
  gratitude: 'Gratitude',
  demande: 'Demande',
  confession: 'Confession',
  intercession: 'Intercession',
  meditation: 'Méditation',
  autre: 'Autre',
};

const STATUS_LABELS: Record<PrayerStatus, string> = {
  active: 'En cours',
  answered: 'Exaucée',
  archived: 'Archivée',
};

const formatDate = (value: number) =>
  new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

interface PrayerFormValues {
  title: string;
  content: string;
  category: PrayerCategory;
  verseRef: string;
}

const EMPTY_FORM: PrayerFormValues = { title: '', content: '', category: 'gratitude', verseRef: '' };

const PrayerForm: React.FC<{
  initial: PrayerFormValues;
  submitLabel: string;
  onSubmit: (values: PrayerFormValues) => void;
  onCancel: () => void;
}> = ({ initial, submitLabel, onSubmit, onCancel }) => {
  const [values, setValues] = useState<PrayerFormValues>(initial);
  const canSubmit = values.title.trim().length > 0 && values.content.trim().length > 0;

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) onSubmit(values);
      }}
    >
      <div>
        <label htmlFor="prayer-title" className="mb-1.5 block text-sm font-medium text-text-secondary">Titre</label>
        <input
          id="prayer-title"
          type="text"
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          placeholder="Ce que cette prière porte…"
          className="min-h-11 w-full rounded-xl border border-border bg-bg-primary px-3.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-gold"
        />
      </div>

      <div>
        <label htmlFor="prayer-content" className="mb-1.5 block text-sm font-medium text-text-secondary">Prière</label>
        <textarea
          id="prayer-content"
          value={values.content}
          onChange={(e) => setValues((v) => ({ ...v, content: e.target.value }))}
          placeholder="Déposez ici ce qui habite votre cœur…"
          className="min-h-[130px] w-full rounded-xl border border-border bg-bg-primary p-3.5 font-body leading-7 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-gold"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="prayer-category" className="mb-1.5 block text-sm font-medium text-text-secondary">Catégorie</label>
          <select
            id="prayer-category"
            value={values.category}
            onChange={(e) => setValues((v) => ({ ...v, category: e.target.value as PrayerCategory }))}
            className="min-h-11 w-full rounded-xl border border-border bg-bg-primary px-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold"
          >
            {PRAYER_CATEGORIES.map((category) => (
              <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="prayer-verse" className="mb-1.5 block text-sm font-medium text-text-secondary">
            Verset lié <span className="font-normal text-text-muted">(optionnel)</span>
          </label>
          <input
            id="prayer-verse"
            type="text"
            value={values.verseRef}
            onChange={(e) => setValues((v) => ({ ...v, verseRef: e.target.value }))}
            placeholder="Philippiens 4:6"
            className="min-h-11 w-full rounded-xl border border-border bg-bg-primary px-3.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-gold"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-4 font-medium text-text-muted transition-colors hover:bg-bg-secondary hover:text-text-primary">
          <X size={16} /> Annuler
        </button>
        <button type="submit" disabled={!canSubmit} className="omed-button-primary min-h-11 px-5 disabled:cursor-not-allowed disabled:opacity-50">
          <Check size={16} /> {submitLabel}
        </button>
      </div>
    </form>
  );
};

export const PrayerPage: React.FC = () => {
  const prayers = usePrayerStore((state) => state.prayers);
  const addPrayer = usePrayerStore((state) => state.addPrayer);
  const updatePrayer = usePrayerStore((state) => state.updatePrayer);
  const setPrayerStatus = usePrayerStore((state) => state.setPrayerStatus);
  const removePrayer = usePrayerStore((state) => state.removePrayer);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PrayerCategory | 'toutes'>('toutes');
  const [statusFilter, setStatusFilter] = useState<PrayerStatus>('active');

  const counts = useMemo(() => ({
    active: prayers.filter((p) => p.status === 'active').length,
    answered: prayers.filter((p) => p.status === 'answered').length,
    archived: prayers.filter((p) => p.status === 'archived').length,
  }), [prayers]);

  const visiblePrayers = useMemo(() => {
    const term = query.trim().toLowerCase();
    return prayers
      .filter((entry) => entry.status === statusFilter)
      .filter((entry) => categoryFilter === 'toutes' || entry.category === categoryFilter)
      .filter((entry) =>
        !term ||
        entry.title.toLowerCase().includes(term) ||
        entry.content.toLowerCase().includes(term) ||
        (entry.verseRef ?? '').toLowerCase().includes(term)
      )
      .sort((a, b) => b.dateModified - a.dateModified);
  }, [prayers, query, categoryFilter, statusFilter]);

  const handleCreate = (values: PrayerFormValues) => {
    addPrayer({
      title: values.title.trim(),
      content: values.content.trim(),
      category: values.category,
      ...(values.verseRef.trim() ? { verseRef: values.verseRef.trim() } : {}),
    });
    setShowForm(false);
    toast.success('Prière déposée.');
  };

  const handleUpdate = (entry: PrayerEntry, values: PrayerFormValues) => {
    updatePrayer(entry.id, {
      title: values.title.trim(),
      content: values.content.trim(),
      category: values.category,
      verseRef: values.verseRef.trim() || undefined,
    });
    setEditingId(null);
    toast.success('Prière mise à jour.');
  };

  return (
    <PageCanvas width="list" className="space-y-6">
      <PageHero
        kicker="Carnet · prière"
        title="Déposer, garder, rendre grâce."
        icon={HandHeart}
        intro="Un espace sobre pour confier vos prières, suivre celles qui sont exaucées et garder mémoire de la fidélité de Dieu."
        actions={!showForm && (
          <button type="button" onClick={() => { setShowForm(true); setEditingId(null); }} className="omed-button-primary min-h-11 px-5">
            <Plus size={17} /> Nouvelle prière
          </button>
        )}
      />

      {showForm && (
        <section className="omed-panel p-5 md:p-6">
          <h2 className="mb-4 font-display text-2xl text-text-primary">Nouvelle prière</h2>
          <PrayerForm initial={EMPTY_FORM} submitLabel="Déposer" onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </section>
      )}

      <section className="space-y-3">
        <FilterBar label="Statut">
          {(Object.keys(STATUS_LABELS) as PrayerStatus[]).map((status) => (
            <FilterChip key={status} active={statusFilter === status} onClick={() => setStatusFilter(status)}>
              {STATUS_LABELS[status]} · {counts[status]}
            </FilterChip>
          ))}
        </FilterBar>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1" htmlFor="prayer-search">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              id="prayer-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher dans vos prières…"
              className="min-h-11 w-full rounded-xl border border-border bg-bg-card/70 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-gold/60"
            />
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as PrayerCategory | 'toutes')}
            aria-label="Filtrer par catégorie"
            className="min-h-11 rounded-xl border border-border bg-bg-card/70 px-3 text-sm font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold/60"
          >
            <option value="toutes">Toutes les catégories</option>
            {PRAYER_CATEGORIES.map((category) => (
              <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>
            ))}
          </select>
        </div>
      </section>

      {visiblePrayers.length === 0 ? (
        prayers.length === 0 ? (
          <EmptyIllustration
            icon={HandHeart}
            title="Votre carnet est encore silencieux"
            message="Déposez une première prière : gratitude, demande, intercession… Elle restera ici, en privé, sur cet appareil."
            actionLabel="Déposer une prière"
            onAction={() => { setShowForm(true); setEditingId(null); }}
          />
        ) : (
          <div className="empty-state p-10 text-center">
            <h2 className="font-display text-xl text-text-primary">Aucune prière ne correspond à ces filtres.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">Élargissez la recherche ou changez de statut pour retrouver vos prières.</p>
          </div>
        )
      ) : (
        <div className="space-y-4">
          {visiblePrayers.map((entry) => (
            <article key={entry.id} className="omed-card p-5">
              {editingId === entry.id ? (
                <PrayerForm
                  initial={{ title: entry.title, content: entry.content, category: entry.category, verseRef: entry.verseRef ?? '' }}
                  submitLabel="Enregistrer"
                  onSubmit={(values) => handleUpdate(entry, values)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <header className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-text-primary">{entry.title}</h2>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full border border-accent-gold/25 bg-accent-gold/10 px-2.5 py-0.5 font-semibold uppercase tracking-[0.12em] text-accent-gold">
                          {CATEGORY_LABELS[entry.category]}
                        </span>
                        {entry.status === 'answered' && (
                          <span className="rounded-full border border-accent-sage/35 bg-accent-sage/12 px-2.5 py-0.5 font-semibold text-accent-sage">Exaucée</span>
                        )}
                        {entry.verseRef && <span className="text-text-muted">· {entry.verseRef}</span>}
                      </div>
                    </div>
                    <p className="text-xs text-text-muted">{formatDate(entry.dateAdded)}</p>
                  </header>

                  <p className="whitespace-pre-wrap font-body leading-8 text-text-primary/95">{entry.content}</p>

                  <footer className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
                    {entry.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => { setPrayerStatus(entry.id, 'answered'); toast.success('Marquée comme exaucée. Gloire à Dieu !'); }}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-accent-sage/40 px-3 text-sm font-semibold text-accent-sage transition-colors hover:bg-accent-sage/12"
                      >
                        <Check size={15} /> Exaucée
                      </button>
                    )}
                    {entry.status !== 'archived' ? (
                      <button
                        type="button"
                        onClick={() => { setPrayerStatus(entry.id, 'archived'); toast('Prière archivée.'); }}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-sm text-text-secondary transition-colors hover:border-accent-gold/40 hover:text-text-primary"
                      >
                        <Archive size={15} /> Archiver
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setPrayerStatus(entry.id, 'active'); toast('Prière réactivée.'); }}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-sm text-text-secondary transition-colors hover:border-accent-gold/40 hover:text-text-primary"
                      >
                        <Undo2 size={15} /> Réactiver
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => { setEditingId(entry.id); setShowForm(false); }}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-sm text-text-secondary transition-colors hover:border-accent-gold/40 hover:text-accent-gold"
                    >
                      <Edit3 size={15} /> Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Supprimer définitivement cette prière ?')) {
                          removePrayer(entry.id);
                          toast.success('Prière supprimée.');
                        }
                      }}
                      className="ml-auto inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-sm text-text-secondary transition-colors hover:border-[color:var(--color-danger)]/50 hover:text-[color:var(--color-danger)]"
                    >
                      <Trash2 size={15} /> Supprimer
                    </button>
                  </footer>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </PageCanvas>
  );
};

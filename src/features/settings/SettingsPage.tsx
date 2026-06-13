import React, { useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import type {
  FontSize,
  LineHeight,
  FontFamily,
  Language,
  ReadingWidth,
  ReadingDensity,
} from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useBibleStore } from '../../store/useBibleStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useHighlightsStore } from '../../store/useHighlightsStore';
import { useNotesStore } from '../../store/useNotesStore';
import { usePlansStore } from '../../store/usePlansStore';
import { usePrayerStore } from '../../store/usePrayerStore';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { useCollectionsStore } from '../../store/useCollectionsStore';
import { useReminderStore } from '../../store/useReminderStore';
import { useMemoryStore } from '../../store/useMemoryStore';
import { useStudyStore } from '../../store/useStudyStore';
import type { PreferredTopicId } from '../../types/onboarding';
import { FEATURED_TRANSLATIONS } from '../../utils/bibleApi';
import { THEMES } from '../../data/themes';
import { clearOmedLocalData } from '../../constants/storageKeys';
import { backupLocalDataBeforeRestore, createBackup, isValidArray, isValidReadingPosition, isValidRecord, validateBackup } from '../../utils/backups';
import { syncFileToDrive, syncFileFromDrive, DRIVE_FILES, isDriveSessionInvalidError } from '../../utils/driveSync';
import { Settings, Cloud, LogOut, Download, Trash2, RefreshCw, Palette, BookOpen, Database, Sparkles, WifiOff, Bell, Clipboard, Info, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { PageHero } from '../../components/layout/PageHero';
import { ContentDeck } from '../../components/layout/ContentDeck';
import { StudyPanel } from '../../components/layout/StudyPanel';
import { cleanRecentChapterCache, clearOfflineLibrary, formatApproxSize, getOfflineLibrarySummary } from '../../utils/offlineLibrary';
import type { OfflineLibrarySummary } from '../../utils/offlineLibrary';
import { listStaticTranslations, getStaticTranslationIndex } from '../../utils/staticBibleProvider';
import type { BibleTranslationMeta } from '../../types/bibleData';
import { useOnlineStatus } from '../../utils/useOnlineStatus';
import { APP_VERSION, createDiagnosticsText } from '../../utils/diagnostics';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, synced, setSynced, loadSettings } = useSettingsStore();
  const { user, token, logout, expireSession } = useAuthStore();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);
  const [offlineSummary, setOfflineSummary] = useState<OfflineLibrarySummary>(() => getOfflineLibrarySummary());
  const [staticTranslations, setStaticTranslations] = useState<Array<BibleTranslationMeta & { bookCount: number; chapterCount: number }>>([]);
  const restoreInputRef = useRef<HTMLInputElement | null>(null);
  const isOnline = useOnlineStatus();

  const { loadFavorites, favorites } = useFavoritesStore();
  const { loadHighlights, highlights } = useHighlightsStore();
  const { loadNotes, notes } = useNotesStore();
  const { loadPlans, progress } = usePlansStore();
  const { loadPrayers, prayers } = usePrayerStore();
  const { translation, bookId, chapter } = useBibleStore();
  const { preferences, updatePreferences, resetOnboarding, loadOnboarding } = useOnboardingStore();
  const { collections, loadCollections } = useCollectionsStore();
  const reminderPreferences = useReminderStore((state) => state.preferences);
  const reminderPermission = useReminderStore((state) => state.permission);
  const updateReminders = useReminderStore((state) => state.updateReminders);
  const requestReminderPermission = useReminderStore((state) => state.requestPermission);
  const loadReminders = useReminderStore((state) => state.loadReminders);
  const setPosition = useBibleStore((state) => state.setPosition);
  const memoryVerses = useMemoryStore((state) => state.memoryVerses);
  const loadMemoryVerses = useMemoryStore((state) => state.loadMemoryVerses);
  const studySessions = useStudyStore((state) => state.sessions);
  const loadStudySessions = useStudyStore((state) => state.loadStudySessions);

  const fontSizes: FontSize[] = ['S', 'M', 'L', 'XL'];
  const lineHeights: LineHeight[] = ['Normal', 'Relaxed', 'Large'];
  const fontFamilies: FontFamily[] = ['Lora', 'Inter'];
  const languages: Language[] = ['Français', 'English'];
  const readingWidths: ReadingWidth[] = ['Narrow', 'Comfortable', 'Wide'];
  const readingDensities: ReadingDensity[] = ['Compact', 'Aired'];
  useEffect(() => {
    const refresh = () => setOfflineSummary(getOfflineLibrarySummary());
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  useEffect(() => {
    let mounted = true;
    void listStaticTranslations().then(async (translations) => {
      const withCounts = await Promise.all(translations.map(async (translationMeta) => {
        const index = await getStaticTranslationIndex(translationMeta.id);
        return {
          ...translationMeta,
          bookCount: index?.books.length ?? 0,
          chapterCount: index?.books.reduce((sum, book) => sum + (book.availableChapters?.length ?? book.chapterCount), 0) ?? 0,
        };
      }));
      if (mounted) setStaticTranslations(withCounts);
    });
    return () => { mounted = false; };
  }, []);

  const refreshOfflineSummary = () => setOfflineSummary(getOfflineLibrarySummary());

  const preferenceTopics: PreferredTopicId[] = ['foi', 'paix', 'sagesse', 'courage', 'priere', 'famille', 'pardon', 'esperance'];

  const handleSyncData = async () => {
    if (!token) {
      toast.error("Vous devez être connecté pour synchroniser vos données.");
      return;
    }
    setSyncing(true);
    try {
      const [remoteSettings, remoteFavorites, remoteHighlights, remoteNotes, remotePlans, remotePosition, remotePrayers, remoteOnboarding, remoteCollections, remoteMemory, remoteReminders, remoteStudySessions] = await Promise.all([
        syncFileFromDrive(DRIVE_FILES.settings, token),
        syncFileFromDrive(DRIVE_FILES.favorites, token),
        syncFileFromDrive(DRIVE_FILES.highlights, token),
        syncFileFromDrive(DRIVE_FILES.notes, token),
        syncFileFromDrive(DRIVE_FILES.plans, token),
        syncFileFromDrive(DRIVE_FILES.position, token),
        syncFileFromDrive(DRIVE_FILES.prayers, token),
        syncFileFromDrive(DRIVE_FILES.onboarding, token),
        syncFileFromDrive(DRIVE_FILES.collections, token),
        syncFileFromDrive(DRIVE_FILES.memory, token),
        syncFileFromDrive(DRIVE_FILES.reminders, token),
        syncFileFromDrive(DRIVE_FILES.studySessions, token),
      ]);

      const hasRemoteData = Boolean(remoteSettings || remoteFavorites || remoteHighlights || remoteNotes || remotePlans || remotePosition || remotePrayers || remoteOnboarding || remoteCollections || remoteMemory || remoteReminders || remoteStudySessions);
      if (hasRemoteData) backupLocalDataBeforeRestore();

      if (isValidRecord(remoteSettings)) loadSettings(remoteSettings as unknown as Parameters<typeof loadSettings>[0]);
      if (isValidArray(remoteFavorites)) loadFavorites(remoteFavorites as Parameters<typeof loadFavorites>[0]);
      if (isValidRecord(remoteHighlights)) loadHighlights(remoteHighlights as Parameters<typeof loadHighlights>[0]);
      if (isValidArray(remoteNotes)) loadNotes(remoteNotes as Parameters<typeof loadNotes>[0]);
      if (isValidRecord(remotePlans)) loadPlans(remotePlans as Parameters<typeof loadPlans>[0]);
      if (isValidReadingPosition(remotePosition)) setPosition(remotePosition.translation, remotePosition.bookId, remotePosition.chapter);
      if (isValidArray(remotePrayers)) loadPrayers(remotePrayers as Parameters<typeof loadPrayers>[0]);
      if (isValidRecord(remoteOnboarding)) loadOnboarding(remoteOnboarding);
      if (isValidArray(remoteCollections)) loadCollections(remoteCollections);
      if (isValidArray(remoteMemory)) loadMemoryVerses(remoteMemory);
      if (isValidRecord(remoteReminders)) loadReminders(remoteReminders);
      if (isValidArray(remoteStudySessions)) loadStudySessions(remoteStudySessions);

      setSynced(true);
      toast.success('Synchronisation réussie !');
    } catch (err) {
      console.error('Drive sync failed', err);
      if (isDriveSessionInvalidError(err)) {
        expireSession();
        toast.error('Session Google expirée. Veuillez vous reconnecter.');
      } else {
        toast.error('Échec de la synchronisation.');
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleForceUpload = async () => {
    if (!token) return;
    setSyncing(true);
    try {
      await Promise.all([
        syncFileToDrive(DRIVE_FILES.settings, settings, token),
        syncFileToDrive(DRIVE_FILES.favorites, favorites, token),
        syncFileToDrive(DRIVE_FILES.highlights, highlights, token),
        syncFileToDrive(DRIVE_FILES.notes, notes, token),
        syncFileToDrive(DRIVE_FILES.plans, progress, token),
        syncFileToDrive(DRIVE_FILES.position, { translation, bookId, chapter }, token),
        syncFileToDrive(DRIVE_FILES.prayers, prayers, token),
        syncFileToDrive(DRIVE_FILES.onboarding, preferences, token),
        syncFileToDrive(DRIVE_FILES.collections, collections, token),
        syncFileToDrive(DRIVE_FILES.memory, memoryVerses, token),
        syncFileToDrive(DRIVE_FILES.reminders, reminderPreferences, token),
        syncFileToDrive(DRIVE_FILES.studySessions, studySessions, token),
      ]);
      setSynced(true);
      toast.success('Sauvegarde en ligne réussie !');
    } catch (err) {
      console.error('Drive upload failed', err);
      if (isDriveSessionInvalidError(err)) {
        expireSession();
        toast.error('Session Google expirée. Veuillez vous reconnecter.');
      } else {
        toast.error('Échec de la sauvegarde.');
      }
    } finally {
      setSyncing(false);
    }
  };

  const exportData = () => {
    const data = createBackup({
      settings,
      favorites,
      highlights,
      notes,
      progress,
      position: { translation, bookId, chapter },
      prayers,
      onboarding: preferences,
      collections,
      memory: memoryVerses,
      reminders: reminderPreferences,
      studySessions,
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omed_scripture_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  const restoreData = async (file: File | null) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      if (!validateBackup(parsed)) {
        toast.error('Sauvegarde invalide : le fichier ne correspond pas au format Omed Scripture attendu.');
        return;
      }

      const backupKey = backupLocalDataBeforeRestore();
      loadSettings(parsed.settings);
      loadFavorites(parsed.favorites);
      loadHighlights(parsed.highlights);
      loadNotes(parsed.notes);
      loadPlans(parsed.progress);
      setPosition(parsed.position.translation, parsed.position.bookId, parsed.position.chapter);
      loadPrayers(parsed.prayers ?? []);
      if (parsed.onboarding) loadOnboarding(parsed.onboarding);
      loadCollections(parsed.collections ?? []);
      loadMemoryVerses(parsed.memory ?? []);
      if (parsed.reminders) loadReminders(parsed.reminders);
      loadStudySessions(parsed.studySessions ?? []);
      toast.success(`Données restaurées. Sauvegarde locale de sécurité : ${backupKey}`);
    } catch (error) {
      console.error('Backup restore failed', error);
      toast.error('Restauration impossible : vérifiez que le fichier JSON est lisible.');
    } finally {
      if (restoreInputRef.current) restoreInputRef.current.value = '';
    }
  };

  const clearData = () => {
    const confirmed = window.confirm(
      'Confirmez-vous la suppression des données locales Omed Scripture uniquement (favoris, notes, surlignages, mémorisation, préférences, parcours, position et session Google) ? Les autres données de ce domaine seront conservées.'
    );

    if (confirmed) {
      clearOmedLocalData();
      window.location.reload();
    }
  };


  const diagnosticsText = createDiagnosticsText({ theme: settings.theme, syncEnabled: synced });
  const feedbackSubject = encodeURIComponent('Retour bêta Omed Scripture');
  const feedbackBody = encodeURIComponent(`Bonjour,\n\nRetour bêta :\n\n--- Diagnostic optionnel (sans notes, prières, favoris ni compte) ---\n${diagnosticsText}`);

  const handleCopyDiagnostics = async () => {
    try {
      await navigator.clipboard.writeText(diagnosticsText);
      toast.success('Diagnostic copié sans données personnelles.');
    } catch {
      toast.error('Copie impossible dans ce navigateur.');
    }
  };

  const SegmentedControl = <T extends string>({ values, selected, onSelect }: { values: readonly T[]; selected: T; onSelect: (value: T) => void }) => (
    <div className="grid gap-1 rounded-2xl border border-border bg-bg-primary p-1 sm:flex sm:gap-2">
      {values.map((value) => (
        <button
          type="button"
          key={value}
          onClick={() => onSelect(value)}
          aria-pressed={selected === value}
          className={`min-h-10 flex-1 rounded-xl px-2 py-2 text-sm font-semibold transition-colors ${
            selected === value
              ? 'border border-accent-gold/30 bg-bg-card text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {value}
        </button>
      ))}
    </div>
  );

  return (
    <PageCanvas width="wide">
      <ContentDeck
        variant="atlas"
        lead={<PageHero kicker="Réglages" title="Paramètres" icon={Settings} intro="Lecture, apparence, synchronisation et données restent organisées simplement." />}
        rail={(
          <StudyPanel title="État du coffre" eyebrow="Données" icon={Database}>
            <div className="space-y-3 text-sm text-text-secondary">
              <p><strong className="text-text-primary">{favorites.length}</strong> favoris</p>
              <p><strong className="text-text-primary">{notes.length}</strong> notes</p>
              <p><strong className="text-text-primary">{prayers.length}</strong> prières</p>
              <p><strong className="text-text-primary">{collections.length}</strong> collections</p>
              <p><strong className="text-text-primary">{memoryVerses.length}</strong> versets mémorisés</p>
              <p className="rounded-2xl border border-border bg-bg-primary/50 p-3">Sync : {synced ? 'active' : 'locale'}</p>
            </div>
          </StudyPanel>
        )}
      >
      <div className="settings-control-map grid gap-6 lg:grid-cols-2">
        <section className="omed-card p-4 sm:p-6 lg:col-span-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-text-primary">
                <Info size={20} className="text-accent-brown" /> Bêta & support
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
                Version {APP_VERSION}. Omed Scripture est en bêta publique : les données restent locales, sauf synchronisation Google Drive si vous l’activez.
                Le diagnostic ci-dessous ne contient pas vos notes, prières, favoris, surlignages, e-mail ni jeton Google.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <Link to="/about" className="font-semibold text-accent-gold hover:underline">À propos</Link>
                <a href="https://github.com/Rudolf-Staline/Omed-Scripture/blob/main/docs/PRIVACY_NOTES.md" target="_blank" rel="noreferrer" className="font-semibold text-accent-gold hover:underline">Confidentialité</a>
                <a href="https://github.com/Rudolf-Staline/Omed-Scripture/blob/main/docs/BIBLE_RIGHTS_AND_LICENSES.md" target="_blank" rel="noreferrer" className="font-semibold text-accent-gold hover:underline">Licences bibliques</a>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button type="button" onClick={handleCopyDiagnostics} className="omed-button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm">
                <Clipboard size={16} aria-hidden="true" /> Copier diagnostic
              </button>
              <a href={`mailto:?subject=${feedbackSubject}&body=${feedbackBody}`} className="omed-button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm">
                <Mail size={16} aria-hidden="true" /> Envoyer un retour
              </a>
            </div>
          </div>
        </section>

        <section className="omed-card p-4 sm:p-6">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-text-primary">
            <Palette size={20} className="text-accent-brown" /> Apparence
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Thème</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Thème visuel">
                {THEMES.map((theme) => {
                  const active = settings.theme === theme.id;
                  return (
                    <button
                      type="button"
                      key={theme.id}
                      role="radio"
                      aria-checked={active}
                      onClick={() => updateSettings({ theme: theme.id })}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                        active
                          ? 'border-accent-gold/55 bg-accent-gold/10'
                          : 'border-border bg-bg-primary hover:border-accent-gold/30'
                      }`}
                    >
                      <span className="flex h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-border" aria-hidden="true">
                        {theme.swatch.map((color, index) => (
                          <span key={index} className="h-full flex-1" style={{ backgroundColor: color }} />
                        ))}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-text-primary">{theme.label}</span>
                        <span className="block truncate text-xs text-text-muted">{theme.mood}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Police de lecture</label>
              <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-bg-primary p-1 sm:flex sm:gap-2">
                {fontFamilies.map((ff) => (
                  <button
                    type="button"
                    key={ff}
                    onClick={() => updateSettings({ fontFamily: ff })}
                    aria-pressed={settings.fontFamily === ff}
                    className={`min-h-10 flex-1 rounded-xl px-2 py-2 text-sm font-semibold transition-colors ${
                      settings.fontFamily === ff
                        ? 'border border-accent-gold/30 bg-bg-card text-text-primary shadow-sm'
                        : 'text-text-muted hover:text-text-primary'
                    } ${ff === 'Lora' ? 'font-serif' : 'font-sans'}`}
                  >
                    {ff}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Langue de l'interface</label>
              <SegmentedControl values={languages} selected={settings.language} onSelect={(language) => updateSettings({ language })} />
            </div>
          </div>
        </section>

        <section className="omed-card p-4 sm:p-6">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-text-primary"><Sparkles size={20} className="text-accent-brown" /> Objectifs personnels</h2>
          <div className="space-y-5">
            <label className="block text-sm font-medium text-text-secondary">Objectif quotidien
              <select value={String(preferences.dailyGoalMinutes)} onChange={(e) => updatePreferences({ dailyGoalMinutes: e.target.value === 'free' ? 'free' : Number(e.target.value) as 5 | 10 | 15 })} className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-bg-primary px-4 py-3 text-text-primary">
                <option value="5">5 minutes</option><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="free">Libre</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-text-secondary">Heure préférée de routine
              <input type="time" value={preferences.preferredReminderTime ?? '08:00'} onChange={(e) => updatePreferences({ preferredReminderTime: e.target.value })} className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-bg-primary px-4 py-3 text-text-primary" />
              <span className="mt-2 block text-xs text-text-muted">Préférence locale uniquement : le navigateur peut limiter les notifications de fond.</span>
            </label>
            <div>
              <p className="mb-2 text-sm font-medium text-text-secondary">Centres d’intérêt</p>
              <div className="flex flex-wrap gap-2">{preferenceTopics.map((topic) => <button key={topic} type="button" onClick={() => updatePreferences({ topics: preferences.topics.includes(topic) ? preferences.topics.filter((item) => item !== topic) : [...preferences.topics, topic] })} className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${preferences.topics.includes(topic) ? 'border-accent-gold bg-accent-gold text-white' : 'border-border text-text-secondary'}`}>{topic}</button>)}</div>
            </div>
            <button type="button" onClick={resetOnboarding} className="rounded-2xl border border-border px-4 py-2 font-semibold text-text-secondary hover:text-text-primary">Réinitialiser l’onboarding</button>
          </div>
        </section>

        <section className="omed-card p-4 sm:p-6">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-text-primary">
            <BookOpen size={20} className="text-accent-brown" /> Lecture
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Version par défaut</label>
              <select
                value={settings.defaultTranslation}
                onChange={(e) => updateSettings({ defaultTranslation: e.target.value })}
                className="min-h-12 w-full rounded-2xl border border-border bg-bg-primary px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold"
              >
                {FEATURED_TRANSLATIONS.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.short})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Taille de texte</label>
              <SegmentedControl values={fontSizes} selected={settings.fontSize} onSelect={(fontSize) => updateSettings({ fontSize })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Interligne</label>
              <SegmentedControl values={lineHeights} selected={settings.lineHeight} onSelect={(lineHeight) => updateSettings({ lineHeight })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Largeur de lecture</label>
              <SegmentedControl values={readingWidths} selected={settings.readingWidth} onSelect={(readingWidth) => updateSettings({ readingWidth })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Affichage</label>
              <SegmentedControl values={readingDensities} selected={settings.readingDensity} onSelect={(readingDensity) => updateSettings({ readingDensity })} />
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-bg-primary p-4">
              <div>
                <p className="font-medium text-text-primary">Afficher les numéros de verset</p>
                <p className="text-sm text-text-muted">Masquer les numéros pour une lecture plus fluide.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.showVerseNumbers}
                onChange={(e) => updateSettings({ showVerseNumbers: e.target.checked })}
                className="h-5 w-5 shrink-0 accent-accent-gold"
              />
            </label>
          </div>
        </section>

        <section className="omed-card p-4 sm:p-6">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-text-primary">
            <WifiOff size={20} className="text-accent-brown" /> Hors ligne et installation
          </h2>
          <div className="space-y-4 text-sm text-text-secondary">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-bg-primary p-4"><p className="text-2xl font-bold text-text-primary">{offlineSummary.chapters.length}</p><p>chapitres en cache</p></div>
              <div className="rounded-2xl border border-border bg-bg-primary p-4"><p className="text-2xl font-bold text-text-primary">{offlineSummary.manualCount}</p><p>sauvegardés manuellement</p></div>
              <div className="rounded-2xl border border-border bg-bg-primary p-4"><p className="text-2xl font-bold text-text-primary">{formatApproxSize(offlineSummary.totalSizeApprox)}</p><p>taille estimée</p></div>
            </div>
            <p className="rounded-2xl border border-border bg-bg-primary/60 p-3">État réseau : {isOnline ? 'en ligne' : 'hors ligne'}. Les packs statiques et chapitres en cache fonctionnent sans API ; les versions API-only peuvent nécessiter internet.</p>
            <div className="rounded-2xl border border-border bg-bg-primary/60 p-3">
              <p className="font-bold text-text-primary">Packs bibliques statiques</p>
              <p className="mt-1">Les packs statiques sont servis depuis <code>/public/bibles</code> et restent disponibles sans API après mise en cache PWA. Les versions API-only peuvent nécessiter internet.</p>
              <div className="mt-3 space-y-2">
                {staticTranslations.length === 0 ? <p>Aucun pack statique valide détecté.</p> : staticTranslations.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border bg-bg-card p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-text-primary">{item.name} ({item.shortName})</strong>
                      <span className="rounded-full bg-accent-gold/12 px-2 py-0.5 text-xs font-bold text-accent-gold">{item.availability === 'partial' ? 'partiel statique' : 'statique intégré'}</span>
                    </div>
                    <p className="mt-1 text-xs">{item.bookCount} livre(s) · {item.chapterCount} chapitre(s) déclaré(s) · licence : {item.license}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {FEATURED_TRANSLATIONS.filter((translationItem) => !staticTranslations.some((item) => item.id === translationItem.id)).map((translationItem) => (
                  <span key={translationItem.id} className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold">{translationItem.short} · API seulement</span>
                ))}
              </div>
            </div>

            <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
              {offlineSummary.chapters.length === 0 ? <p>Aucun chapitre n’est encore en cache. Ouvrez un chapitre ou utilisez “Sauvegarder hors ligne” dans le lecteur.</p> : offlineSummary.chapters.map((item) => (
                <div key={`${item.translation}-${item.bookId}-${item.chapter}`} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-bg-primary p-3">
                  <span><strong className="text-text-primary">{item.bookId} {item.chapter}</strong> · {item.translation.toUpperCase()} · {item.pinned ? 'sauvegardé' : 'récent'}</span>
                  <button type="button" onClick={() => { navigate(`/read/${item.translation}/${item.bookId}/${item.chapter}`); }} className="rounded-xl border border-border px-3 py-1.5 font-semibold text-text-primary">Ouvrir</button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => { cleanRecentChapterCache(); refreshOfflineSummary(); toast.success('Cache récent nettoyé.'); }} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-border px-4 font-semibold text-text-primary"><RefreshCw size={16} /> Nettoyer les récents</button>
              <button type="button" onClick={() => { if (window.confirm('Supprimer tous les chapitres hors ligne ?')) { clearOfflineLibrary(); refreshOfflineSummary(); toast.success('Bibliothèque hors ligne supprimée.'); } }} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-border px-4 font-semibold text-[color:var(--color-danger)]"><Trash2 size={16} /> Tout supprimer</button>
            </div>
          </div>
        </section>

        <section className="omed-card p-4 sm:p-6">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-text-primary">
            <Bell size={20} className="text-accent-brown" /> Rappel quotidien local
          </h2>
          <div className="space-y-4 text-sm text-text-secondary">
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-bg-primary p-4">
              <span><span className="block font-medium text-text-primary">Activer un rappel dans la session</span><span>Fonctionne quand l’application est ouverte ; ce n’est pas une notification push garantie en arrière-plan.</span></span>
              <input type="checkbox" checked={reminderPreferences.enabled} onChange={(event) => updateReminders({ enabled: event.target.checked })} className="h-5 w-5 shrink-0 accent-accent-gold" />
            </label>
            <label className="block font-medium text-text-secondary">Heure du rappel
              <input type="time" value={reminderPreferences.time} onChange={(event) => updateReminders({ time: event.target.value })} className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-bg-primary px-4 py-3 text-text-primary" />
            </label>
            <div className="rounded-2xl border border-border bg-bg-primary p-4">
              <p className="font-semibold text-text-primary">Notifications navigateur : {reminderPermission === 'unsupported' ? 'non supportées' : reminderPermission}</p>
              <p className="mt-1">Si vous autorisez les notifications, Omed peut afficher un rappel local pendant une session ouverte.</p>
              <button type="button" onClick={() => void requestReminderPermission()} className="mt-3 rounded-2xl border border-border px-4 py-2 font-semibold text-text-primary" disabled={reminderPermission === 'unsupported'}>Demander la permission</button>
            </div>
          </div>
        </section>

        <section className="omed-card p-4 sm:p-6">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-text-primary">
            <Cloud size={20} className="text-accent-brown" /> Synchronisation
          </h2>

          {user ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-bg-primary p-4">
                {user.picture ? <img src={user.picture} alt={user.name} className="h-16 w-16 rounded-full" /> : <div className="h-16 w-16 rounded-full bg-accent-gold text-white flex items-center justify-center font-bold text-xl">{user.name.charAt(0)}</div>}
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold text-text-primary">{user.name}</h3>
                  <p className="truncate text-text-secondary">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button type="button" onClick={handleSyncData} disabled={syncing} className="omed-button-primary flex w-full items-center justify-center gap-2 py-3 disabled:opacity-50">
                  <Cloud size={20} />
                  {syncing ? 'Synchronisation...' : 'Restaurer depuis Google Drive'}
                </button>

                <button type="button" onClick={handleForceUpload} disabled={syncing} className="omed-button-ghost flex w-full items-center justify-center gap-2 py-3 disabled:opacity-50">
                  <RefreshCw size={20} />
                  Sauvegarder sur Google Drive
                </button>

                <div className="flex items-center justify-center gap-2 text-sm text-text-muted mt-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${synced ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  État : {synced ? 'Synchronisation automatique activée' : 'Non synchronisé'}
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setSynced(false);
                  }}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl px-2 font-medium text-[color:var(--color-danger)] transition-colors hover:bg-[color:var(--color-danger)]/10"
                >
                  <LogOut size={18} />
                  Se déconnecter
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-text-secondary mb-4">Connectez-vous pour synchroniser vos données sur tous vos appareils.</p>
              <button type="button" onClick={() => navigate('/login')} className="omed-button-ghost px-6 py-2.5 font-semibold">Se connecter</button>
            </div>
          )}
        </section>

        <section className="omed-card p-4 sm:p-6">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-text-primary">
            <Database size={20} className="text-accent-brown" /> Données personnelles
          </h2>
          <div className="space-y-4">
            <button type="button" onClick={exportData} className="flex min-h-16 w-full items-center gap-3 rounded-2xl border border-border p-4 text-left transition-colors hover:bg-bg-primary">
              <div className="rounded-xl bg-bg-secondary p-2 text-accent-brown"><Download size={20} /></div>
              <div>
                <h4 className="font-medium text-text-primary">Exporter mes données</h4>
                <p className="text-sm text-text-muted">Télécharger une sauvegarde JSON de vos favoris, notes, études bibliques, préférences, onboarding et collections.</p>
              </div>
            </button>

            <input
              ref={restoreInputRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              aria-label="Choisir une sauvegarde Omed Scripture à restaurer"
              onChange={(event) => { void restoreData(event.target.files?.[0] ?? null); }}
            />
            <button type="button" onClick={() => restoreInputRef.current?.click()} className="flex min-h-16 w-full items-center gap-3 rounded-2xl border border-border p-4 text-left transition-colors hover:bg-bg-primary">
              <div className="rounded-xl bg-bg-secondary p-2 text-accent-brown"><RefreshCw size={20} /></div>
              <div>
                <h4 className="font-medium text-text-primary">Restaurer une sauvegarde</h4>
                <p className="text-sm text-text-muted">Importer un JSON Omed Scripture validé ; une sauvegarde locale est créée avant toute restauration.</p>
              </div>
            </button>

            <button type="button" onClick={clearData} className="flex min-h-16 w-full items-center gap-3 rounded-2xl border border-[color:var(--color-danger)]/25 p-4 text-left transition-colors hover:border-[color:var(--color-danger)]/45 hover:bg-[color:var(--color-danger)]/8">
              <div className="rounded-xl bg-[color:var(--color-danger)]/12 p-2 text-[color:var(--color-danger)]"><Trash2 size={20} /></div>
              <div>
                <h4 className="font-medium text-[color:var(--color-danger)]">Effacer toutes les données</h4>
                <p className="text-sm text-text-muted">Supprimer définitivement les données locales (irréversible).</p>
              </div>
            </button>
          </div>
        </section>
      </div>
      </ContentDeck>
    </PageCanvas>
  );
};

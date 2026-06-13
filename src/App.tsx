import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { LoginPage } from './features/auth/LoginPage';
import { Layout } from './components/Layout';
import { ReaderPage } from './features/reader/ReaderPage';
import { SearchPage } from './features/search/SearchPage';
import { FavoritesPage } from './features/favorites/FavoritesPage';
import { NotesPage } from './features/notes/NotesPage';
import { PlansPage } from './features/plans/PlansPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { PlanDetail } from './features/plans/PlanDetail';
import { HomePage } from './features/home/HomePage';
import { PrayerPage } from './features/prayer/PrayerPage';
import { MorePage } from './features/more/MorePage';
import { MePage } from './features/me/MePage';
import { OnboardingPage } from './features/onboarding/OnboardingPage';
import { CollectionsPage } from './features/collections/CollectionsPage';
import { MemoryPage } from './features/memory/MemoryPage';
import { StudyPage } from './features/study/StudyPage';
import { StudySessionEditor } from './features/study/StudySessionEditor';
import { NotFoundPage } from './features/not-found/NotFoundPage';
import { useBibleStore } from './store/useBibleStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useFavoritesStore } from './store/useFavoritesStore';
import { useHighlightsStore } from './store/useHighlightsStore';
import { useNotesStore } from './store/useNotesStore';
import { usePlansStore } from './store/usePlansStore';
import { usePrayerStore } from './store/usePrayerStore';
import { useOnboardingStore } from './store/useOnboardingStore';
import { useCollectionsStore } from './store/useCollectionsStore';
import { useMemoryStore } from './store/useMemoryStore';
import { useReminderStore } from './store/useReminderStore';
import { useStudyStore } from './store/useStudyStore';
import { syncFileFromDrive, DRIVE_FILES, isDriveSessionInvalidError } from './utils/driveSync';
import { backupLocalDataBeforeRestore, isValidArray, isValidReadingPosition, isValidRecord } from './utils/backups';
import { CommandPalette } from './components/CommandPalette';
import { MeditationOverlay } from './components/MeditationOverlay';
import { THEME_CLASSES, getThemeMeta } from './data/themes';
import { getNotificationPermission } from './utils/reminders';

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const token = useAuthStore((state) => state.token);
  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  const expireSession = useAuthStore((state) => state.expireSession);
  const synced = useSettingsStore((state) => state.synced);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const settings = useSettingsStore((state) => state.settings);
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);
  const loadHighlights = useHighlightsStore((state) => state.loadHighlights);
  const loadNotes = useNotesStore((state) => state.loadNotes);
  const loadPlans = usePlansStore((state) => state.loadPlans);
  const loadPrayers = usePrayerStore((state) => state.loadPrayers);
  const loadOnboarding = useOnboardingStore((state) => state.loadOnboarding);
  const onboardingCompleted = useOnboardingStore((state) => state.preferences.completed);
  const loadCollections = useCollectionsStore((state) => state.loadCollections);
  const loadMemoryVerses = useMemoryStore((state) => state.loadMemoryVerses);
  const loadReminders = useReminderStore((state) => state.loadReminders);
  const loadStudySessions = useStudyStore((state) => state.loadStudySessions);
  const reminderPreferences = useReminderStore((state) => state.preferences);
  const setPosition = useBibleStore((state) => state.setPosition);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...THEME_CLASSES);
    const meta = getThemeMeta(settings.theme);
    root.classList.add(meta.cssClass);
    root.dataset.theme = meta.cssClass.replace('theme-', '');
  }, [settings.theme]);

  useEffect(() => {
    if (sessionExpired) {
      toast.error('Session Google expirée. Veuillez vous reconnecter.');
    }
  }, [sessionExpired]);

  useEffect(() => {
    if (token && synced) {
      const syncDown = async () => {
        try {
          const [
            remoteSettings,
            remoteFavorites,
            remoteHighlights,
            remoteNotes,
            remotePlans,
            remotePosition,
            remotePrayers,
            remoteOnboarding,
            remoteCollections,
            remoteMemory,
            remoteReminders,
            remoteStudySessions
          ] = await Promise.all([
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
            syncFileFromDrive(DRIVE_FILES.studySessions, token)
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
        } catch (err) {
          console.error("Erreur de synchronisation automatique en arrière-plan", err);
          if (isDriveSessionInvalidError(err)) {
            expireSession();
          } else {
            toast.error('Synchronisation Google Drive impossible pour le moment.');
          }
        }
      };
      syncDown();
    }
  }, [token, synced, loadSettings, loadFavorites, loadHighlights, loadNotes, loadPlans, loadPrayers, loadOnboarding, loadCollections, loadMemoryVerses, loadReminders, loadStudySessions, setPosition, expireSession]);


  useEffect(() => {
    if (!reminderPreferences.enabled) return undefined;
    let lastFiredKey: string | null = null;
    const timer = window.setInterval(() => {
      const now = new Date();
      const current = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const dayKey = now.toISOString().slice(0, 10);
      if (current !== reminderPreferences.time || lastFiredKey === dayKey) return;
      lastFiredKey = dayKey;
      const message = 'Votre moment quotidien Omed Scripture est prêt.';
      if (reminderPreferences.useNotifications && getNotificationPermission() === 'granted') {
        new Notification('Omed Scripture', { body: message, tag: 'omed-daily-reminder' });
      } else {
        toast(message);
      }
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [reminderPreferences.enabled, reminderPreferences.time, reminderPreferences.useNotifications]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={onboardingCompleted ? <HomePage /> : <OnboardingPage />} />
          <Route path="/reader" element={<ReaderPage />} />
          <Route path="/read/:translation/:bookId/:chapter" element={<ReaderPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/discover" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/prayer" element={<PrayerPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/plans/:planId" element={<PlanDetail />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/me" element={<MePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/study/:sessionId" element={<StudySessionEditor />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <CommandPalette />
      <MeditationOverlay />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--color-surface-raised)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-panel)',
          },
        }}
      />
    </Router>
  );
}

export default App;

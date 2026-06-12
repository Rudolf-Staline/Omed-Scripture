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
import { NotFoundPage } from './features/not-found/NotFoundPage';
import { useBibleStore } from './store/useBibleStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useFavoritesStore } from './store/useFavoritesStore';
import { useHighlightsStore } from './store/useHighlightsStore';
import { useNotesStore } from './store/useNotesStore';
import { usePlansStore } from './store/usePlansStore';
import { usePrayerStore } from './store/usePrayerStore';
import { syncFileFromDrive, DRIVE_FILES, isDriveSessionInvalidError } from './utils/driveSync';
import { backupLocalDataBeforeRestore, isValidArray, isValidReadingPosition, isValidRecord } from './utils/backups';
import { CommandPalette } from './components/CommandPalette';
import { MeditationOverlay } from './components/MeditationOverlay';
import { THEME_CLASSES, getThemeMeta } from './data/themes';

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
            remotePrayers
          ] = await Promise.all([
            syncFileFromDrive(DRIVE_FILES.settings, token),
            syncFileFromDrive(DRIVE_FILES.favorites, token),
            syncFileFromDrive(DRIVE_FILES.highlights, token),
            syncFileFromDrive(DRIVE_FILES.notes, token),
            syncFileFromDrive(DRIVE_FILES.plans, token),
            syncFileFromDrive(DRIVE_FILES.position, token),
            syncFileFromDrive(DRIVE_FILES.prayers, token)
          ]);

          const hasRemoteData = Boolean(remoteSettings || remoteFavorites || remoteHighlights || remoteNotes || remotePlans || remotePosition || remotePrayers);
          if (hasRemoteData) backupLocalDataBeforeRestore();

          if (isValidRecord(remoteSettings)) loadSettings(remoteSettings as unknown as Parameters<typeof loadSettings>[0]);
          if (isValidArray(remoteFavorites)) loadFavorites(remoteFavorites as Parameters<typeof loadFavorites>[0]);
          if (isValidRecord(remoteHighlights)) loadHighlights(remoteHighlights as Parameters<typeof loadHighlights>[0]);
          if (isValidArray(remoteNotes)) loadNotes(remoteNotes as Parameters<typeof loadNotes>[0]);
          if (isValidRecord(remotePlans)) loadPlans(remotePlans as Parameters<typeof loadPlans>[0]);
          if (isValidReadingPosition(remotePosition)) setPosition(remotePosition.translation, remotePosition.bookId, remotePosition.chapter);
          if (isValidArray(remotePrayers)) loadPrayers(remotePrayers as Parameters<typeof loadPrayers>[0]);
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
  }, [token, synced, loadSettings, loadFavorites, loadHighlights, loadNotes, loadPlans, loadPrayers, setPosition, expireSession]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
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

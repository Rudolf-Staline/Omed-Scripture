import React, { useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import type {
  FontSize,
  LineHeight,
  FontFamily,
  Theme,
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
import { FEATURED_TRANSLATIONS } from '../../utils/bibleApi';
import { clearOmedLocalData } from '../../constants/storageKeys';
import { backupLocalDataBeforeRestore, createBackup, isValidArray, isValidReadingPosition, isValidRecord } from '../../utils/backups';
import { syncFileToDrive, syncFileFromDrive, DRIVE_FILES, isDriveSessionInvalidError } from '../../utils/driveSync';
import { Settings, Cloud, LogOut, Download, Trash2, RefreshCw, Palette, BookOpen, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, synced, setSynced, loadSettings } = useSettingsStore();
  const { user, token, logout, expireSession } = useAuthStore();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);

  const { loadFavorites, favorites } = useFavoritesStore();
  const { loadHighlights, highlights } = useHighlightsStore();
  const { loadNotes, notes } = useNotesStore();
  const { loadPlans, progress } = usePlansStore();
  const { translation, bookId, chapter } = useBibleStore();
  const setPosition = useBibleStore((state) => state.setPosition);

  const fontSizes: FontSize[] = ['S', 'M', 'L', 'XL'];
  const lineHeights: LineHeight[] = ['Normal', 'Relaxed', 'Large'];
  const fontFamilies: FontFamily[] = ['Lora', 'Inter'];
  const themes: Theme[] = ['Light', 'Sepia', 'Dark'];
  const languages: Language[] = ['Français', 'English'];
  const readingWidths: ReadingWidth[] = ['Narrow', 'Comfortable', 'Wide'];
  const readingDensities: ReadingDensity[] = ['Compact', 'Aired'];

  const handleSyncData = async () => {
    if (!token) {
      toast.error("Vous devez être connecté pour synchroniser vos données.");
      return;
    }
    setSyncing(true);
    try {
      const [remoteSettings, remoteFavorites, remoteHighlights, remoteNotes, remotePlans, remotePosition] = await Promise.all([
        syncFileFromDrive(DRIVE_FILES.settings, token),
        syncFileFromDrive(DRIVE_FILES.favorites, token),
        syncFileFromDrive(DRIVE_FILES.highlights, token),
        syncFileFromDrive(DRIVE_FILES.notes, token),
        syncFileFromDrive(DRIVE_FILES.plans, token),
        syncFileFromDrive(DRIVE_FILES.position, token),
      ]);

      const hasRemoteData = Boolean(remoteSettings || remoteFavorites || remoteHighlights || remoteNotes || remotePlans || remotePosition);
      if (hasRemoteData) backupLocalDataBeforeRestore();

      if (isValidRecord(remoteSettings)) loadSettings(remoteSettings as unknown as Parameters<typeof loadSettings>[0]);
      if (isValidArray(remoteFavorites)) loadFavorites(remoteFavorites as Parameters<typeof loadFavorites>[0]);
      if (isValidRecord(remoteHighlights)) loadHighlights(remoteHighlights as Parameters<typeof loadHighlights>[0]);
      if (isValidArray(remoteNotes)) loadNotes(remoteNotes as Parameters<typeof loadNotes>[0]);
      if (isValidRecord(remotePlans)) loadPlans(remotePlans as Parameters<typeof loadPlans>[0]);
      if (isValidReadingPosition(remotePosition)) setPosition(remotePosition.translation, remotePosition.bookId, remotePosition.chapter);

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

  const clearData = () => {
    const confirmed = window.confirm(
      'Confirmez-vous la suppression des données locales Omed Scripture uniquement (favoris, notes, surlignages, préférences, parcours, position et session Google) ? Les autres données de ce domaine seront conservées.'
    );

    if (confirmed) {
      clearOmedLocalData();
      window.location.reload();
    }
  };

  const SegmentedControl = <T extends string>({ values, selected, onSelect }: { values: readonly T[]; selected: T; onSelect: (value: T) => void }) => (
    <div className="flex gap-2 rounded-2xl border border-border bg-bg-primary p-1">
      {values.map((value) => (
        <button
          type="button"
          key={value}
          onClick={() => onSelect(value)}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
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
    <div className="mx-auto max-w-5xl py-4 md:py-8">
      <h1 className="flex items-center gap-3 font-display text-4xl font-semibold tracking-tight text-text-primary">
        <Settings className="text-accent-gold" />
        Préférences
      </h1>
      <p className="mt-3 mb-8 max-w-2xl text-text-secondary">Personnalisez votre expérience de lecture biblique en toute simplicité.</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[1.5rem] border border-border bg-bg-card/60 p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-text-primary">
            <Palette size={20} className="text-accent-brown" /> Apparence
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Thème</label>
              <SegmentedControl values={themes} selected={settings.theme} onSelect={(theme) => updateSettings({ theme })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Police de lecture</label>
              <div className="flex gap-2 rounded-2xl border border-border bg-bg-primary p-1">
                {fontFamilies.map((ff) => (
                  <button
                    type="button"
                    key={ff}
                    onClick={() => updateSettings({ fontFamily: ff })}
                    className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
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

        <section className="rounded-[1.5rem] border border-border bg-bg-card/60 p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-text-primary">
            <BookOpen size={20} className="text-accent-brown" /> Lecture
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Version par défaut</label>
              <select
                value={settings.defaultTranslation}
                onChange={(e) => updateSettings({ defaultTranslation: e.target.value })}
                className="w-full rounded-2xl border border-border bg-bg-primary px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold"
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
                className="w-5 h-5 accent-accent-gold"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-bg-card/60 p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-text-primary">
            <Cloud size={20} className="text-accent-brown" /> Synchronisation
          </h2>

          {user ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-bg-primary p-4">
                {user.picture ? <img src={user.picture} alt={user.name} className="h-16 w-16 rounded-full" /> : <div className="h-16 w-16 rounded-full bg-accent-gold text-white flex items-center justify-center font-bold text-xl">{user.name.charAt(0)}</div>}
                <div>
                  <h3 className="font-semibold text-lg text-text-primary">{user.name}</h3>
                  <p className="text-text-secondary">{user.email}</p>
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
                  className="flex items-center gap-2 text-[color:var(--color-danger)] hover:text-[color:var(--color-danger)] font-medium transition-colors"
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

        <section className="rounded-[1.5rem] border border-border bg-bg-card/60 p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-text-primary">
            <Database size={20} className="text-accent-brown" /> Données personnelles
          </h2>
          <div className="space-y-4">
            <button type="button" onClick={exportData} className="flex w-full items-center gap-3 rounded-2xl border border-border p-4 text-left transition-colors hover:bg-bg-primary">
              <div className="rounded-xl bg-bg-secondary p-2 text-accent-brown"><Download size={20} /></div>
              <div>
                <h4 className="font-medium text-text-primary">Exporter mes données</h4>
                <p className="text-sm text-text-muted">Télécharger une sauvegarde JSON de vos favoris, notes et préférences.</p>
              </div>
            </button>

            <button type="button" onClick={clearData} className="flex w-full items-center gap-3 rounded-2xl border border-[color:var(--color-danger)]/35 p-4 text-left transition-colors hover:bg-[color:var(--color-danger)]/10">
              <div className="rounded-xl bg-[color:var(--color-danger)]/12 p-2 text-[color:var(--color-danger)]"><Trash2 size={20} /></div>
              <div>
                <h4 className="font-medium text-[color:var(--color-danger)]">Effacer toutes les données</h4>
                <p className="text-sm text-[color:var(--color-danger)]/75">Supprimer définitivement les données locales (irréversible).</p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

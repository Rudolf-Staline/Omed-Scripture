import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, Bookmark, Brain, ChevronRight, Cloud, Download, Flame, HandHeart, Info, NotebookPen, Settings, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useMemoryStore } from '../../store/useMemoryStore';
import { useNotesStore } from '../../store/useNotesStore';
import { usePrayerStore } from '../../store/usePrayerStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useDailyRoutineStore } from '../../store/useDailyRoutineStore';
import { getReadingDays } from '../../utils/readingActivity';
import { getUnifiedDailyActivity, getUnifiedStreak, timestampsToDayKeys } from '../../utils/dailyActivity';
import { getMemoryStats } from '../../utils/memory';
import { Card, Stack, Grid, Inline, Badge } from '../../ui';

const menu = [
  { to: '/study', label: 'Études', description: 'Observation, interprétation, application et prière', icon: BookMarked },
  { to: '/notes', label: 'Notes', description: 'Annotations et tags personnels', icon: NotebookPen },
  { to: '/favorites', label: 'Favoris', description: 'Versets sauvegardés', icon: Bookmark },
  { to: '/memory', label: 'Mémoriser', description: 'Versets à revoir et retenir', icon: Brain },
  { to: '/prayer', label: 'Prières', description: 'Journal et demandes', icon: HandHeart },
  { to: '/settings', label: 'Paramètres', description: 'Lecture, apparence, sync et données', icon: Settings },
  { to: '/about', label: 'À propos / bêta', description: 'Présentation, confidentialité, licences et feedback', icon: Info },
];

export const MorePage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const synced = useSettingsStore((state) => state.synced);
  const notes = useNotesStore((state) => state.notes);
  const favorites = useFavoritesStore((state) => state.favorites);
  const memoryVerses = useMemoryStore((state) => state.memoryVerses);
  const prayers = usePrayerStore((state) => state.prayers);
  const routineDays = useDailyRoutineStore((state) => state.days);

  const activePrayers = useMemo(() => prayers.filter((prayer) => prayer.status === 'active').length, [prayers]);
  const memoryStats = useMemo(() => getMemoryStats(memoryVerses), [memoryVerses]);
  const unifiedStreak = useMemo(() => getUnifiedStreak(getUnifiedDailyActivity({
    readingDays: getReadingDays(),
    routineCompletedDays: routineDays.filter((day) => day.completedAt).map((day) => day.date),
    extraDays: timestampsToDayKeys(prayers.map((prayer) => prayer.lastPrayedAt)),
    noteTimestamps: notes.map((note) => note.dateAdded),
  })), [routineDays, prayers, notes]);

  return (
    <Stack gap="md" className="mx-auto max-w-3xl">
      {/* En-tête profil */}
      <Card variant="outlined" padding="lg" radius="lg">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-gold/14 text-accent-gold">
            <UserCircle size={30} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">Moi</p>
            <h1 className="truncate text-2xl font-bold text-text-primary">{user?.name || user?.email || 'Espace personnel'}</h1>
            <Inline gap="xs" className="mt-1 text-sm text-text-secondary">
              <Cloud size={15} className={synced ? 'text-accent-sage' : 'text-text-muted'} />
              <span>{synced ? 'Synchronisation Google Drive activée' : 'Données conservées localement'}</span>
              <Badge tone={synced ? 'success' : 'neutral'} className="ml-1">
                {synced ? 'Sync' : 'Local'}
              </Badge>
            </Inline>
          </div>
        </div>
      </Card>

      {/* Progression */}
      <Card variant="outlined" padding="md" aria-label="Progression">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-accent-gold" />
          <p className="font-semibold text-text-primary">Série quotidienne : {unifiedStreak} jour{unifiedStreak > 1 ? 's' : ''}</p>
          <span className="ml-auto text-sm text-text-muted">lecture · routine · prière · note</span>
        </div>
      </Card>

      {/* Statistiques personnelles */}
      <Grid columns={4} gap="sm" aria-label="Résumé personnel">
        <Card variant="outlined" padding="md" className="text-center">
          <p className="text-2xl font-bold text-text-primary">{notes.length}</p>
          <p className="text-xs text-text-muted">Notes</p>
        </Card>
        <Card variant="outlined" padding="md" className="text-center">
          <p className="text-2xl font-bold text-text-primary">{favorites.length}</p>
          <p className="text-xs text-text-muted">Favoris</p>
        </Card>
        <Card variant="outlined" padding="md" className="text-center">
          <p className="text-2xl font-bold text-text-primary">{memoryStats.due}</p>
          <p className="text-xs text-text-muted">À revoir</p>
        </Card>
        <Card variant="outlined" padding="md" className="text-center">
          <p className="text-2xl font-bold text-text-primary">{activePrayers}</p>
          <p className="text-xs text-text-muted">Prières</p>
        </Card>
      </Grid>

      {/* Menu de navigation */}
      <Card variant="outlined" radius="lg" className="p-2" aria-label="Menu personnel">
        {menu.map((item) => (
          <Link key={item.to} to={item.to} className="flex min-h-16 items-center gap-3 rounded-2xl px-3 hover:bg-bg-secondary">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-bg-secondary text-accent-gold">
              <item.icon size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-text-primary">{item.label}</span>
              <span className="block text-sm text-text-secondary">{item.description}</span>
            </span>
            <ChevronRight size={18} className="text-text-muted" />
          </Link>
        ))}
      </Card>

      {/* Export et sauvegarde */}
      <Card variant="outlined" padding="lg">
        <div className="flex items-start gap-3">
          <Download size={20} className="mt-1 text-accent-gold" />
          <div>
            <h2 className="font-semibold text-text-primary">Export et sauvegarde</h2>
            <p className="mt-1 text-sm leading-6 text-text-secondary">L'export JSON et la synchronisation restent disponibles dans Paramètres, sans migration destructive des données locales.</p>
            <Link to="/settings" className="mt-3 inline-flex min-h-10 items-center rounded-2xl bg-accent-gold px-4 text-sm font-semibold text-white">Ouvrir les paramètres</Link>
          </div>
        </div>
      </Card>
    </Stack>
  );
};

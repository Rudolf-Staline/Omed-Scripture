import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, Bookmark, Brain, ChevronRight, Cloud, Flame, HandHeart, Info, NotebookPen, Settings, UserCircle, ShieldCheck } from 'lucide-react';
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
import { Card, Stack, Grid, Inline, Badge, Callout } from '../../ui';

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
    <Stack gap="lg" className="mx-auto max-w-3xl">
      {/* En-tête profil repensé */}
      <Card variant="outlined" padding="lg" radius="lg" className="border-accent-gold/20 bg-bg-card relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <Badge tone="primary" variant="soft">BaseKit actif</Badge>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-gold/14 text-accent-gold shadow-sm">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="h-full w-full rounded-2xl object-cover" />
            ) : (
              <UserCircle size={36} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-bold text-text-primary">
              {user?.name || user?.email || 'Espace personnel'}
            </h1>
            <Inline gap="sm" className="mt-2 text-sm">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Cloud size={16} className={synced ? 'text-accent-sage' : 'text-text-muted'} />
                {synced ? 'Synchronisation Google Drive activée' : 'Données conservées localement'}
              </span>
              <Badge tone={synced ? 'success' : 'neutral'} variant="soft">
                {synced ? 'Sync' : 'Local'}
              </Badge>
            </Inline>
          </div>
        </div>
      </Card>

      <Grid columns={2} gap="md">
        {/* Progression */}
        <Card variant="outlined" padding="md" radius="lg" className="flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-gold/10 text-accent-gold">
              <Flame size={20} />
            </div>
            <div>
              <p className="font-semibold text-text-primary">Série quotidienne</p>
              <p className="text-sm text-text-secondary">{unifiedStreak} jour{unifiedStreak > 1 ? 's' : ''}</p>
            </div>
          </div>
        </Card>

        {/* Callout Info */}
        <Callout tone="neutral" title="Interface unifiée">
          <p className="text-sm text-text-secondary">Cette page exploite désormais les composants BaseKit pour une présentation structurée.</p>
        </Callout>
      </Grid>

      {/* Statistiques personnelles */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-text-primary">Résumé</h2>
        <Grid columns={4} gap="sm" aria-label="Résumé personnel">
          <Card variant="outlined" padding="md" className="text-center transition-transform hover:scale-105">
            <p className="text-2xl font-bold text-text-primary">{notes.length}</p>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Notes</p>
          </Card>
          <Card variant="outlined" padding="md" className="text-center transition-transform hover:scale-105">
            <p className="text-2xl font-bold text-text-primary">{favorites.length}</p>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Favoris</p>
          </Card>
          <Card variant="outlined" padding="md" className="text-center transition-transform hover:scale-105">
            <p className="text-2xl font-bold text-text-primary">{memoryStats.due}</p>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">À revoir</p>
          </Card>
          <Card variant="outlined" padding="md" className="text-center transition-transform hover:scale-105">
            <p className="text-2xl font-bold text-text-primary">{activePrayers}</p>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Prières</p>
          </Card>
        </Grid>
      </section>

      {/* Menu de navigation */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-text-primary">Navigation</h2>
        <Card variant="outlined" radius="lg" padding="sm" aria-label="Menu personnel">
          <Stack gap="xs">
            {menu.map((item) => (
              <Link key={item.to} to={item.to} className="group flex min-h-16 items-center gap-4 rounded-xl px-3 transition-colors hover:bg-bg-secondary">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-secondary text-accent-gold transition-colors group-hover:bg-bg-primary">
                  <item.icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-text-primary">{item.label}</span>
                  <span className="block text-sm text-text-secondary">{item.description}</span>
                </span>
                <ChevronRight size={20} className="text-text-muted transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </Stack>
        </Card>
      </section>

      {/* Export et sauvegarde */}
      <Card variant="outlined" padding="lg" radius="lg" className="border-accent-gold/20">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-gold/10 text-accent-gold">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="font-semibold text-text-primary">Export et sauvegarde</h2>
              <p className="mt-1 text-sm leading-6 text-text-secondary max-w-md">L'export JSON et la synchronisation restent disponibles dans Paramètres, sans migration destructive des données locales.</p>
            </div>
          </div>
          <Link to="/settings" className="shrink-0 inline-flex h-10 items-center justify-center rounded-xl bg-accent-gold px-5 text-sm font-semibold text-white transition-transform hover:scale-105">
            Ouvrir les paramètres
          </Link>
        </div>
      </Card>
    </Stack>
  );
};

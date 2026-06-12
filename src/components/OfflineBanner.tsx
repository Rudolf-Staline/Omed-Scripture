import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../utils/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-bg-card/95 px-4 py-2 text-sm text-text-secondary backdrop-blur-xl" role="status">
      <div className="mx-auto flex max-w-6xl items-center gap-2">
        <WifiOff size={16} className="text-accent-brown" />
        Hors ligne : seuls les chapitres déjà consultés ou sauvegardés restent disponibles.
      </div>
    </div>
  );
};

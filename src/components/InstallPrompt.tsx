import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { isStandaloneDisplay, readInstallPromptDismissed, writeInstallPromptDismissed } from '../utils/pwa';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export const InstallPrompt: React.FC = () => {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => readInstallPromptDismissed());

  useEffect(() => {
    const onPrompt = (promptEvent: Event) => {
      promptEvent.preventDefault();
      setEvent(promptEvent as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (dismissed || isStandaloneDisplay() || !event) return null;

  const install = async () => {
    await event.prompt();
    const choice = await event.userChoice;
    if (choice.outcome === 'accepted' || choice.outcome === 'dismissed') {
      setEvent(null);
      writeInstallPromptDismissed(true);
      setDismissed(true);
    }
  };

  return (
    <div className="rounded-[1.5rem] border border-accent-gold/30 bg-accent-gold/10 p-4 text-sm text-text-secondary">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-text-primary">Installer Omed Scripture</p>
          <p>Ajoutez l’app à l’écran d’accueil pour une expérience mobile plus rapide.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={install} className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-accent-gold px-4 font-bold text-white"><Download size={16} /> Installer</button>
          <button type="button" onClick={() => { writeInstallPromptDismissed(true); setDismissed(true); }} className="min-h-11 rounded-2xl border border-border px-4 font-semibold text-text-secondary">Plus tard</button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command, CornerDownLeft, Search } from 'lucide-react';
import clsx from 'clsx';
import { useUiStore } from '../store/useUiStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useBibleStore } from '../store/useBibleStore';
import { buildCommands, filterCommands, type PaletteCommand } from '../utils/commandPalette';
import { getDailyVerse } from '../utils/dailyVerse';

const CommandPalettePanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const openMeditation = useUiStore((state) => state.openMeditation);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const { translation, bookId, chapter } = useBibleStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const readerPath = `/read/${translation}/${bookId}/${chapter}`;
  const commands = useMemo(() => buildCommands(readerPath), [readerPath]);
  const results = useMemo(() => filterCommands(commands, query), [commands, query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runCommand = (command: PaletteCommand) => {
    onClose();
    if (command.kind === 'navigate' && command.to) {
      navigate(command.to);
    } else if (command.kind === 'theme' && command.themeId) {
      updateSettings({ theme: command.themeId });
    } else if (command.kind === 'action' && command.actionId === 'meditation') {
      openMeditation(getDailyVerse());
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index - 1 + results.length) % results.length : 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const command = results[activeIndex];
      if (command) runCommand(command);
    }
  };

  const safeIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center bg-black/55 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Palette de commandes"
        className="omed-fade-in w-full max-w-xl overflow-hidden rounded-2xl border border-border-strong bg-bg-card shadow-[var(--shadow-panel)]"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search size={18} className="text-text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder="Aller à, changer de thème, méditer…"
            aria-label="Rechercher une commande"
            className="min-h-9 flex-1 bg-transparent text-base text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <span className="hidden items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[11px] font-semibold text-text-muted sm:flex">
            <Command size={11} /> K
          </span>
        </div>

        <ul className="max-h-[52vh] overflow-y-auto p-2" role="listbox" aria-label="Commandes">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-text-muted">Aucune commande pour « {query} ».</li>
          ) : (
            results.map((command, index) => (
              <li key={command.id} role="option" aria-selected={index === safeIndex}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => runCommand(command)}
                  className={clsx(
                    'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                    index === safeIndex ? 'bg-accent-gold/14 text-text-primary' : 'text-text-secondary hover:bg-bg-secondary'
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-text-primary">{command.label}</span>
                    {command.hint && <span className="block truncate text-xs text-text-muted">{command.hint}</span>}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="hidden text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted sm:inline">{command.group}</span>
                    {index === safeIndex && <CornerDownLeft size={14} className="text-accent-gold" aria-hidden="true" />}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export const CommandPalette: React.FC = () => {
  const open = useUiStore((state) => state.commandPaletteOpen);
  const toggle = useUiStore((state) => state.toggleCommandPalette);
  const close = useUiStore((state) => state.closeCommandPalette);

  // Raccourci global ⌘K / Ctrl+K.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);

  if (!open) return null;
  return <CommandPalettePanel onClose={close} />;
};

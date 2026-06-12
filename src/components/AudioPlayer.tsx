import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, X, Square } from 'lucide-react';
import { getChapter, FEATURED_TRANSLATIONS } from '../utils/bibleApi';
import type { Verse } from '../utils/bibleApi';
import { getBookName } from '../utils/bibleBooks';
import { getCachedChapter } from '../utils/chapterCache';

interface AudioPlayerProps {
  translation: string;
  bookId: string;
  chapter: number;
  onClose: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ translation, bookId, chapter, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hasUtterance, setHasUtterance] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const versesRef = useRef<Verse[]>([]);

  useEffect(() => {
    let active = true;
    window.queueMicrotask(() => {
      if (!active) return;
      setMessage(null);
      setIsPlaying(false);
      setHasUtterance(false);
    });
    utteranceRef.current = null;
    window.speechSynthesis?.cancel();

    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      window.queueMicrotask(() => {
        if (active) setMessage('La lecture audio n’est pas disponible dans ce navigateur.');
      });
      return undefined;
    }

    const cached = getCachedChapter(translation, bookId, chapter);
    if (cached) {
      versesRef.current = cached;
      return () => window.speechSynthesis.cancel();
    }

    window.queueMicrotask(() => {
      if (active) setIsLoading(true);
    });
    getChapter(translation, bookId, chapter)
      .then((verses) => {
        if (active) versesRef.current = verses;
      })
      .catch((err: unknown) => {
        console.error(err);
        if (active) setMessage('Impossible de préparer la lecture audio pour ce chapitre.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
      window.speechSynthesis.cancel();
    };
  }, [translation, bookId, chapter]);

  useEffect(() => {
    if (utteranceRef.current) utteranceRef.current.rate = speed;
  }, [speed]);

  const startPlayback = () => {
    if (!versesRef.current.length) return;
    window.speechSynthesis.cancel();
    const text = versesRef.current.map((v) => v.text).join(' ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = ['kjv', 'web', 'bbe'].includes(translation) ? 'en-US' : 'fr-FR';
    utterance.rate = speed;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (event) => {
      console.error('SpeechSynthesis error:', event);
      setIsPlaying(false);
      setMessage('La lecture audio a été interrompue.');
    };
    utteranceRef.current = utterance;
    setHasUtterance(true);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!utteranceRef.current) {
      startPlayback();
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const stopPlayback = () => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setHasUtterance(false);
    setIsPlaying(false);
  };

  const cycleSpeed = () => {
    const nextSpeed = speed === 1.0 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 2.0 : 1.0;
    setSpeed(nextSpeed);
    if (isPlaying) {
      stopPlayback();
      window.setTimeout(startPlayback, 0);
    }
  };

  const translationName = FEATURED_TRANSLATIONS.find((t) => t.id === translation)?.short || translation;

  return (
    <div className="verse-action-surface fixed bottom-0 left-0 right-0 z-50 flex min-h-16 flex-col border-x-0 border-b-0" role="region" aria-label="Lecteur audio du chapitre">
      <div className="grid w-full max-w-4xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 sm:mx-auto sm:flex sm:px-6">
        <div className="flex-1 flex items-center min-w-0">
          <div className="truncate">
            <h4 className="font-display font-semibold text-text-primary truncate">{getBookName(bookId)} {chapter}</h4>
            <p className="text-xs text-text-muted uppercase tracking-wider">{translationName}</p>
            {message && <p className="text-xs normal-case tracking-normal text-[color:var(--color-danger)]">{message}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:flex-1 sm:justify-center">
          <button type="button" onClick={togglePlay} disabled={isLoading || Boolean(message)} aria-label={isPlaying ? 'Mettre la lecture en pause' : 'Démarrer la lecture audio'} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${isLoading || message ? 'bg-bg-secondary text-text-muted cursor-not-allowed' : 'bg-accent-gold text-[#171109] hover:bg-accent-brown'}`}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button type="button" onClick={stopPlayback} disabled={!hasUtterance} className="min-h-10 min-w-10 rounded-xl p-2 text-text-muted hover:bg-bg-secondary hover:text-text-primary disabled:opacity-40" title="Stop" aria-label="Arrêter la lecture audio">
            <Square size={16} />
          </button>
        </div>

        <div className="col-span-2 flex items-center justify-end gap-2 border-t border-border/60 pt-2 sm:col-span-1 sm:flex-1 sm:border-t-0 sm:pt-0">
          <button type="button" onClick={cycleSpeed} title="Vitesse de lecture" aria-label="Changer la vitesse de lecture" className="min-h-10 w-12 rounded-xl text-center text-xs font-mono font-medium text-text-secondary hover:bg-bg-secondary hover:text-text-primary">
            {speed.toFixed(1)}x
          </button>
          <div className="w-px h-6 bg-border mx-1"></div>
          <button type="button" onClick={onClose} className="min-h-10 min-w-10 rounded-xl p-2 text-text-muted hover:bg-bg-secondary hover:text-text-primary" aria-label="Fermer le lecteur audio">
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

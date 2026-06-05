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
    <div className="fixed bottom-0 left-0 right-0 min-h-16 bg-bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex flex-col">
      <div className="flex-1 flex items-center justify-between gap-3 px-4 sm:px-6 max-w-4xl mx-auto w-full py-3">
        <div className="flex-1 flex items-center min-w-0">
          <div className="truncate">
            <h4 className="font-display font-semibold text-text-primary truncate">{getBookName(bookId)} {chapter}</h4>
            <p className="text-xs text-text-muted uppercase tracking-wider">{translationName}</p>
            {message && <p className="text-xs normal-case tracking-normal text-red-500">{message}</p>}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center gap-2">
          <button onClick={togglePlay} disabled={isLoading || Boolean(message)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${isLoading || message ? 'bg-bg-secondary text-text-muted cursor-not-allowed' : 'bg-accent-gold text-white hover:bg-accent-brown'}`}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={stopPlayback} disabled={!hasUtterance} className="p-2 text-text-muted hover:text-text-primary disabled:opacity-40" title="Stop">
            <Square size={16} />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-end gap-3">
          <button onClick={cycleSpeed} title="Vitesse de lecture" className="text-xs font-mono font-medium text-text-secondary hover:text-text-primary w-10 text-right">
            {speed.toFixed(1)}x
          </button>
          <div className="w-px h-6 bg-border mx-1"></div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

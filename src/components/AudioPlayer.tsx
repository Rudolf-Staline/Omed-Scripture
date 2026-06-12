import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, X, Square, Volume2 } from 'lucide-react';
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

const hasSpeech = () => typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ translation, bookId, chapter, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hasUtterance, setHasUtterance] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const versesRef = useRef<Verse[]>([]);

  const lang = ['kjv', 'web', 'bbe'].includes(translation) ? 'en-US' : 'fr-FR';
  const selectedVoice = useMemo(() => voices.find((voice) => voice.voiceURI === voiceURI) ?? voices.find((voice) => voice.lang.startsWith(lang.slice(0, 2))) ?? null, [voices, voiceURI, lang]);

  useEffect(() => {
    if (!hasSpeech()) return undefined;
    const refreshVoices = () => setVoices(window.speechSynthesis.getVoices());
    refreshVoices();
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', refreshVoices);
  }, []);

  useEffect(() => {
    let active = true;
    window.queueMicrotask(() => {
      if (!active) return;
      setMessage(null);
      setIsPlaying(false);
      setHasUtterance(false);
    });
    utteranceRef.current = null;
    if (hasSpeech()) window.speechSynthesis.cancel();

    if (!hasSpeech()) {
      window.queueMicrotask(() => { if (active) setMessage('La lecture audio utilise la synthèse vocale du navigateur, indisponible ici.'); });
      return undefined;
    }

    const cached = getCachedChapter(translation, bookId, chapter);
    if (cached) {
      versesRef.current = cached;
      return () => window.speechSynthesis.cancel();
    }

    window.queueMicrotask(() => { if (active) setIsLoading(true); });
    getChapter(translation, bookId, chapter)
      .then((verses) => {
        if (active) versesRef.current = verses;
      })
      .catch((err: unknown) => {
        console.error(err);
        if (active) setMessage('Impossible de préparer la synthèse vocale pour ce chapitre.');
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
    if (!hasSpeech() || !versesRef.current.length) return;
    window.speechSynthesis.cancel();
    const text = versesRef.current.map((v) => `${v.verse}. ${v.text}`).join(' ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedVoice?.lang ?? lang;
    utterance.voice = selectedVoice;
    utterance.rate = speed;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (event) => {
      console.error('SpeechSynthesis error:', event);
      setIsPlaying(false);
      setMessage('La synthèse vocale a été interrompue.');
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
    if (hasSpeech()) window.speechSynthesis.cancel();
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
    <div className="verse-action-surface fixed bottom-0 left-0 right-0 z-50 flex max-h-[80vh] min-h-16 flex-col overflow-y-auto border-x-0 border-b-0 pb-[env(safe-area-inset-bottom)]" role="region" aria-label="Lecteur audio du chapitre">
      <div className="grid w-full max-w-4xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 sm:mx-auto sm:flex sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent-gold/14 text-accent-gold sm:flex"><Volume2 size={18} /></span>
          <div className="min-w-0">
            <h4 className="truncate font-display font-semibold text-text-primary">{getBookName(bookId)} {chapter}</h4>
            <p className="text-xs uppercase tracking-wider text-text-muted">Synthèse vocale navigateur · {translationName}</p>
            {message && <p className="text-xs normal-case tracking-normal text-[color:var(--color-danger)]">{message}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:flex-1 sm:justify-center">
          <button type="button" onClick={togglePlay} disabled={isLoading || Boolean(message)} aria-label={isPlaying ? 'Mettre la lecture en pause' : 'Démarrer la synthèse vocale'} className={`flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition-colors ${isLoading || message ? 'cursor-not-allowed bg-bg-secondary text-text-muted' : 'bg-accent-gold text-[#171109] hover:bg-accent-brown'}`}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button type="button" onClick={stopPlayback} disabled={!hasUtterance} className="min-h-11 min-w-11 rounded-xl p-2 text-text-muted hover:bg-bg-secondary hover:text-text-primary disabled:opacity-40" aria-label="Arrêter la lecture audio">
            <Square size={16} />
          </button>
        </div>

        <div className="col-span-2 grid gap-2 border-t border-border/60 pt-2 sm:col-span-1 sm:flex sm:flex-1 sm:items-center sm:justify-end sm:border-t-0 sm:pt-0">
          <select value={voiceURI} onChange={(event) => setVoiceURI(event.target.value)} className="min-h-10 rounded-xl border border-border bg-bg-primary px-2 text-xs text-text-secondary" aria-label="Choisir une voix de synthèse" disabled={voices.length === 0}>
            <option value="">Voix auto</option>
            {voices.map((voice) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} · {voice.lang}</option>)}
          </select>
          <button type="button" onClick={cycleSpeed} aria-label="Changer la vitesse de lecture" className="min-h-10 rounded-xl px-3 text-center font-mono text-xs font-medium text-text-secondary hover:bg-bg-secondary hover:text-text-primary">
            {speed.toFixed(1)}x
          </button>
          <button type="button" onClick={onClose} className="min-h-10 min-w-10 rounded-xl p-2 text-text-muted hover:bg-bg-secondary hover:text-text-primary" aria-label="Fermer le lecteur audio">
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

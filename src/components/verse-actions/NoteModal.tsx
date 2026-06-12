import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { parseTagsInput } from '../../utils/noteTags';

interface NoteModalProps {
  reference: string;
  onCancel: () => void;
  onSave: (text: string, tags: string[]) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({ reference, onCancel, onSave }) => {
  const [text, setText] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const save = () => {
    const trimmed = text.trim();
    if (trimmed) onSave(trimmed, parseTagsInput(tagsInput));
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4" onClick={onCancel}>
      <div className="w-full max-w-lg rounded-2xl border border-border bg-bg-card p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Nouvelle note</p>
            <h2 className="font-display text-xl font-semibold text-text-primary">{reference}</h2>
          </div>
          <button type="button" onClick={onCancel} className="rounded-lg p-1 text-text-muted hover:bg-bg-secondary hover:text-text-primary" aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <label className="block text-sm font-medium text-text-secondary" htmlFor="verse-note">
          Note personnelle
        </label>
        <textarea
          id="verse-note"
          ref={textareaRef}
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="mt-2 min-h-[150px] w-full rounded-lg border border-border bg-bg-primary p-3 font-body text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold"
          placeholder="Écrivez votre réflexion…"
        />

        <label className="mt-4 block text-sm font-medium text-text-secondary" htmlFor="verse-note-tags">
          Tags <span className="font-normal text-text-muted">(séparés par des virgules, optionnel)</span>
        </label>
        <input
          id="verse-note-tags"
          type="text"
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-bg-primary p-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold"
          placeholder="grâce, prière, étude…"
        />

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 font-medium text-text-muted transition-colors hover:bg-bg-secondary">
            Annuler
          </button>
          <button type="button" onClick={save} disabled={!text.trim()} className="rounded-lg bg-accent-gold px-4 py-2 font-medium text-white transition-colors hover:bg-accent-brown disabled:cursor-not-allowed disabled:opacity-50">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

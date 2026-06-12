import React, { useState } from 'react';
import { BookmarkPlus, Check, Copy, Edit3, Heart, MessageCircle, Palette, Share2, Type, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Verse } from '../../utils/bibleApi';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useHighlightsStore } from '../../store/useHighlightsStore';
import type { HighlightColor } from '../../store/useHighlightsStore';
import { useNotesStore } from '../../store/useNotesStore';
import { formatBibleReference } from '../../utils/bibleBooks';
import { NoteModal } from '../../components/verse-actions/NoteModal';
import { createShareVerseImage } from '../../components/verse-actions/shareVerseImage';

interface VerseActionsProps {
  verse: Verse;
  verseId: string;
  translation: string;
  bookId: string;
  onClose: () => void;
}

const colors: { id: HighlightColor; hex: string; label: string }[] = [
  { id: 'yellow', hex: '#fef08a', label: 'Or' },
  { id: 'blue', hex: '#bfdbfe', label: 'Bleu' },
  { id: 'green', hex: '#bbf7d0', label: 'Vert' },
  { id: 'pink', hex: '#fbcfe8', label: 'Rose' },
  { id: 'purple', hex: '#ddd6fe', label: 'Violet' },
];

const IntentButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  helper?: string;
  onClick: (event: React.MouseEvent) => void;
  active?: boolean;
}> = ({ icon, label, helper, onClick, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex min-h-14 items-center gap-3 rounded-2xl border px-3 text-left transition-all ${active ? 'border-accent-gold/45 bg-accent-gold/14 text-accent-gold' : 'border-border bg-bg-card/45 text-text-secondary hover:border-accent-gold/35 hover:text-text-primary'}`}
  >
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bg-primary/70 text-accent-gold">{icon}</span>
    <span className="min-w-0">
      <span className="block text-sm font-semibold leading-tight">{label}</span>
      {helper && <span className="mt-0.5 block text-[0.68rem] font-medium uppercase tracking-[0.12em] text-text-muted">{helper}</span>}
    </span>
  </button>
);

export const VerseActions: React.FC<VerseActionsProps> = ({ verse, verseId, translation, bookId, onClose }) => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const addNote = useNotesStore((state) => state.addNote);
  const highlights = useHighlightsStore((state) => state.highlights);
  const addHighlight = useHighlightsStore((state) => state.addHighlight);
  const removeHighlight = useHighlightsStore((state) => state.removeHighlight);

  const reference = formatBibleReference(bookId, verse.chapter, verse.verse);
  const isFavorite = favorites.some((favorite) => favorite.id === verseId);
  const currentHighlight = highlights[verseId];
  const textToShare = `« ${verse.text} »\n— ${reference} (${translation.toUpperCase()})`;

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(verseId);
      toast('Retiré des favoris', { icon: '💔' });
    } else {
      addFavorite({ id: verseId, translation, bookId, chapter: verse.chapter, verse: verse.verse, text: verse.text, dateAdded: Date.now() });
      toast.success('Ajouté aux favoris !');
    }
  };

  const handleHighlight = (color: HighlightColor, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentHighlight?.color === color) removeHighlight(verseId);
    else addHighlight(verseId, color);
    setShowColors(false);
  };

  const handleSaveNote = (text: string, tags: string[]) => {
    addNote({ verseId, text, verseText: verse.text, ...(tags.length > 0 ? { tags } : {}) });
    setShowNoteModal(false);
    onClose();
    toast.success('Note enregistrée !');
  };

  const handleCopyImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const blob = await createShareVerseImage({ text: verse.text, reference, translation });
      if (blob) {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        toast.success('Image copiée dans le presse-papier !');
      }
    } catch (err) {
      console.error('Failed to copy image', err);
      await handleCopyText(e);
    }
    setShowShareOptions(false);
  };

  const handleCopyText = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(textToShare);
    toast.success('Texte copié !');
    setShowShareOptions(false);
  };

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`, '_blank');
    setShowShareOptions(false);
  };

  const handleShareTwitter = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}`, '_blank');
    setShowShareOptions(false);
  };

  return (
    <>
      <aside
        className="verse-action-surface fixed inset-x-3 bottom-[6.1rem] z-50 mx-auto max-w-md rounded-[1.8rem] p-3 shadow-[var(--shadow-panel)] lg:sticky lg:top-28 lg:bottom-auto lg:mx-0 lg:max-w-none lg:rounded-[1.55rem] lg:p-4"
        onClick={(event) => event.stopPropagation()}
        aria-label="Panneau d’actions du verset sélectionné"
      >
        <div className="mb-3 flex items-start justify-between gap-3 border-b border-border/70 pb-3">
          <div>
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.2em] text-accent-gold">Verset sélectionné</p>
            <p className="mt-1 font-display text-lg leading-tight text-text-primary">{reference}</p>
          </div>
          <button type="button" aria-label="Fermer les actions" onClick={(e) => { e.stopPropagation(); onClose(); }} className="flex h-10 w-10 items-center justify-center rounded-2xl text-text-muted transition-colors hover:bg-bg-secondary hover:text-text-primary">
            <X size={18} />
          </button>
        </div>

        {showColors ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary"><Palette size={16} className="text-accent-gold" /> Choisir une encre</div>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  type="button"
                  key={color.id}
                  onClick={(e) => handleHighlight(color.id, e)}
                  className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-bg-card/65 text-[0.65rem] font-semibold text-text-secondary transition-transform hover:-translate-y-0.5"
                  aria-label={`Surligner en ${color.label}`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10" style={{ backgroundColor: color.hex }}>
                    {currentHighlight?.color === color.id && <Check size={12} className="text-black/60" />}
                  </span>
                  {color.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); setShowColors(false); }} className="w-full rounded-2xl border border-border px-3 py-2 text-sm font-semibold text-text-secondary hover:text-text-primary">Retour aux actions</button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-text-muted">Garder</p>
              <IntentButton icon={<Heart size={17} className={isFavorite ? 'fill-accent-gold' : ''} />} label={isFavorite ? 'Favori gardé' : 'Ajouter aux favoris'} helper="mémoire" onClick={handleFavorite} active={isFavorite} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <IntentButton icon={<Edit3 size={17} />} label="Écrire une note" helper="annoter" onClick={(e) => { e.stopPropagation(); setShowNoteModal(true); }} />
              <IntentButton icon={<Type size={17} />} label="Marquer" helper="surligner" onClick={(e) => { e.stopPropagation(); setShowColors(true); }} active={Boolean(currentHighlight)} />
            </div>
            <div>
              <IntentButton icon={<Share2 size={17} />} label="Partager" helper="texte ou image" onClick={(e) => { e.stopPropagation(); setShowShareOptions((value) => !value); }} active={showShareOptions} />
              {showShareOptions && (
                <div className="mt-2 grid gap-2 rounded-2xl border border-border bg-bg-primary/60 p-2 sm:grid-cols-2">
                  <button type="button" onClick={handleCopyImage} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-text-secondary hover:bg-bg-card hover:text-text-primary"><BookmarkPlus size={15} /> Image</button>
                  <button type="button" onClick={handleCopyText} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-text-secondary hover:bg-bg-card hover:text-text-primary"><Copy size={15} /> Texte</button>
                  <button type="button" onClick={handleShareWhatsApp} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-accent-sage hover:bg-bg-card"><MessageCircle size={15} /> WhatsApp</button>
                  <button type="button" onClick={handleShareTwitter} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[color:var(--color-info)] hover:bg-bg-card">X / Twitter</button>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
      {showNoteModal && <NoteModal reference={reference} onCancel={() => setShowNoteModal(false)} onSave={handleSaveNote} />}
    </>
  );
};

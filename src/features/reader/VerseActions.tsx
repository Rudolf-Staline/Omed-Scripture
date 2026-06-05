import React, { useState } from 'react';
import { Heart, Edit3, Type, Share2, Check, X } from 'lucide-react';
import type { Verse } from '../../utils/bibleApi';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useHighlightsStore } from '../../store/useHighlightsStore';
import type { HighlightColor } from '../../store/useHighlightsStore';
import { useNotesStore } from '../../store/useNotesStore';
import { formatBibleReference } from '../../utils/bibleBooks';
import { NoteModal } from '../../components/verse-actions/NoteModal';
import { createShareVerseImage } from '../../components/verse-actions/shareVerseImage';
import toast from 'react-hot-toast';

interface VerseActionsProps {
  verse: Verse;
  verseId: string;
  translation: string;
  bookId: string;
  onClose: () => void;
}

const colors: { id: HighlightColor; hex: string }[] = [
  { id: 'yellow', hex: '#fef08a' },
  { id: 'blue', hex: '#bfdbfe' },
  { id: 'green', hex: '#bbf7d0' },
  { id: 'pink', hex: '#fbcfe8' },
  { id: 'purple', hex: '#e9d5ff' },
];

export const VerseActions: React.FC<VerseActionsProps> = ({ verse, verseId, translation, bookId, onClose }) => {
  const [showColors, setShowColors] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const highlights = useHighlightsStore((state) => state.highlights);
  const addHighlight = useHighlightsStore((state) => state.addHighlight);
  const removeHighlight = useHighlightsStore((state) => state.removeHighlight);
  const addNote = useNotesStore((state) => state.addNote);

  const isFavorite = favorites.some((f) => f.id === verseId);
  const currentHighlight = highlights[verseId];
  const reference = formatBibleReference(bookId, verse.chapter, verse.verse);
  const textToShare = `"${verse.text}"\n— ${reference} (${translation.toUpperCase()})`;

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

  const handleSaveNote = (text: string) => {
    addNote({ verseId, text, verseText: verse.text });
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
      <div className="border border-border bg-bg-card/95 shadow-[var(--shadow-panel)] backdrop-blur-xl rounded-2xl px-2 py-1.5 flex items-center gap-1">
        {showColors ? (
          <div className="flex items-center gap-2 px-2">
            {colors.map((c) => (
              <button type="button" key={c.id} onClick={(e) => handleHighlight(c.id, e)} className="w-6 h-6 rounded-full border border-border shadow-sm flex items-center justify-center transition-transform hover:scale-110" style={{ backgroundColor: c.hex }} aria-label={`Surligner en ${c.id}`}>
                {currentHighlight?.color === c.id && <Check size={12} className="text-black/50" />}
              </button>
            ))}
            <button type="button" aria-label="Fermer les couleurs" onClick={(e) => { e.stopPropagation(); setShowColors(false); }} className="p-1 hover:bg-bg-secondary rounded ml-2">
              <X size={16} className="text-text-muted" />
            </button>
          </div>
        ) : (
          <>
            <button type="button" aria-label="Ajouter aux favoris" onClick={handleFavorite} className="p-2 hover:bg-bg-secondary rounded-xl text-text-secondary transition-colors group" title="Favori">
              <Heart size={18} className={isFavorite ? 'fill-accent-gold text-accent-gold' : 'group-hover:text-accent-gold'} />
            </button>
            <button type="button" aria-label="Ajouter une note" onClick={(e) => { e.stopPropagation(); setShowNoteModal(true); }} className="p-2 hover:bg-bg-secondary rounded-xl text-text-secondary transition-colors hover:text-accent-gold" title="Noter">
              <Edit3 size={18} />
            </button>
            <button type="button" aria-label="Surligner" onClick={(e) => { e.stopPropagation(); setShowColors(true); }} className="p-2 hover:bg-bg-secondary rounded-xl text-text-secondary transition-colors hover:text-accent-gold" title="Surligner">
              <Type size={18} />
            </button>
            <div className="relative">
              <button type="button" aria-label="Partager" aria-expanded={showShareOptions} onClick={(e) => { e.stopPropagation(); setShowShareOptions(!showShareOptions); }} className="p-2 hover:bg-bg-secondary rounded-xl text-text-secondary transition-colors hover:text-accent-gold" title="Partager">
                <Share2 size={18} />
              </button>
              {showShareOptions && (
                <div className="absolute bottom-full left-1/2 z-50 mb-2 flex w-52 -translate-x-1/2 flex-col rounded-2xl border border-border bg-bg-card/98 py-2 shadow-[var(--shadow-panel)] backdrop-blur-xl">
                  <button type="button" onClick={handleCopyImage} className="px-4 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary">Copier l'image</button>
                  <button type="button" onClick={handleCopyText} className="px-4 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary">Copier le texte</button>
                  <button type="button" onClick={handleShareWhatsApp} className="px-4 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary text-accent-sage">WhatsApp</button>
                  <button type="button" onClick={handleShareTwitter} className="px-4 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary text-[color:var(--color-info)]">Twitter / X</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {showNoteModal && <NoteModal reference={reference} onCancel={() => setShowNoteModal(false)} onSave={handleSaveNote} />}
    </>
  );
};

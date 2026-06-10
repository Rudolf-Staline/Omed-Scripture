import type { Verse } from '../../types/bible';
import { SCRIPTURE_API_VERSIONS } from '../../data/translations';

export const parseScriptureApiVerses = (content: string): Verse[] => {
  if (!content) return [];
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = content;
    const verses: Verse[] = [];

    const verseElements = div.querySelectorAll('[data-verse-id]');

    verseElements.forEach(el => {
      const verseId = el.getAttribute('data-verse-id') || '';
      const [bookId, chapterStr, verseStr] = verseId.split('.');
      if (bookId && chapterStr && verseStr) {
         const clone = el.cloneNode(true) as HTMLElement;
         const vNum = clone.querySelector('.v');
         if (vNum) vNum.remove();

         verses.push({
           book_id: bookId,
           book_name: bookId,
           chapter: parseInt(chapterStr, 10),
           verse: parseInt(verseStr, 10),
           text: clone.textContent?.trim() || ''
         });
      }
    });

    const mergedVerses: Verse[] = [];
    verses.forEach(v => {
      const last = mergedVerses[mergedVerses.length - 1];
      if (last && last.verse === v.verse) {
        last.text += ' ' + v.text;
      } else {
        mergedVerses.push(v);
      }
    });

    return mergedVerses;
  }
  return [];
};

export const getScriptureApiChapter = async (
  translation: string,
  book: string,
  chapter: number
): Promise<Verse[]> => {
  const bibleId = SCRIPTURE_API_VERSIONS[translation];
  if (!bibleId) throw new Error(`Unsupported API.Bible translation: ${translation}`);

  const chapterId = `${book.toUpperCase()}.${chapter}`;
  const res = await fetch(`/api/bible/chapter?bibleId=${encodeURIComponent(bibleId)}&chapterId=${encodeURIComponent(chapterId)}`);
  if (!res.ok) throw new Error('Failed to fetch chapter from API.Bible');
  const data = await res.json();

  return parseScriptureApiVerses(data.data?.content);
};

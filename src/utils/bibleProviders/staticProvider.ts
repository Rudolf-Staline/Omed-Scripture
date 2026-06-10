import type { Verse } from '../../types/bible';

export const getStaticChapter = async (
  translation: string,
  book: string,
  chapter: number
): Promise<Verse[] | null> => {
  try {
    const bookLower = book.toLowerCase();

    // First, check if the translation index allows this book
    const indexRes = await fetch(`/bibles/${translation}/index.json`);
    if (!indexRes.ok) return null;

    const indexData = await indexRes.json();
    if (!indexData.books.includes(bookLower)) return null;

    // Fetch the specific book file
    const bookRes = await fetch(`/bibles/${translation}/${bookLower}.json`);
    if (!bookRes.ok) return null;

    const bookData = await bookRes.json();

    // Check if the chapter exists in the data
    const chapterData = bookData.chapters[chapter.toString()];
    if (!chapterData || !Array.isArray(chapterData)) return null;

    // Convert to Verse[] format
    return chapterData.map((v: { verse: number; text: string }) => ({
      book_id: bookData.bookId,
      book_name: bookData.bookName,
      chapter: chapter,
      verse: v.verse,
      text: v.text,
    }));
  } catch (error) {
    // Fail silently to trigger fallback
    console.debug(`Static provider failed for ${translation} ${book} ${chapter}`, error);
    return null;
  }
};

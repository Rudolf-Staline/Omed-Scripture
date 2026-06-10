export interface Verse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface SearchResult {
  reference: string;
  text: string;
  translation_id: string;
  book_id: string;
  chapter_id: string;
}

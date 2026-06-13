import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const requireString = (value, label) => {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${label} must be a non-empty string`);
};
const requirePositiveInteger = (value, label) => {
  if (!Number.isInteger(value) || value < 1) throw new Error(`${label} must be a positive integer`);
};
const readJson = async (relative) => JSON.parse(await readFile(path.join(root, relative), 'utf8'));

const catalog = await readJson('public/bibles/catalog.json');
if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.translations)) throw new Error('Invalid public/bibles/catalog.json');

for (const translation of catalog.translations) {
  requireString(translation.id, 'translation.id');
  requireString(translation.name, `${translation.id}.name`);
  if (!['static', 'partial', 'api-only'].includes(translation.availability)) throw new Error(`${translation.id}.availability is invalid`);
  if (translation.availability === 'api-only') continue;
  requireString(translation.indexPath, `${translation.id}.indexPath`);
  const indexRelative = `public${translation.indexPath}`;
  const index = await readJson(indexRelative);
  if (index.translationId !== translation.id || !Array.isArray(index.books)) throw new Error(`Invalid index for ${translation.id}`);
  for (const book of index.books) {
    requireString(book.id, `${translation.id}.book.id`);
    requireString(book.path, `${translation.id}.${book.id}.path`);
    requirePositiveInteger(book.chapterCount, `${translation.id}.${book.id}.chapterCount`);
    const file = await readJson(`public${book.path}`);
    if (file.translationId !== translation.id || file.bookId !== book.id || !Array.isArray(file.chapters)) throw new Error(`Invalid book file ${book.path}`);
    for (const chapter of file.chapters) {
      requirePositiveInteger(chapter.chapter, `${book.id}.chapter`);
      if (!Array.isArray(chapter.verses) || chapter.verses.length === 0) throw new Error(`${book.id}.${chapter.chapter}.verses invalid`);
      for (const verse of chapter.verses) {
        requirePositiveInteger(verse.verse, `${book.id}.${chapter.chapter}.verse`);
        requireString(verse.text, `${book.id}.${chapter.chapter}.${verse.verse}.text`);
      }
    }
  }
  if (translation.searchIndexPath) await access(path.join(root, 'public', translation.searchIndexPath));
}
console.log('Bible data validation passed.');

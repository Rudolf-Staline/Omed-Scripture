import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

async function buildForTranslation(translationId) {
  const indexPath = path.join(root, 'public', 'bibles', translationId, 'index.json');
  const index = JSON.parse(await readFile(indexPath, 'utf8'));
  const entries = [];
  for (const book of index.books ?? []) {
    const bookFile = JSON.parse(await readFile(path.join(root, 'public', book.path), 'utf8'));
    for (const chapter of bookFile.chapters ?? []) {
      for (const verse of chapter.verses ?? []) {
        entries.push({
          bookId: bookFile.bookId,
          chapter: chapter.chapter,
          verse: verse.verse,
          reference: `${book.name} ${chapter.chapter}:${verse.verse}`,
          text: verse.text,
          normalizedText: normalize(verse.text),
        });
      }
    }
  }
  await writeFile(path.join(root, 'public', 'bibles', translationId, 'search-index.json'), `${JSON.stringify(entries, null, 2)}\n`);
  console.log(`Built ${entries.length} search entries for ${translationId}.`);
}

const catalog = JSON.parse(await readFile(path.join(root, 'public', 'bibles', 'catalog.json'), 'utf8'));
for (const translation of catalog.translations ?? []) {
  if ((translation.availability === 'static' || translation.availability === 'partial') && translation.indexPath) {
    await buildForTranslation(translation.id);
  }
}

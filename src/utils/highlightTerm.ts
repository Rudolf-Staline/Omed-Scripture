export interface TextSegment {
  text: string;
  match: boolean;
}

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Découpe un texte en segments pour surligner les occurrences d'un terme,
// sans tenir compte de la casse. Retourne un seul segment si le terme est vide.
export const splitByTerm = (text: string, term: string): TextSegment[] => {
  const cleaned = term.trim();
  if (!cleaned) return [{ text, match: false }];

  const pattern = new RegExp(`(${escapeRegExp(cleaned)})`, 'gi');
  return text
    .split(pattern)
    .filter((part) => part.length > 0)
    .map((part) => ({ text: part, match: part.toLowerCase() === cleaned.toLowerCase() }));
};

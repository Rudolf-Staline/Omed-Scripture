// Transforme une saisie libre "grâce, Prière, grâce" en liste de tags
// normalisés (minuscules, sans doublons, sans entrées vides).
export const parseTagsInput = (value: string): string[] =>
  Array.from(
    new Set(
      value
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
    )
  );

export const formatTagsInput = (tags: string[] | undefined): string => (tags ?? []).join(', ');

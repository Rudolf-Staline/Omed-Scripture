export interface TopicReference {
  bookId: string;
  chapter: number;
  verse?: number;
  label: string;
}

export interface Topic {
  id: string;
  label: string;
  /** Description courte et originale du thème. */
  description: string;
  /** Requête envoyée au moteur de recherche existant. */
  query: string;
  /** Passages suggérés (liens /read valides). */
  references?: TopicReference[];
  /** Plans de lecture liés (ids présents dans READING_PLANS). */
  planIds?: string[];
}

// Thèmes bibliques pour la page Découvrir. Données locales, originales.
export const TOPICS: Topic[] = [
  {
    id: 'foi', label: 'Foi', description: 'Faire confiance même sans tout voir.', query: 'foi',
    references: [
      { bookId: 'hébreux', chapter: 11, label: 'Hébreux 11' },
      { bookId: 'romains', chapter: 10, label: 'Romains 10' },
    ],
    planIds: ['essential-14'],
  },
  {
    id: 'paix', label: 'Paix', description: 'Apaiser le cœur agité.', query: 'paix',
    references: [
      { bookId: 'philippiens', chapter: 4, verse: 7, label: 'Philippiens 4:7' },
      { bookId: 'jean', chapter: 14, label: 'Jean 14' },
    ],
    planIds: ['psalms-trust-7'],
  },
  {
    id: 'priere', label: 'Prière', description: 'Apprendre à parler à Dieu.', query: 'prière',
    references: [
      { bookId: 'matthieu', chapter: 6, label: 'Matthieu 6' },
      { bookId: 'psaumes', chapter: 145, label: 'Psaume 145' },
    ],
  },
  {
    id: 'amour', label: 'Amour', description: 'Aimer Dieu et son prochain.', query: 'amour',
    references: [
      { bookId: 'romains', chapter: 12, label: 'Romains 12' },
      { bookId: 'jean', chapter: 15, label: 'Jean 15' },
    ],
    planIds: ['john-21'],
  },
  {
    id: 'courage', label: 'Courage', description: 'Avancer malgré la peur.', query: 'courage',
    references: [
      { bookId: 'josué', chapter: 1, label: 'Josué 1' },
      { bookId: 'ésaïe', chapter: 41, verse: 10, label: 'Ésaïe 41:10' },
    ],
  },
  {
    id: 'sagesse', label: 'Sagesse', description: 'Discerner et bien vivre.', query: 'sagesse',
    references: [
      { bookId: 'proverbes', chapter: 3, label: 'Proverbes 3' },
      { bookId: 'jacques', chapter: 1, label: 'Jacques 1' },
    ],
  },
  {
    id: 'esperance', label: 'Espérance', description: "Garder les yeux levés.", query: 'espérance',
    references: [
      { bookId: 'romains', chapter: 8, label: 'Romains 8' },
      { bookId: 'ésaïe', chapter: 40, label: 'Ésaïe 40' },
    ],
  },
  {
    id: 'pardon', label: 'Pardon', description: 'Recevoir et offrir la grâce.', query: 'pardon',
    references: [
      { bookId: 'matthieu', chapter: 18, label: 'Matthieu 18' },
      { bookId: 'colossiens', chapter: 3, label: 'Colossiens 3' },
    ],
  },
  {
    id: 'famille', label: 'Famille', description: 'Aimer sous le même toit.', query: 'famille',
    references: [
      { bookId: 'éphésiens', chapter: 5, label: 'Éphésiens 5' },
      { bookId: 'proverbes', chapter: 22, label: 'Proverbes 22' },
    ],
  },
  {
    id: 'travail', label: 'Travail', description: 'Servir avec cœur au quotidien.', query: 'travail',
    references: [
      { bookId: 'colossiens', chapter: 3, label: 'Colossiens 3' },
      { bookId: 'proverbes', chapter: 16, label: 'Proverbes 16' },
    ],
  },
  {
    id: 'peur', label: 'Peur', description: 'Déposer ce qui inquiète.', query: 'crainte',
    references: [
      { bookId: 'psaumes', chapter: 91, label: 'Psaume 91' },
      { bookId: 'ésaïe', chapter: 43, label: 'Ésaïe 43' },
    ],
  },
  {
    id: 'gratitude', label: 'Gratitude', description: 'Reconnaître la bonté reçue.', query: 'reconnaissance',
    references: [
      { bookId: 'psaumes', chapter: 100, label: 'Psaume 100' },
      { bookId: 'philippiens', chapter: 4, label: 'Philippiens 4' },
    ],
  },
];

export const getTopicById = (id: string): Topic | undefined =>
  TOPICS.find((topic) => topic.id === id);

export interface DailyReading {
  id: string;
  /** Identifiant de livre compatible avec BIBLE_BOOKS / les routes /read. */
  bookId: string;
  chapter: number;
  /** Référence lisible affichée à l'utilisateur. */
  reference: string;
  /** Résumé court et original de l'invitation de lecture. */
  summary: string;
}

// Lectures courtes recommandées, déterministes par date (sans API externe).
// Chaque `bookId` correspond à un identifiant présent dans BIBLE_BOOKS afin de
// garantir un lien /read valide. Les résumés sont des formulations originales.
export const DAILY_READINGS: DailyReading[] = [
  { id: 'reading-ps23', bookId: 'psaumes', chapter: 23, reference: 'Psaume 23', summary: "Le berger qui conduit, restaure et accompagne." },
  { id: 'reading-jean1', bookId: 'jean', chapter: 1, reference: 'Jean 1', summary: "La Parole faite chair, la lumière qui vient à nous." },
  { id: 'reading-phil4', bookId: 'philippiens', chapter: 4, reference: 'Philippiens 4', summary: "La paix qui garde le cœur et la joie en toute circonstance." },
  { id: 'reading-rom8', bookId: 'romains', chapter: 8, reference: 'Romains 8', summary: "Rien ne peut nous séparer de l'amour de Dieu." },
  { id: 'reading-mt5', bookId: 'matthieu', chapter: 5, reference: 'Matthieu 5', summary: "Les béatitudes : le bonheur vu autrement." },
  { id: 'reading-pr3', bookId: 'proverbes', chapter: 3, reference: 'Proverbes 3', summary: "Se confier de tout son cœur plutôt qu'en sa propre intelligence." },
  { id: 'reading-esaie40', bookId: 'ésaïe', chapter: 40, reference: 'Ésaïe 40', summary: "Ceux qui espèrent renouvellent leur force." },
  { id: 'reading-jacques1', bookId: 'jacques', chapter: 1, reference: 'Jacques 1', summary: "L'épreuve, la persévérance et la sagesse demandée à Dieu." },
  { id: 'reading-ps91', bookId: 'psaumes', chapter: 91, reference: 'Psaume 91', summary: "À l'abri du Très-Haut, sous sa protection." },
  { id: 'reading-luc15', bookId: 'luc', chapter: 15, reference: 'Luc 15', summary: "Le retour attendu : la joie d'être retrouvé." },
  { id: 'reading-1cor13', bookId: 'romains', chapter: 12, reference: 'Romains 12', summary: "Un amour sincère et une vie offerte au quotidien." },
  { id: 'reading-ps121', bookId: 'psaumes', chapter: 121, reference: 'Psaume 121', summary: "Mon secours vient de l'Éternel qui ne sommeille pas." },
  { id: 'reading-jean15', bookId: 'jean', chapter: 15, reference: 'Jean 15', summary: "Demeurer attaché à la vraie vigne pour porter du fruit." },
  { id: 'reading-hebreux11', bookId: 'hébreux', chapter: 11, reference: 'Hébreux 11', summary: "La foi de ceux qui ont marché en faisant confiance." },
];

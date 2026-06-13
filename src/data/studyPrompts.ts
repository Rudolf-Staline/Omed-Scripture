// Aides d'étude LOCALES et ORIGINALES.
//
// Important (licence) : ce sont de courtes questions ouvertes rédigées pour Omed
// Scripture. Aucun commentaire biblique tiers protégé, aucun contenu devotional
// copié, aucune doctrine controversée imposée. Les questions guident l'étude
// personnelle (Observation / Interprétation / Application / Prière) ; rien n'est
// inséré automatiquement — l'utilisateur s'en inspire s'il le souhaite.

export interface StudyPromptReference {
  bookId: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
}

export interface StudyPrompt {
  id: string;
  reference: StudyPromptReference;
  title: string;
  prompts: {
    observation: string[];
    interpretation: string[];
    application: string[];
    prayer: string[];
  };
  tags: string[];
}

const GENERIC = {
  observation: ['Que dit le texte, simplement ?', 'Quels mots ou répétitions reviennent ?'],
  interpretation: ['Que signifie ce passage dans son contexte ?', 'Que révèle-t-il sur Dieu ?'],
  application: ['Qu’est-ce que cela change pour aujourd’hui ?', 'Un pas concret à faire ?'],
  prayer: ['Comment répondre à Dieu à partir de ce texte ?'],
};

export const STUDY_PROMPTS: StudyPrompt[] = [
  {
    id: 'jean-3',
    reference: { bookId: 'jean', chapter: 3 },
    title: 'La nouvelle naissance',
    prompts: {
      observation: ['Qui parle à qui, et de quoi ?', 'Quelle image Jésus utilise-t-il pour la nouvelle naissance ?'],
      interpretation: ['Que veut dire « naître de nouveau » ici ?', 'Quel est le lien entre l’amour de Dieu et le don du Fils ?'],
      application: ['Où ai-je besoin d’un regard renouvelé ?', 'Comment recevoir ce don aujourd’hui ?'],
      prayer: ['Remercier pour l’amour donné en Jean 3:16.'],
    },
    tags: ['évangile', 'grâce', 'fondations'],
  },
  {
    id: 'psaumes-23',
    reference: { bookId: 'psaumes', chapter: 23 },
    title: 'Le berger',
    prompts: {
      observation: ['Quelles actions le berger accomplit-il ?', 'Quels lieux sont décrits ?'],
      interpretation: ['Que dit ce psaume sur la présence de Dieu dans l’épreuve ?'],
      application: ['Dans quelle « vallée » ai-je besoin de me souvenir de cette présence ?'],
      prayer: ['Confier une inquiétude au berger.'],
    },
    tags: ['confiance', 'paix', 'psaumes'],
  },
  {
    id: 'matthieu-6',
    reference: { bookId: 'matthieu', chapter: 6, verseStart: 9, verseEnd: 13 },
    title: 'La prière du Seigneur',
    prompts: {
      observation: ['Quelles demandes composent cette prière ?', 'Dans quel ordre viennent-elles ?'],
      interpretation: ['Que nous apprend l’ordre des demandes sur les priorités ?'],
      application: ['Quelle demande puis-je faire mienne aujourd’hui ?'],
      prayer: ['Prier lentement cette prière, phrase par phrase.'],
    },
    tags: ['prière', 'enseignement'],
  },
  {
    id: 'romains-8',
    reference: { bookId: 'romains', chapter: 8 },
    title: 'Rien ne peut nous séparer',
    prompts: {
      observation: ['Quelles assurances sont données au croyant ?', 'Quels obstacles sont mentionnés ?'],
      interpretation: ['Sur quoi repose cette assurance ?'],
      application: ['Quelle crainte puis-je relire à la lumière de ce texte ?'],
      prayer: ['Remercier pour une espérance qui tient.'],
    },
    tags: ['espérance', 'assurance'],
  },
  {
    id: 'philippiens-4',
    reference: { bookId: 'philippiens', chapter: 4 },
    title: 'La paix qui garde le cœur',
    prompts: {
      observation: ['Quelle est l’alternative à l’inquiétude proposée ?', 'Que faut-il « penser » d’après le texte ?'],
      interpretation: ['Comment la prière et la paix sont-elles reliées ?'],
      application: ['Quelle inquiétude déposer dans la prière aujourd’hui ?'],
      prayer: ['Présenter une demande avec actions de grâce.'],
    },
    tags: ['paix', 'prière', 'gratitude'],
  },
];

const matchesReference = (ref: StudyPromptReference, bookId: string, chapter: number): boolean =>
  ref.bookId === bookId && ref.chapter === chapter;

export const getStudyPromptsForReference = (bookId: string, chapter: number): StudyPrompt[] =>
  STUDY_PROMPTS.filter((prompt) => matchesReference(prompt.reference, bookId, chapter));

// Toujours fournir des questions, même sans entrée dédiée (fallback générique).
export const getStudyPromptOrGeneric = (bookId: string, chapter: number): StudyPrompt['prompts'] => {
  const dedicated = getStudyPromptsForReference(bookId, chapter)[0];
  return dedicated ? dedicated.prompts : GENERIC;
};

export interface DailyVerse {
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
}

// Les textes ci-dessous sont la Louis Segond 1910 (domaine public). Le verset
// du jour est donc toujours rattaché à cette traduction, indépendamment de la
// traduction de lecture par défaut de l'utilisateur.
export const DAILY_VERSE_TRANSLATION = 'lsg';

// Sélection locale de versets (Louis Segond 1910, domaine public).
// Le verset du jour est choisi de façon déterministe par date, sans API externe.
export const DAILY_VERSES: DailyVerse[] = [
  {
    bookId: 'jean',
    chapter: 3,
    verse: 16,
    text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
  },
  {
    bookId: 'psaumes',
    chapter: 23,
    verse: 1,
    text: "L'Éternel est mon berger: je ne manquerai de rien.",
  },
  {
    bookId: 'ésaïe',
    chapter: 41,
    verse: 10,
    text: "Ne crains rien, car je suis avec toi; ne promène pas des regards inquiets, car je suis ton Dieu; je te fortifie, je viens à ton secours, je te soutiens de ma droite triomphante.",
  },
  {
    bookId: 'philippiens',
    chapter: 4,
    verse: 13,
    text: 'Je puis tout par celui qui me fortifie.',
  },
  {
    bookId: 'proverbes',
    chapter: 3,
    verse: 5,
    text: "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse.",
  },
  {
    bookId: 'romains',
    chapter: 8,
    verse: 28,
    text: 'Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.',
  },
  {
    bookId: 'matthieu',
    chapter: 11,
    verse: 28,
    text: 'Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos.',
  },
  {
    bookId: 'josué',
    chapter: 1,
    verse: 9,
    text: "Ne t'ai-je pas donné cet ordre: Fortifie-toi et prends courage? Ne t'effraie point et ne t'épouvante point, car l'Éternel, ton Dieu, est avec toi dans tout ce que tu entreprendras.",
  },
  {
    bookId: 'lamentations',
    chapter: 3,
    verse: 23,
    text: 'Elles se renouvellent chaque matin. Oh! que ta fidélité est grande!',
  },
  {
    bookId: 'jean',
    chapter: 14,
    verse: 6,
    text: 'Jésus lui dit: Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi.',
  },
  {
    bookId: 'jean',
    chapter: 8,
    verse: 12,
    text: 'Jésus leur parla de nouveau, et dit: Je suis la lumière du monde; celui qui me suit ne marchera pas dans les ténèbres, mais il aura la lumière de la vie.',
  },
  {
    bookId: 'romains',
    chapter: 12,
    verse: 2,
    text: "Ne vous conformez pas au siècle présent, mais soyez transformés par le renouvellement de l'intelligence, afin que vous discerniez quelle est la volonté de Dieu, ce qui est bon, agréable et parfait.",
  },
  {
    bookId: 'galates',
    chapter: 2,
    verse: 20,
    text: "J'ai été crucifié avec Christ; et si je vis, ce n'est plus moi qui vis, c'est Christ qui vit en moi; si je vis maintenant dans la chair, je vis dans la foi au Fils de Dieu, qui m'a aimé et qui s'est livré lui-même pour moi.",
  },
  {
    bookId: 'éphésiens',
    chapter: 2,
    verse: 8,
    text: "Car c'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c'est le don de Dieu.",
  },
  {
    bookId: 'philippiens',
    chapter: 4,
    verse: 6,
    text: "Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces.",
  },
  {
    bookId: 'philippiens',
    chapter: 4,
    verse: 7,
    text: 'Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ.',
  },
  {
    bookId: '1 pierre',
    chapter: 5,
    verse: 7,
    text: 'Et déchargez-vous sur lui de tous vos soucis, car lui-même prend soin de vous.',
  },
  {
    bookId: 'matthieu',
    chapter: 6,
    verse: 33,
    text: 'Cherchez premièrement le royaume et la justice de Dieu; et toutes ces choses vous seront données par-dessus.',
  },
  {
    bookId: 'psaumes',
    chapter: 119,
    verse: 105,
    text: 'Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.',
  },
  {
    bookId: 'jean',
    chapter: 1,
    verse: 1,
    text: 'Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu.',
  },
  {
    bookId: '2 timothée',
    chapter: 1,
    verse: 7,
    text: "Car ce n'est pas un esprit de timidité que Dieu nous a donné, mais un esprit de force, d'amour et de sagesse.",
  },
  {
    bookId: 'hébreux',
    chapter: 11,
    verse: 1,
    text: "Or la foi est une ferme assurance des choses qu'on espère, une démonstration de celles qu'on ne voit pas.",
  },
  {
    bookId: 'jacques',
    chapter: 1,
    verse: 5,
    text: "Si quelqu'un d'entre vous manque de sagesse, qu'il la demande à Dieu, qui donne à tous simplement et sans reproche, et elle lui sera donnée.",
  },
  {
    bookId: '1 jean',
    chapter: 4,
    verse: 19,
    text: "Pour nous, nous l'aimons, parce qu'il nous a aimés le premier.",
  },
  {
    bookId: 'romains',
    chapter: 5,
    verse: 8,
    text: 'Mais Dieu prouve son amour envers nous, en ce que, lorsque nous étions encore des pécheurs, Christ est mort pour nous.',
  },
  {
    bookId: 'ésaïe',
    chapter: 40,
    verse: 31,
    text: "Mais ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; ils courent, et ne se lassent point; ils marchent, et ne se fatiguent point.",
  },
  {
    bookId: 'psaumes',
    chapter: 27,
    verse: 1,
    text: "L'Éternel est ma lumière et mon salut: de qui aurais-je crainte? L'Éternel est le soutien de ma vie: de qui aurais-je peur?",
  },
  {
    bookId: 'colossiens',
    chapter: 3,
    verse: 23,
    text: 'Tout ce que vous faites, faites-le de bon cœur, comme pour le Seigneur et non pour des hommes.',
  },
  {
    bookId: 'psaumes',
    chapter: 121,
    verse: 2,
    text: "Le secours me vient de l'Éternel, qui a fait les cieux et la terre.",
  },
  {
    bookId: 'jean',
    chapter: 15,
    verse: 5,
    text: 'Je suis le cep, vous êtes les sarments. Celui qui demeure en moi et en qui je demeure porte beaucoup de fruit, car sans moi vous ne pouvez rien faire.',
  },
  {
    bookId: 'michée',
    chapter: 6,
    verse: 8,
    text: "On t'a fait connaître, ô homme, ce qui est bien; et ce que l'Éternel demande de toi, c'est que tu pratiques la justice, que tu aimes la miséricorde, et que tu marches humblement avec ton Dieu.",
  },
  {
    bookId: 'romains',
    chapter: 15,
    verse: 13,
    text: "Que le Dieu de l'espérance vous remplisse de toute joie et de toute paix dans la foi, pour que vous abondiez en espérance, par la puissance du Saint-Esprit!",
  },
];

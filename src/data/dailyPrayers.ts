export interface DailyPrayer {
  id: string;
  /** Thème court affiché en étiquette. */
  focus: string;
  /** Titre lisible de la prière guidée. */
  title: string;
  /** Texte de la prière guidée (français, original, sans source propriétaire). */
  prompt: string;
}

// Prières guidées locales, déterministes par date (sans API externe).
// Textes originaux rédigés pour Omed Scripture (aucune source propriétaire).
export const DAILY_PRAYERS: DailyPrayer[] = [
  {
    id: 'prayer-confiance',
    focus: 'Confiance',
    title: 'Remettre ma journée',
    prompt:
      "Seigneur, je te confie cette journée avant qu'elle ne commence vraiment. Apaise mes inquiétudes, ordonne mes priorités et garde mon cœur en paix. Que je marche aujourd'hui en comptant sur toi plutôt que sur mes seules forces.",
  },
  {
    id: 'prayer-gratitude',
    focus: 'Gratitude',
    title: 'Un cœur reconnaissant',
    prompt:
      "Merci pour le souffle de ce matin, pour les visages que j'aime et pour les petites grâces que je remarque à peine. Apprends-moi à reconnaître ta bonté dans l'ordinaire et à dire merci avant de demander.",
  },
  {
    id: 'prayer-paix',
    focus: 'Paix',
    title: 'Déposer mes soucis',
    prompt:
      "Dieu de paix, je dépose devant toi ce qui pèse sur moi. Tu connais mes craintes mieux que moi-même. Remplace mon agitation par ta tranquillité et donne-moi de me reposer en ta présence.",
  },
  {
    id: 'prayer-sagesse',
    focus: 'Sagesse',
    title: 'Discerner mes pas',
    prompt:
      "Père, j'ai besoin de sagesse pour les décisions qui m'attendent. Éclaire ce qui est confus, ralentis ce qui est précipité et donne-moi le courage de choisir le bien même quand c'est coûteux.",
  },
  {
    id: 'prayer-pardon',
    focus: 'Pardon',
    title: 'Recevoir et offrir',
    prompt:
      "Seigneur, je reconnais mes manquements sans me cacher. Pardonne-moi et libère-moi de la culpabilité. Donne-moi aussi un cœur capable de pardonner à ceux qui m'ont blessé, comme tu me pardonnes.",
  },
  {
    id: 'prayer-courage',
    focus: 'Courage',
    title: 'Avancer sans peur',
    prompt:
      "Tu es avec moi, je n'ai donc pas à reculer devant ce qui m'effraie. Fortifie mes mains pour la tâche du jour, affermis ma voix pour la vérité et conduis-moi un pas après l'autre.",
  },
  {
    id: 'prayer-amour',
    focus: 'Amour',
    title: 'Aimer concrètement',
    prompt:
      "Apprends-moi à aimer aujourd'hui de façon concrète : un mot patient, une écoute réelle, un geste qui relève. Que ceux que je croiserai repartent un peu plus aimés à cause de toi en moi.",
  },
  {
    id: 'prayer-intercession',
    focus: 'Intercession',
    title: 'Porter les autres',
    prompt:
      "Je te présente ceux qui me sont chers et ceux qui traversent l'épreuve. Visite les malades, console les affligés, relève les découragés. Là où je ne peux rien, agis selon ta puissance.",
  },
  {
    id: 'prayer-esperance',
    focus: 'Espérance',
    title: 'Garder les yeux levés',
    prompt:
      "Quand l'avenir semble incertain, rappelle-moi que tu écris une histoire plus grande que la mienne. Ravive mon espérance, garde mes yeux levés et soutiens-moi jusqu'au soir.",
  },
  {
    id: 'prayer-humilite',
    focus: 'Humilité',
    title: 'Servir simplement',
    prompt:
      "Garde-moi de l'orgueil et de la comparaison. Donne-moi un cœur de serviteur, content de faire le bien sans être vu, et reconnaissant pour la place que tu m'as confiée.",
  },
  {
    id: 'prayer-perseverance',
    focus: 'Persévérance',
    title: 'Tenir bon',
    prompt:
      "Là où je suis fatigué de bien faire, redonne-moi de la constance. Que je ne lâche pas ce que tu m'as confié, et que je trouve en toi la force de continuer aujourd'hui.",
  },
  {
    id: 'prayer-presence',
    focus: 'Présence',
    title: 'Demeurer avec toi',
    prompt:
      "Avant l'agitation, je m'arrête pour t'écouter. Calme mon esprit, ouvre mon attention et apprends-moi à rester conscient de ta présence au milieu de tout ce que je ferai.",
  },
  {
    id: 'prayer-famille',
    focus: 'Famille',
    title: 'Bénir les miens',
    prompt:
      "Veille sur ma famille et sur mon foyer. Donne-nous de la patience les uns envers les autres, du pardon quand nous échouons et de la joie partagée. Sois l'hôte de notre maison aujourd'hui.",
  },
  {
    id: 'prayer-soir',
    focus: 'Repos',
    title: 'Relire ma journée',
    prompt:
      "Avant de me reposer, je relis cette journée avec toi : ce qui fut beau, ce qui fut difficile, ce que je te confie pour demain. Merci pour ta fidélité, accorde-moi un sommeil paisible.",
  },
];

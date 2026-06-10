export const FEATURED_TRANSLATIONS = [
  { id: 'lsg', name: 'Louis Segond 1910', language: 'fr', short: 'LSG', source: 'bolls' },
  { id: 'darby', name: 'Darby (Français)', language: 'fr', short: 'DBY', source: 'bolls' },
  { id: 'kjv', name: 'King James Version', language: 'en', short: 'KJV', source: 'bible-api' },
  { id: 'web', name: 'World English Bible', language: 'en', short: 'WEB', source: 'bible-api' },
  { id: 'bbe', name: 'Bible in Basic English', language: 'en', short: 'BBE', source: 'bible-api' },
];

// Versions utilisant bolls.life (French translations — reliable, CORS enabled)
export const BOLLS_VERSIONS: Record<string, string> = {
  lsg: 'FRLSG',    // Bible Segond 1910
  darby: 'FRDBY',  // Darby (French) 1890
};

// Versions utilisant bible-api.com (English translations only)
export const BIBLE_API_VERSIONS = ['kjv', 'web', 'bbe'];

// Versions utilisant API.Bible via la route serverless /api/bible/chapter
export const SCRIPTURE_API_VERSIONS: Record<string, string> = {
  niv: '06125adad2d5898a-01', // NIV
  esv: 'f421fe261da7624f-01', // ESV
  nlt: '65eec8e0b60e656b-01', // NLT
};

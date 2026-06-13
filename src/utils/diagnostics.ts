import type { Theme } from '../store/useSettingsStore';

export const APP_VERSION = '0.1.0-beta';

export interface DiagnosticsInput {
  userAgent?: string;
  online?: boolean;
  route?: string;
  theme?: Theme | string;
  syncEnabled?: boolean;
  date?: Date;
}

export interface DiagnosticsSnapshot {
  app: 'Omed Scripture';
  version: string;
  userAgent: string;
  online: boolean;
  route: string;
  theme: string;
  syncEnabled: boolean;
  generatedAt: string;
}

export const SENSITIVE_DIAGNOSTIC_TERMS = [
  'note',
  'notes',
  'prayer',
  'prayers',
  'favorites',
  'highlights',
  'collections',
  'memoryVerses',
  'token',
  'email',
  'name',
  'picture',
  'verseText',
  'content',
] as const;

export const createDiagnosticsSnapshot = (input: DiagnosticsInput = {}): DiagnosticsSnapshot => {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  const loc = typeof window !== 'undefined' ? window.location : undefined;

  return {
    app: 'Omed Scripture',
    version: APP_VERSION,
    userAgent: input.userAgent ?? nav?.userAgent ?? 'unknown',
    online: input.online ?? nav?.onLine ?? false,
    route: input.route ?? `${loc?.pathname ?? '/'}${loc?.search ?? ''}`,
    theme: String(input.theme ?? 'unknown'),
    syncEnabled: Boolean(input.syncEnabled),
    generatedAt: (input.date ?? new Date()).toISOString(),
  };
};

export const formatDiagnostics = (snapshot: DiagnosticsSnapshot): string => [
  'Omed Scripture diagnostic',
  `version: ${snapshot.version}`,
  `generatedAt: ${snapshot.generatedAt}`,
  `route: ${snapshot.route}`,
  `online: ${snapshot.online ? 'yes' : 'no'}`,
  `theme: ${snapshot.theme}`,
  `syncEnabled: ${snapshot.syncEnabled ? 'yes' : 'no'}`,
  `userAgent: ${snapshot.userAgent}`,
].join('\n');

export const createDiagnosticsText = (input: DiagnosticsInput = {}): string =>
  formatDiagnostics(createDiagnosticsSnapshot(input));

export const diagnosticsContainSensitiveTerms = (text: string): boolean => {
  const normalized = text.toLowerCase();
  return SENSITIVE_DIAGNOSTIC_TERMS.some((term) => normalized.includes(term.toLowerCase()));
};

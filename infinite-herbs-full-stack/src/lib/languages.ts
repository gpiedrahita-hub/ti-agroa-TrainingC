export const LANGS = [
    { locale: 'es', label: 'Español', short: 'ES' },
    { locale: 'en', label: 'English', short: 'EN' }
] as const;

export const LAGUAGES: string[] = LANGS.map( lang => lang.label)



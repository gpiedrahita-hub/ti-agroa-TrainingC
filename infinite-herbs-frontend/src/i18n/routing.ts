import { defineRouting } from "next-intl/routing";

export const LANGS = [
  { locale: 'es', label: 'Español', short: 'ES' },
  { locale: 'en', label: 'English', short: 'EN' }
] as const;

export const LANGUAGES: string[] = LANGS.map( lang => lang.label)

export const routing = defineRouting({
    locales: LANGUAGES,
    defaultLocale: 'es',
    localePrefix: 'always'
})
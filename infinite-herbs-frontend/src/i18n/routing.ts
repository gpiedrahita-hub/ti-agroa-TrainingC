import { defineRouting } from 'next-intl/routing';

export const LANGS = [
  {locale: 'es' , label: 'Español' , short: 'ES'} ,
  {locale: 'en' , label: 'English' , short: 'EN'}
] as const;

export const LOCALES: string[] = LANGS.map(lang => lang.locale);

export const routing = defineRouting({
  locales: LOCALES ,
  defaultLocale: 'es' ,
  localePrefix: 'always'
});
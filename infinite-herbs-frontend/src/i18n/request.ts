// import { cookies } from 'next/headers';
// import { getRequestConfig } from 'next-intl/server';
// import { routing } from './routing';
//
// export default getRequestConfig(async () => {
//   const store = await cookies();
//   const locale = store.get('NEXT_LOCALE')?.value || routing.defaultLocale;
//
//   return {
//     locale ,
//     messages: (await import(`./locales/${locale}.json`)).default
//   };
// });


import { getRequestConfig } from 'next-intl/server';
import { routing  } from '@/i18n/routing';

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`./locales/${locale}.json`)).default;

  return {
    locale: locale as string,
    messages
  };
});
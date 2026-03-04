import { NavbarWrapper } from '@/components/layout/navbar/navbar-wrapper';
import { AuthProvider } from '@/components/providers/auth-provider';
import { SidebarProvider } from '@/components/providers/sidebar-provider';
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider } from 'next-intl';
import { Footer } from '@/components/layout/footer/footer';
import { notFound } from 'next/navigation';
import React from 'react';

async function getMessages(locale: string) {
  try {
    return (await import(`@/i18n/locales/${locale}.json`)).default;
  } catch {
    notFound();
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
                                             children ,
                                             params
                                           }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
      <NextIntlClientProvider messages={messages} locale={locale}>
        <AuthProvider>
          <SidebarProvider>
            <NavbarWrapper/>
            <div className="overflow-hidden">
              {children}
            </div>
            <Footer/>
          </SidebarProvider>
        </AuthProvider>
      </NextIntlClientProvider>
  );
}
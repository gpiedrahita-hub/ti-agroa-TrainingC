import Navbar from "@/components/layout/navbar/navbar";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NextIntlClientProvider>
            <AuthProvider>
                <SidebarProvider>
                    <Navbar/>
                    {children}
                </SidebarProvider>
            </AuthProvider>
        </NextIntlClientProvider>
    );
}
import Navbar from "@/components/layout/navbar/navbar";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { NextIntlClientProvider } from "next-intl";

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
import Navbar from "@/components/layout/navbar/navbar";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { NextIntlClientProvider } from "next-intl";

export default async function LocaleLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NextIntlClientProvider>
            <SidebarProvider>
                <Navbar/>
                {children}
            </SidebarProvider>
        </NextIntlClientProvider>
    );
}
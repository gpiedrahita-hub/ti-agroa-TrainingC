import React from "react";
import Sidebar from "@/components/layout/sidebar/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        redirect(`/${locale}/login`);
    }

    return (
        <div className="min-h-dvh bg-background">
            <Sidebar />
            <main className="md:pl-72">
                <div>{children}</div>
            </main>
        </div>
    );
}

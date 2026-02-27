import React from "react";
import Sidebar from "@/components/layout/sidebar/sidebar";

export default function DashboardLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-dvh bg-background">
            <Sidebar />
            <main className="md:pl-72">
                <div>{children}</div>
            </main>
        </div>
    )
}

import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Dashboard | Harmonie",
    description: "Votre espace patient Harmonie",
};

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Protection côté serveur - vérification de la session
    const session = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    return <>{children}</>;
}

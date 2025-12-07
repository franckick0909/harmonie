import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Connexion | Harmonie",
    description: "Connectez-vous à votre espace patient Harmonie",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}

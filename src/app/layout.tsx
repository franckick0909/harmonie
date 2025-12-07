import type { Metadata } from "next";
import { DM_Sans, Cormorant } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Police sans-serif moderne et géométrique (similaire à Aeonik/Fragment)
const dmSans = DM_Sans({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"]
});

// Police serif élégante pour les titres (similaire à celle de Saisei)
const cormorant = Cormorant({ 
  subsets: ["latin"], 
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"]
});

export const metadata: Metadata = {
  title: "Harmonie | Cabinet Infirmier",
  description: "Soins infirmiers à domicile et au cabinet. Une équipe dévouée à votre santé et votre bien-être.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={cn(
        dmSans.variable, 
        cormorant.variable, 
        "font-sans antialiased bg-[#0a0a0a] text-white selection:bg-[#c8ff00] selection:text-black"
      )}>
        {children}
      </body>
    </html>
  );
}

"use client";

import { linkUserToPatientByEmail } from "@/actions/linkPatient";
import Header from "@/components/layout/Header";
import { SlideMobileMenu } from "@/components/ui/SlideMobileMenu";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { signOut } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, FileText, Home, LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface PatientLayoutProps {
  children: React.ReactNode;
}

function PatientLayoutContent({ children }: PatientLayoutProps) {
  const { isMobileMenuOpen, toggleMobileMenu } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const hasLinkedRef = useRef(false);

  // Lier automatiquement l'utilisateur à sa fiche patient
  useEffect(() => {
    if (!hasLinkedRef.current) {
      hasLinkedRef.current = true;
      linkUserToPatientByEmail().catch(console.error);
    }
  }, []);

  const menuItems = [
    {
      id: "accueil",
      label: "Accueil",
      href: "/patient",
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: "rendez-vous",
      label: "Mes rendez-vous",
      href: "/patient/rendez-vous",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: "demandes",
      label: "Mes demandes",
      href: "/patient/demandes",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: "profil",
      label: "Mon profil",
      href: "/patient/profil",
      icon: <User className="w-5 h-5" />,
    },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <>
      <div className="min-h-screen bg-[#F9F7F2]">
        <Header />
        <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-12 py-8 pt-24 md:pt-28">
        {/* Header */}
        <header className="fixed top-28 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#d5ccc0]/30">
          <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-12">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo */}
              <Link href="/patient" className="flex items-center gap-3">
                <span className="text-xs text-[#927950] uppercase tracking-wider hidden sm:inline">
                  Espace Patient
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                        isActive
                          ? "bg-[#927950]/10 text-[#927950]"
                          : "text-[#6b6b6b] hover:text-[#1E211E] hover:bg-[#F4E6CD]/50"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-[#6b6b6b] hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>

                {/* Mobile menu button */}
                <button
                  type="button"
                  title="Ouvrir le menu"
                  aria-label="Ouvrir le menu"
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-lg text-[#1E211E] hover:bg-[#F4E6CD]/50 transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
                </div>
              </div>
            </header>
          </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={toggleMobileMenu}
                className="fixed inset-0 bg-black z-40 md:hidden"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl md:hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-serif text-xl text-[#1E211E]">
                      Menu
                    </span>
                    <button
                      onClick={toggleMobileMenu}
                      className="p-2 rounded-lg hover:bg-[#F4E6CD]/50 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <nav className="space-y-2">
                    {menuItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={toggleMobileMenu}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                            isActive
                              ? "bg-[#927950]/10 text-[#927950]"
                              : "text-[#6b6b6b] hover:text-[#1E211E] hover:bg-[#F4E6CD]/50"
                          }`}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="mt-8 pt-8 border-t border-[#d5ccc0]/30">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl w-full transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="w-full px-2 sm:px-4 lg:px-6 xl:px-12 py-8 pt-24 md:pt-28">
          {children}
        </main>
      </div>

      {/* SlideMobileMenu (pour le menu global si nécessaire) */}
      <SlideMobileMenu isOpen={false} onClose={() => {}} />
    </>
  );
}

export default function PatientLayout({ children }: PatientLayoutProps) {
  return (
    <SidebarProvider>
      <PatientLayoutContent>{children}</PatientLayoutContent>
    </SidebarProvider>
  );
}

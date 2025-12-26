"use client";

import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { SlideMobileMenu } from "@/components/ui/SlideMobileMenu";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { signOut } from "@/lib/auth-client";
import type { DashboardStats } from "@/types/demande";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats?: Partial<DashboardStats>;
}

function DashboardContent({
  children,
  activeTab,
  onTabChange,
  stats,
}: DashboardLayoutProps) {
  const { isMobileMenuOpen, toggleMobileMenu } = useSidebar();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <>
      <div className="flex h-screen bg-[#F4E6CD] text-[#1E211E]">
        {/* Sidebar - Desktop */}
        <div className="hidden md:block">
          <DashboardSidebar
            activeTab={activeTab}
            onTabChange={onTabChange}
            stats={stats}
          />
        </div>

        {/* Contenu principal */}
        <main className="flex-1 overflow-auto relative">
          <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-12 py-8 pt-24 md:pt-28">
            {children}
          </div>
        </main>
      </div>

      {/* Bouton Menu Mobile - visible uniquement sur mobile quand le menu est fermé */}
      <AnimatePresence>
        {!isMobileMenuOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Ouvrir le menu"
            className="fixed top-6 left-4 z-[100] md:hidden flex items-center justify-center gap-2 bg-[#1E211E] text-[#F4E6CD] hover:bg-[#927950] px-4 py-2.5 rounded-full shadow-lg transition-all duration-300"
          >
            <Menu className="w-5 h-5" />
            <span className="text-sm font-medium">Menu</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* SlideMobileMenu avec les onglets du dashboard */}
      <SlideMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        isDashboard={true}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onLogout={handleLogout}
      />
    </>
  );
}

export function DashboardLayout({
  children,
  activeTab,
  onTabChange,
  stats,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardContent
        activeTab={activeTab}
        onTabChange={onTabChange}
        stats={stats}
      >
        {children}
      </DashboardContent>
    </SidebarProvider>
  );
}

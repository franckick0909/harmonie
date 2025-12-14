"use client";

import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { SlideMobileMenu } from "@/components/ui/SlideMobileMenu";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import type { DashboardStats } from "@/types/demande";
import { AnimatePresence, motion } from "framer-motion";

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

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={toggleMobileMenu}
                className="fixed inset-0 bg-black z-400 md:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full z-500 md:hidden"
              >
                <DashboardSidebar
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    onTabChange(tab);
                    toggleMobileMenu();
                  }}
                  stats={stats}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Contenu principal */}
        <main className="flex-1 overflow-auto relative">
          <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-12 py-8 pt-24 md:pt-28">
            {children}
          </div>
        </main>
      </div>

      {/* Bouton Menu - visible sur tous les supports quand le menu est fermé */}
      {!isMobileMenuOpen && (
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label="Ouvrir le menu"
          className="fixed top-6 right-2 sm:right-4 lg:right-6 xl:right-12 z-200 group flex font-serif uppercase text-sm lg:text-base font-normal tracking-wide transition-all duration-500 items-center justify-center text-[#1E211E] hover:text-white hover:bg-[#927950] w-auto px-4 py-2 overflow-hidden rounded-full border border-[#927950]"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key="menu"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{
                y: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 0.3 },
              }}
            >
              Menu
            </motion.span>
          </AnimatePresence>
        </button>
      )}

      {/* SlideMobileMenu avec animations GSAP */}
      <SlideMobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />

      {/* Bouton Fermer flottant - visible sur tous les supports quand le menu est ouvert */}
      {isMobileMenuOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          type="button"
          onClick={toggleMobileMenu}
          aria-label="Fermer le menu"
          className="fixed top-6 right-8 z-[99999] group flex font-serif uppercase text-sm lg:text-base font-normal tracking-wide transition-all duration-500 items-center justify-center backdrop-blur-md text-white overflow-hidden hover:bg-[#EDDEC5] hover:text-[#1E211E] px-4 py-2 rounded-full border border-[#EDDEC5]"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key="fermer"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{
                y: { duration: 0.3, delay: 0.3, ease: "easeOut" },
                opacity: { duration: 0.5 },
              }}
            >
              Fermer
            </motion.span>
          </AnimatePresence>
        </motion.button>
      )}
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

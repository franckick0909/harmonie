"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Bell, Calendar, Crown, Home, LogOut, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { MenuLink } from "./AnimatedLink";

interface SlideMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  // Props optionnelles pour le mode dashboard
  isDashboard?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
}

// Liens de navigation du site
const siteLinks = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Équipe", href: "/#team" },
  { label: "Contact", href: "/#contact" },
];

// Onglets du dashboard
const dashboardTabs = [
  {
    id: "overview",
    label: "Vue d'ensemble",
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: "patients",
    label: "Patients",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "planning",
    label: "Planning",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="w-5 h-5" />,
  },
];

export function SlideMobileMenu({
  isOpen,
  onClose,
  isDashboard = false,
  activeTab,
  onTabChange,
  onLogout,
}: SlideMobileMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      // Timeline d'ouverture
      tl.current = gsap
        .timeline({ paused: true })
        .to(menuRef.current, {
          x: 0,
          duration: 0.8,
          ease: "power3.inOut",
        })
        .fromTo(
          ".menu-link-item",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .fromTo(
          ".dashboard-tab-item",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .fromTo(
          ".auth-link-item",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .fromTo(
          ".menu-footer",
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.2"
        );
    },
    { scope: menuRef }
  );

  // Gérer l'ouverture/fermeture
  useGSAP(() => {
    if (isOpen) {
      tl.current?.play();
      document.body.style.overflow = "hidden";
    } else {
      tl.current?.reverse();
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9000] transition-opacity duration-500 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Menu Sidebar */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 h-screen w-full md:w-[500px] bg-[#927950] text-white z-[9500] shadow-2xl overflow-y-auto translate-x-full flex flex-col"
      >
        <div className="p-8 md:p-12 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-serif font-thin text-[#EDDEC5] uppercase tracking-widest">
              {isDashboard ? "Dashboard" : "Navigation"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Fermer le menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Onglets Dashboard (si en mode dashboard) */}
          {isDashboard && onTabChange && (
            <div className="mb-8 pb-8 border-b border-white/20">
              <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4">
                Gestion
              </h3>
              <div className="space-y-2">
                {dashboardTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`dashboard-tab-item opacity-0 w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? "bg-white text-[#927950]"
                        : "hover:bg-white/10 text-white"
                    }`}
                  >
                    {tab.icon}
                    <span className="text-lg font-medium">{tab.label}</span>
                  </button>
                ))}
                {/* Lien Administration */}
                <Link
                  href="/dashboard/admin"
                  onClick={onClose}
                  className="dashboard-tab-item opacity-0 w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:bg-white/10 text-white"
                >
                  <Crown className="w-5 h-5" />
                  <span className="text-lg font-medium">Administration</span>
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Links du site */}
          <nav className="flex-1 flex flex-col justify-center space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-2">
              {isDashboard ? "Navigation" : "Menu"}
            </h3>
            {siteLinks.map((link) => (
              <div key={link.href} className="menu-link-item opacity-0">
                <MenuLink
                  href={link.href}
                  onClick={onClose}
                  className={`text-2xl md:text-3xl font-serif ${
                    pathname === link.href
                      ? "text-[#EDDEC5] italic"
                      : "text-white"
                  }`}
                >
                  {link.label}
                </MenuLink>
              </div>
            ))}

            {/* Actions */}
            <div className="pt-8 space-y-3">
              {isDashboard ? (
                <>
                  <div className="auth-link-item opacity-0">
                    <Link
                      href="/patient"
                      onClick={onClose}
                      className="text-lg uppercase tracking-widest text-white/80 hover:text-[#EDDEC5] transition-colors font-light"
                    >
                      Espace Patient
                    </Link>
                  </div>
                  {onLogout && (
                    <div className="auth-link-item opacity-0">
                      <button
                        type="button"
                        onClick={() => {
                          onLogout();
                          onClose();
                        }}
                        className="flex items-center gap-2 text-lg uppercase tracking-widest text-red-300 hover:text-red-200 transition-colors font-light"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="auth-link-item opacity-0">
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="text-lg uppercase tracking-widest text-white/80 hover:text-[#EDDEC5] transition-colors font-light"
                    >
                      Connexion
                    </Link>
                  </div>
                  <div className="auth-link-item opacity-0">
                    <Link
                      href="/demande/soins"
                      onClick={onClose}
                      className="inline-block px-6 py-3 bg-white text-[#927950] rounded-full font-medium hover:bg-[#EDDEC5] transition-colors"
                    >
                      Prendre rendez-vous
                    </Link>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-8 border-t border-white/10 menu-footer opacity-0">
            <p className="text-xs text-white/30 font-light">
              © 2025 Cabinet Harmonie - Soins Infirmiers
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

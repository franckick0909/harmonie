"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { MenuLink } from "./AnimatedLink";

interface SlideMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Vue d'ensemble", href: "/dashboard" },
  { label: "Patients", href: "/dashboard/patients" },
  { label: "Planning", href: "/dashboard/planning" },
  { label: "Demandes", href: "/dashboard/demandes" },
];

const accountLinks = [{ label: "Mon Compte", href: "/dashboard/account" }];

export function SlideMobileMenu({ isOpen, onClose }: SlideMobileMenuProps) {
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
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-sm font-serif font-thin text-[#EDDEC5] uppercase tracking-widest">
              Navigation
            </h2>
            {/* Bouton Fermer retiré car géré par DashboardLayout */}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center space-y-4">
            {navLinks.map((link) => (
              <div key={link.href} className="menu-link-item opacity-0">
                <MenuLink
                  href={link.href}
                  onClick={onClose}
                  className={`text-3xl md:text-4xl font-serif ${
                    pathname === link.href
                      ? "text-[#EDDEC5] italic"
                      : "text-white"
                  }`}
                >
                  {link.label}
                </MenuLink>
              </div>
            ))}

            {/* Auth Links */}
            <div className="pt-8 space-y-2">
              {accountLinks.map((link) => (
                <div key={link.href} className="auth-link-item opacity-0">
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="text-lg uppercase tracking-widest text-white/80 hover:text-[#EDDEC5] transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-8 border-t border-white/10 menu-footer opacity-0">
            <p className="text-xs text-white/30 font-light">
              © 2025 Harmonie Santé
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

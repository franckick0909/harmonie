"use client";

import {
  authClient,
  getUserRoleFromSession,
  isStaffFromSession,
} from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(CustomEase, useGSAP);

CustomEase.create("menuEase", "0.625, 0.05, 0, 1");

// Navigation principale
const navLinks = [
  { number: "1", name: "Accueil", href: "/" },
  { number: "2", name: "Le Cabinet", href: "/#about" },
  { number: "3", name: "Services", href: "/#services" },
  { number: "4", name: "L'Équipe", href: "/#team" },
  { number: "5", name: "Infos Pratiques", href: "/#informations" },
  { number: "6", name: "Contact", href: "/#contact" },
];

// Composant NavLink avec animation style Saisei (border animé)
function NavLink({
  link,
  onLinkClick,
}: {
  link: { number: string; name: string; href: string };
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  return (
    <motion.div
      className="nav-link relative cursor-pointer -mx-8 md:-mx-12 px-8 md:px-12"
      initial="idle"
      whileHover="hover"
    >
      {/* Background hover effect */}
      <motion.div
        className="absolute inset-0 bg-[#927950]/20 pointer-events-none origin-bottom"
        variants={{
          idle: { scaleY: 0 },
          hover: { scaleY: 1 },
        }}
        transition={{ duration: 0.6, ease: [0.625, 0.05, 0, 1] }}
      />

      {/* Border bottom animé */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#927950] pointer-events-none origin-left"
        variants={{
          idle: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
        transition={{ duration: 0.7, ease: [0.625, 0.05, 0, 1] }}
      />

      {/* Séparateur statique */}
      <div className="nav-link-border absolute bottom-0 left-0 right-0 h-px bg-[#1E211E]/10 pointer-events-none" />

      <div className="relative block py-5 md:py-6">
        <div className="overflow-hidden">
          <motion.div className="nav-link-inner flex items-center justify-between">
            <Link
              href={link.href}
              onClick={(e) => onLinkClick(e, link.href)}
              className="flex-1"
            >
              <motion.div
                className="flex items-baseline gap-3 md:gap-4"
                variants={{
                  idle: { x: 0 },
                  hover: { x: 20 },
                }}
                transition={{ duration: 0.4, ease: [0.625, 0.05, 0, 1] }}
              >
                <motion.span
                  className="text-[10px] font-medium"
                  variants={{
                    idle: { color: "#1E211E", opacity: 0.4 },
                    hover: { color: "#927950", opacity: 1 },
                  }}
                >
                  ({link.number})
                </motion.span>
                <span className="text-2xl md:text-3xl lg:text-4xl font-serif tracking-tight uppercase text-[#1E211E]">
                  {link.name}
                </span>
              </motion.div>
            </Link>

            {/* Flèche */}
            <motion.svg
              className="w-5 h-5 md:w-8 md:h-8"
              viewBox="0 0 24 24"
              fill="#927950"
              variants={{
                idle: { x: -20, opacity: 0 },
                hover: { x: 0, opacity: 1 },
              }}
              transition={{ duration: 0.4, ease: [0.625, 0.05, 0, 1] }}
            >
              <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
            </motion.svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEspaceMenuOpen, setIsEspaceMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const espaceMenuRef = useRef<HTMLDivElement>(null);
  const espaceMenuContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const espaceTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const router = useRouter();

  // Session
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;
  const userRole = getUserRoleFromSession(session);
  const isStaff = isStaffFromSession(session);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body overflow
  useEffect(() => {
    document.body.style.overflow =
      isMenuOpen || isEspaceMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isEspaceMenuOpen]);

  // Menu principal animations
  useGSAP(
    () => {
      if (!menuRef.current || !menuContentRef.current || !overlayRef.current)
        return;

      if (timelineRef.current) timelineRef.current.kill();

      const linkTexts =
        menuContentRef.current.querySelectorAll(".nav-link-inner");
      const linkBorders =
        menuContentRef.current.querySelectorAll(".nav-link-border");
      const footerItems =
        menuContentRef.current.querySelectorAll(".menu-footer-item");

      if (isMenuOpen) {
        gsap.set(menuRef.current, { display: "block", xPercent: 100 });
        gsap.set(overlayRef.current, { display: "block", opacity: 0 });
        gsap.set(linkTexts, { yPercent: 100 });
        gsap.set(linkBorders, { scaleX: 0 });
        gsap.set(footerItems, { y: 30, opacity: 0 });

        const tl = gsap.timeline();
        timelineRef.current = tl;

        tl.to(overlayRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: "menuEase",
        });
        tl.to(
          menuRef.current,
          { xPercent: 0, duration: 1.2, ease: "menuEase" },
          "-=0.3"
        );
        tl.to(
          linkTexts,
          { yPercent: 0, duration: 0.8, stagger: 0.06, ease: "menuEase" },
          "-=0.6"
        );
        tl.to(
          linkBorders,
          { scaleX: 1, duration: 0.6, stagger: 0.08, ease: "menuEase" },
          "-=0.7"
        );
        tl.to(
          footerItems,
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: "menuEase" },
          "-=0.4"
        );
      } else {
        const menuDisplay = window.getComputedStyle(menuRef.current).display;
        if (menuDisplay === "none") return;

        const tl = gsap.timeline();
        timelineRef.current = tl;

        tl.to(linkBorders, {
          scaleX: 0,
          duration: 0.3,
          stagger: 0.02,
          ease: "menuEase",
        });
        tl.to(
          linkTexts,
          { yPercent: -100, duration: 0.4, stagger: 0.03, ease: "menuEase" },
          "-=0.2"
        );
        tl.to(
          footerItems,
          {
            y: -20,
            opacity: 0,
            duration: 0.3,
            stagger: 0.02,
            ease: "menuEase",
          },
          "-=0.25"
        );
        tl.to(
          menuRef.current,
          { xPercent: 100, duration: 1, ease: "menuEase" },
          "-=0.15"
        );
        tl.to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.4,
            ease: "menuEase",
            onComplete: () => {
              gsap.set(menuRef.current, { display: "none" });
              gsap.set(overlayRef.current, { display: "none" });
            },
          },
          "-=0.5"
        );
      }
    },
    { dependencies: [isMenuOpen] }
  );

  // Menu Espace animations
  useGSAP(
    () => {
      if (!espaceMenuRef.current || !espaceMenuContentRef.current) return;

      if (espaceTimelineRef.current) espaceTimelineRef.current.kill();

      const items =
        espaceMenuContentRef.current.querySelectorAll(".espace-item");

      if (isEspaceMenuOpen) {
        gsap.set(espaceMenuRef.current, { display: "block", xPercent: 100 });
        gsap.set(items, { y: 30, opacity: 0 });

        const tl = gsap.timeline();
        espaceTimelineRef.current = tl;

        tl.to(espaceMenuRef.current, {
          xPercent: 0,
          duration: 1,
          ease: "menuEase",
        });
        tl.to(
          items,
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: "menuEase" },
          "-=0.5"
        );
      } else {
        const menuDisplay = window.getComputedStyle(
          espaceMenuRef.current
        ).display;
        if (menuDisplay === "none") return;

        const tl = gsap.timeline();
        espaceTimelineRef.current = tl;

        tl.to(items, {
          y: -20,
          opacity: 0,
          duration: 0.3,
          stagger: 0.02,
          ease: "menuEase",
        });
        tl.to(
          espaceMenuRef.current,
          {
            xPercent: 100,
            duration: 0.8,
            ease: "menuEase",
            onComplete: () => {
              gsap.set(espaceMenuRef.current, { display: "none" });
            },
          },
          "-=0.1"
        );
      }
    },
    { dependencies: [isEspaceMenuOpen] }
  );

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Gestion des ancres sur la page d'accueil (ex: /#services)
    if (href.startsWith("/#")) {
      e.preventDefault();
      setIsMenuOpen(false);
      const anchor = href.substring(1); // Enlève le "/" pour obtenir "#services"

      // Si on est déjà sur la page d'accueil, on scroll directement
      if (window.location.pathname === "/") {
        setTimeout(() => {
          const target = document.querySelector(anchor);
          if (target)
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 700);
      } else {
        // Sinon on navigue vers la page d'accueil avec l'ancre
        router.push(href);
      }
    } else if (href.startsWith("#")) {
      e.preventDefault();
      setIsMenuOpen(false);
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target)
          target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 700);
    } else {
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    setIsEspaceMenuOpen(false);
    await authClient.signOut();
    router.push("/");
  };

  const openEspaceMenu = () => {
    setIsMenuOpen(false);
    setTimeout(() => setIsEspaceMenuOpen(true), 300);
  };

  return (
    <>
      {/* Header */}
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          isScrolled
            ? "bg-[#F4E6CD]/30 backdrop-blur-md py-3 md:py-4 border-b border-[#1E211E]/5"
            : "bg-transparent py-4 sm:py-6 md:py-8"
        )}
      >
        <div className="flex items-center justify-between px-2 sm:px-4 lg:px-6 xl:px-12 w-full">
          {/* Logo */}
          <Link href="/" className="relative z-50 group">
            <span className="text-[8px] sm:text-[10px] font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase block mb-0.5 sm:mb-1 text-[#927950]">
              Cabinet Infirmier
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-serif tracking-tight text-[#1E211E]">
              Harmonie
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bouton RDV */}
            <Link
              href="/demande/soins"
              className="hidden md:inline-flex relative group overflow-hidden rounded-full px-8 py-3 bg-[#F4E6CD] border border-[#927950] hover:border-[#1E211E] hover:bg-[#1E211E] transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-[#1E211E]  translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
              <span className="relative z-10 flex items-center gap-3 text-xs font-normal tracking-[0.15em] uppercase text-[#1E211E] group-hover:text-[#F9F7F2] transition-colors duration-500">
                <span>Prendre RDV</span>
                <span className="w-2 h-2 rounded-full bg-[#1E211E] group-hover:bg-[#ddbb84] transition-colors duration-500" />
              </span>
            </Link>

            {/* Menu Button */}
            <button
              aria-label="Menu"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "relative z-60 flex items-center group",
                // Mobile: petit bouton carré, Desktop: avec texte
                "p-3 md:px-5 md:py-2.5 md:gap-4",
                "rounded-full",
                "font-medium text-xs uppercase tracking-[0.15em]",
                "transition-all duration-500",
                "border",
                isMenuOpen
                  ? "bg-[#1E211E] text-[#F4E6CD] border-[#1E211E]"
                  : isScrolled
                  ? "bg-[#EDDEC5] text-[#1E211E] border-[#1E211E]/20 hover:border-[#927950] hover:text-[#927950]"
                  : "bg-[#EDDEC5] text-[#1E211E] border-[#927950] hover:border-[#1E211E] hover:text-[#1E211E]"
              )}
            >
              {/* Texte Menu/Fermer - caché sur mobile */}
              <span className="hidden md:block relative overflow-hidden h-5 w-14">
                <span
                  className={cn(
                    "absolute inset-0 flex items-center transition-transform duration-500",
                    isMenuOpen ? "-translate-y-full" : "translate-y-0"
                  )}
                >
                  Menu
                </span>
                <span
                  className={cn(
                    "absolute inset-0 flex items-center transition-transform duration-500",
                    isMenuOpen ? "translate-y-0" : "translate-y-full"
                  )}
                >
                  Fermer
                </span>
              </span>

              {/* Hamburger Icon */}
              <div className="relative w-6 h-2 md:w-6 flex flex-col justify-between">
                <span
                  className={cn(
                    "block h-px w-full transition-all duration-500 origin-center",
                    isMenuOpen
                      ? "bg-[#F4E6CD] rotate-45 translate-y-[3.5px] w-5 md:w-5"
                      : "bg-current"
                  )}
                />
                <span
                  className={cn(
                    "block h-px w-full transition-all duration-500 origin-center",
                    isMenuOpen
                      ? "bg-[#F4E6CD] -rotate-45 -translate-y-[3.5px] w-5 md:w-5"
                      : "bg-current"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[45] bg-[#1E211E]/70 backdrop-blur-sm cursor-pointer"
        style={{ display: "none" }}
        onClick={() => {
          setIsMenuOpen(false);
          setIsEspaceMenuOpen(false);
        }}
      />

      {/* Menu Principal - 50% */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 h-full w-full md:w-[50%] z-[46] bg-[#F4E6CD]"
        style={{ display: "none" }}
      >
        <div
          ref={menuContentRef}
          className="h-full flex flex-col px-8 md:px-12 pt-28 pb-8 overflow-y-auto"
        >
          {/* Top Auth Links */}
          <div className="pb-6 border-b border-[#1E211E]/10 mb-6">
            {isLoggedIn ? (
              <button
                type="button"
                aria-label="Mon Espace"
                onClick={openEspaceMenu}
                className="menu-footer-item w-full flex items-center justify-between py-3 px-4 rounded-lg bg-[#927950]/10 hover:bg-[#927950]/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#927950]/30 flex items-center justify-center">
                    <span className="text-sm font-medium text-[#927950]">
                      {session?.user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[#1E211E]">
                    Mon Espace
                  </span>
                </div>
                <svg
                  className="w-4 h-4 text-[#927950]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="menu-footer-item flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-[#1E211E]/20 text-[#1E211E] hover:border-[#927950] hover:text-[#927950] transition-colors text-sm font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="menu-footer-item flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#927950] text-[#F4E6CD] hover:bg-[#7a6442] transition-colors text-sm font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Main Navigation */}
          <nav className="space-y-0 flex-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                link={link}
                onLinkClick={handleLinkClick}
              />
            ))}
          </nav>

          {/* Footer Info */}
          <div className="pt-6 border-t border-[#1E211E]/10 mt-auto space-y-4">
            {/* Contact Grid */}
            <div className="menu-footer-item grid grid-cols-2 gap-4">
              <a
                href="mailto:cabinet.rfm24@orange.fr"
                className="group p-3 rounded-lg bg-[#1E211E]/5 hover:bg-[#927950]/10 transition-colors"
              >
                <h4 className="text-[9px] font-medium tracking-[0.1em] uppercase text-[#1E211E]/40 mb-1">
                  Email
                </h4>
                <span className="text-[#1E211E] group-hover:text-[#927950] transition-colors text-xs sm:text-sm break-all">
                  cabinet.rfm24@orange.fr
                </span>
              </a>
              <a
                href="tel:+33553560456"
                className="group p-3 rounded-lg bg-[#1E211E]/5 hover:bg-[#927950]/10 transition-colors"
              >
                <h4 className="text-[9px] font-medium tracking-[0.1em] uppercase text-[#1E211E]/40 mb-1">
                  Téléphone
                </h4>
                <span className="text-[#1E211E] group-hover:text-[#927950] transition-colors text-xs sm:text-sm">
                  05 53 56 04 56
                </span>
              </a>
            </div>

            {/* Adresse + Social */}
            <div className="menu-footer-item flex items-end justify-between gap-4">
              <div className="p-3 rounded-lg bg-[#1E211E]/5 flex-1">
                <h4 className="text-[9px] font-medium tracking-[0.1em] uppercase text-[#1E211E]/40 mb-1">
                  Adresse
                </h4>
                <p className="text-[#1E211E] text-xs sm:text-sm">
                  MSP Nontron, 24300 Dordogne
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href="#"
                  aria-label="Instagram"
                  title="Instagram"
                  className="menu-footer-item w-10 h-10 rounded-full border border-[#1E211E]/20 flex items-center justify-center text-[#1E211E] hover:bg-[#927950] hover:border-[#927950] hover:text-[#F4E6CD] transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  title="Facebook"
                  className="menu-footer-item w-10 h-10 rounded-full border border-[#1E211E]/20 flex items-center justify-center text-[#1E211E] hover:bg-[#927950] hover:border-[#927950] hover:text-[#F4E6CD] transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Espace (Patient + Infirmières) - 50% */}
      <div
        ref={espaceMenuRef}
        className="fixed top-0 right-0 h-full w-full md:w-[50%] z-[47] bg-[#2C3E2D]"
        style={{ display: "none" }}
      >
        <div
          ref={espaceMenuContentRef}
          className="h-full flex flex-col px-8 md:px-12 pt-28 pb-8 overflow-y-auto"
        >
          {/* Header avec bouton retour */}
          <div className="espace-item flex items-center justify-between pb-6 border-b border-white/10 mb-8">
            <button
              onClick={() => {
                setIsEspaceMenuOpen(false);
                setTimeout(() => setIsMenuOpen(true), 300);
              }}
              className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Retour
            </button>
            <button
              onClick={() => setIsEspaceMenuOpen(false)}
              className="text-white/60 hover:text-white transition-colors text-xs uppercase tracking-widest"
            >
              Fermer
            </button>
          </div>

          {/* User info */}
          {isLoggedIn && (
            <div className="espace-item flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
              <div className="w-12 h-12 rounded-full bg-[#927950]/30 flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {session?.user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <span className="text-white block">{session?.user?.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#927950]">
                  {userRole === "ADMIN"
                    ? "Administrateur"
                    : userRole === "NURSE"
                    ? "Infirmier(e)"
                    : "Patient"}
                </span>
              </div>
            </div>
          )}

          {/* Espace Patient */}
          <div className="mb-8">
            <h3 className="espace-item text-[10px] font-medium tracking-[0.2em] uppercase text-white/40 mb-4">
              Espace Patient
            </h3>
            <div className="space-y-3">
              <Link
                href="/patient"
                onClick={() => setIsEspaceMenuOpen(false)}
                className="espace-item block text-xl font-serif text-white/80 hover:text-[#F4E6CD] transition-colors"
              >
                Mon Tableau de Bord
              </Link>
              <Link
                href="/patient/demandes"
                onClick={() => setIsEspaceMenuOpen(false)}
                className="espace-item block text-lg text-white/60 hover:text-[#F4E6CD] transition-colors"
              >
                Mes Demandes
              </Link>
              <Link
                href="/patient/profil"
                onClick={() => setIsEspaceMenuOpen(false)}
                className="espace-item block text-lg text-white/60 hover:text-[#F4E6CD] transition-colors"
              >
                Mon Profil
              </Link>
            </div>
          </div>

          {/* Espace Infirmières (visible si staff) */}
          {isStaff && (
            <div className="mb-8">
              <h3 className="espace-item text-[10px] font-medium tracking-[0.2em] uppercase text-white/40 mb-4">
                Espace Infirmières
              </h3>
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  onClick={() => setIsEspaceMenuOpen(false)}
                  className="espace-item block text-xl font-serif text-white/80 hover:text-[#F4E6CD] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsEspaceMenuOpen(false)}
                  className="espace-item block text-lg text-white/60 hover:text-[#F4E6CD] transition-colors"
                >
                  Planning
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsEspaceMenuOpen(false)}
                  className="espace-item block text-lg text-white/60 hover:text-[#F4E6CD] transition-colors"
                >
                  Patients
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsEspaceMenuOpen(false)}
                  className="espace-item block text-lg text-white/60 hover:text-[#F4E6CD] transition-colors"
                >
                  Notifications
                </Link>
                {userRole === "ADMIN" && (
                  <Link
                    href="/dashboard/admin"
                    onClick={() => setIsEspaceMenuOpen(false)}
                    className="espace-item block text-lg text-[#927950] hover:text-[#F4E6CD] transition-colors"
                  >
                    Administration
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Déconnexion */}
          <div className="espace-item mt-auto pt-6 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

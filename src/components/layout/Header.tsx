"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(CustomEase, useGSAP);

// Custom ease similaire à Saisei
CustomEase.create("menuEase", "0.625, 0.05, 0, 1");

// Structure de navigation réorganisée
const mainNavLinks = [
    { number: "1", name: "Accueil", href: "#hero" },
];

// Liens du dropdown "Pages" (sections landing page)
const pagesDropdownLinks = [
    { number: "2", name: "À propos", href: "#about" },
    { number: "3", name: "Services", href: "#services" },
    { number: "4", name: "Informations", href: "#informations" },
    { number: "5", name: "Équipe", href: "#team" },
];

// Liens directs après le dropdown
const directLinks = [
    { number: "6", name: "Contact", href: "#contact" },
    { number: "7", name: "Soins", href: "/soins" },
    { number: "8", name: "Dashboard", href: "/dashboard" },
];

const socialLinks = [
    { name: "Ig", href: "#" },
    { name: "Fb", href: "#" },
    { name: "Li", href: "#" },
];

// Composant NavLink avec animation Framer Motion
function NavLink({ 
    link, 
    onLinkClick
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
                className="absolute inset-0 bg-[var(--accent)]/30 pointer-events-none origin-bottom"
                variants={{
                    idle: { scaleY: 0 },
                    hover: { scaleY: 1 }
                }}
                transition={{ duration: 0.6, ease: [0.625, 0.05, 0, 1] }}
            />
            
            {/* Border bottom avec animation */}
            <motion.div 
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)] pointer-events-none origin-left"
                variants={{
                    idle: { scaleX: 0 },
                    hover: { scaleX: 1 }
                }}
                transition={{ duration: 0.7, ease: [0.625, 0.05, 0, 1] }}
            />
            
            {/* Séparateur statique */}
            <div className="nav-link-border absolute bottom-0 left-0 right-0 h-px bg-[var(--foreground)]/20 pointer-events-none origin-left" />

            <div className="relative block py-5 md:py-6">
                <div className="overflow-hidden">
                    <motion.div 
                        className="nav-link-inner flex items-center justify-between"
                        variants={{
                            idle: { color: "var(--foreground)" },
                            hover: { color: "var(--foreground)" }
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link
                            href={link.href}
                            onClick={(e) => onLinkClick(e, link.href)}
                            className="flex-1"
                        >
                            <motion.div 
                                className="flex items-baseline gap-3 md:gap-4"
                                variants={{
                                    idle: { x: 0 },
                                    hover: { x: 20 }
                                }}
                                transition={{ duration: 0.4, ease: [0.625, 0.05, 0, 1] }}
                            >
                                <motion.span 
                                    className="text-[10px] font-medium"
                                    variants={{
                                        idle: { color: "var(--foreground)", opacity: 0.4 },
                                        hover: { color: "var(--accent)", opacity: 1 }
                                    }}
                                >
                                    ({link.number})
                                </motion.span>
                                <span className="text-2xl md:text-3xl lg:text-4xl font-serif tracking-tight uppercase">
                                    {link.name}
                                </span>
                            </motion.div>
                        </Link>
                        
                        {/* Flèche */}
                        <motion.svg 
                            className="w-5 h-5 md:w-8 md:h-8"
                            viewBox="0 0 24 24" 
                            fill="var(--accent)"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            variants={{
                                idle: { x: -20, opacity: 0 },
                                hover: { x: 0, opacity: 1}
                            }}
                            transition={{ duration: 0.4, ease: [0.625, 0.05, 0, 1] }}
                        >
                            <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                        </motion.svg>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

// Composant Dropdown "Pages" avec sous-menu au hover
function PagesDropdown({ 
    onLinkClick 
}: { 
    onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            className="nav-link relative -mx-8 md:-mx-12 px-8 md:px-12"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            initial="idle"
            animate={isOpen ? "hover" : "idle"}
        >
            {/* Background hover effect */}
            <motion.div 
                className="absolute inset-0 bg-[var(--accent)]/30 pointer-events-none origin-bottom"
                variants={{
                    idle: { scaleY: 0 },
                    hover: { scaleY: 1 }
                }}
                transition={{ duration: 0.6, ease: [0.625, 0.05, 0, 1] }}
            />
            
            {/* Border bottom avec animation */}
            <motion.div 
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)] pointer-events-none origin-left"
                variants={{
                    idle: { scaleX: 0 },
                    hover: { scaleX: 1 }
                }}
                transition={{ duration: 0.7, ease: [0.625, 0.05, 0, 1] }}
            />
            
            {/* Séparateur statique */}
            <div className="nav-link-border absolute bottom-0 left-0 right-0 h-px bg-[var(--foreground)]/20 pointer-events-none origin-left" />

            {/* Trigger */}
            <div className="relative block py-5 md:py-6 cursor-pointer">
                <div className="overflow-hidden">
                    <motion.div 
                        className="nav-link-inner flex items-center justify-between"
                    >
                        <motion.div 
                            className="flex items-baseline gap-3 md:gap-4"
                            variants={{
                                idle: { x: 0 },
                                hover: { x: 20 }
                            }}
                            transition={{ duration: 0.4, ease: [0.625, 0.05, 0, 1] }}
                        >
                            <motion.span 
                                className="text-[10px] font-medium"
                                variants={{
                                    idle: { color: "var(--foreground)", opacity: 0.4 },
                                    hover: { color: "var(--accent)", opacity: 1 }
                                }}
                            >
                                (•)
                            </motion.span>
                            <span className="text-2xl md:text-3xl lg:text-4xl font-serif tracking-tight uppercase text-[var(--foreground)]">
                                Pages
                            </span>
                        </motion.div>
                        
                        {/* Chevron qui tourne */}
                        <motion.svg 
                            className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent)]"
                            viewBox="0 0 24 24" 
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            variants={{
                                idle: { rotate: 0, opacity: 0.5 },
                                hover: { rotate: 180, opacity: 1 }
                            }}
                            transition={{ duration: 0.4, ease: [0.625, 0.05, 0, 1] }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </motion.svg>
                    </motion.div>
                </div>
            </div>

            {/* Dropdown Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="overflow-hidden "
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.625, 0.05, 0, 1] }}
                    >
                        <div className="py-2">
                            {pagesDropdownLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ delay: index * 0.05, duration: 0.5 }}
                                    className="relative"
                                >
                                    <Link
                                        href={link.href}
                                        onClick={(e) => onLinkClick(e, link.href)}
                                        className="group flex items-center gap-3 py-3 px-4 hover:bg-[var(--accent)]/20 transition-colors duration-300"
                                    >
                                        <span className="text-[10px] font-medium text-[var(--accent)]">
                                            ({link.number})
                                        </span>
                                        <span className="text-lg font-serif text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors duration-300">
                                            {link.name}
                                        </span>
                                        <motion.svg 
                                            className="w-4 h-4 text-[var(--accent)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            viewBox="0 0 24 24" 
                                            fill="currentColor"
                                        >
                                            <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                                        </motion.svg>
                                    </Link>
                                    {/* Ligne de séparation */}
                                    <div className="absolute bottom-0 left-4 right-4 h-px bg-[var(--foreground)]/10" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Composant pour les petits liens (auth)
function SmallNavLink({ 
    href, 
    children,
    variant = "default"
}: { 
    href: string; 
    children: React.ReactNode;
    variant?: "default" | "accent";
}) {
    return (
        <Link
            href={href}
            className={cn(
                "menu-footer-item relative inline-flex items-center gap-2 text-sm transition-colors duration-300",
                variant === "accent" 
                    ? "text-[var(--accent)] hover:text-[var(--foreground)]"
                    : "text-[var(--foreground)]/70 hover:text-[var(--accent)]"
            )}
        >
            {children}
        </Link>
    );
}

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuContentRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Body overflow
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    // Menu animations avec useGSAP
    useGSAP(() => {
        if (!menuRef.current || !menuContentRef.current || !overlayRef.current) return;

        // Kill previous timeline
        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        const linkTexts = menuContentRef.current.querySelectorAll(".nav-link-inner");
        const linkBorders = menuContentRef.current.querySelectorAll(".nav-link-border");
        const footerItems = menuContentRef.current.querySelectorAll(".menu-footer-item");

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

            tl.to(menuRef.current, {
                xPercent: 0,
                duration: 1,
                ease: "menuEase",
            }, "-=0.3");

            tl.to(
                linkTexts,
                {
                    yPercent: 0,
                    duration: 0.8,
                    stagger: 0.06,
                    ease: "menuEase",
                },
                "-=0.6"
            );

            tl.to(
                linkBorders,
                {
                    scaleX: 1,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "menuEase",
                },
                "-=0.7"
            );

            tl.to(
                footerItems,
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.04,
                    ease: "menuEase",
                },
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

            tl.to(linkTexts, {
                yPercent: -100,
                duration: 0.4,
                stagger: 0.03,
                ease: "menuEase",
            }, "-=0.2");

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
                {
                    xPercent: 100,
                duration: 0.6,
                    ease: "menuEase",
                },
                "-=0.15"
            );

            tl.to(
                overlayRef.current,
                {
                    opacity: 0,
                    duration: 0.4,
                    ease: "menuEase",
                onComplete: () => {
                        if (menuRef.current && overlayRef.current) {
                        gsap.set(menuRef.current, { display: "none" });
                            gsap.set(overlayRef.current, { display: "none" });
                        }
                    },
                },
                "-=0.5"
            );
        }
    }, { dependencies: [isMenuOpen] });

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            setIsMenuOpen(false);

            setTimeout(() => {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 700);
        }
};

return (
    <>
        {/* Header */}
        <header
                ref={headerRef}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
                isScrolled
                        ? "bg-[var(--beige)]/95 backdrop-blur-md py-4 border-b border-[var(--foreground)]/5"
                        : "bg-transparent py-6 md:py-8"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                    <Link href="/" className="relative z-50 group">
                        <span className={cn(
                            "text-[10px] font-medium tracking-[0.2em] uppercase block mb-1 transition-colors duration-500",
                            "text-[var(--accent)]"
                        )}>
                            Cabinet Infirmier
                        </span>
                        <span className={cn(
                            "text-2xl md:text-3xl font-serif tracking-tight transition-colors duration-500",
                            "text-[var(--foreground)]"
                        )}>
                    Harmonie
                        </span>
                </Link>

                {/* Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={cn(
                            "relative z-[60] flex items-center gap-4 group",
                            "px-5 py-2.5 rounded-full",
                            "font-medium text-xs uppercase tracking-[0.15em]",
                        "transition-all duration-500",
                            "border",
                        isMenuOpen
                                ? "bg-[var(--foreground)] text-[var(--beige)] border-[var(--foreground)]"
                                : isScrolled 
                                    ? "bg-[var(--card-beige)] text-[var(--foreground)] border-[var(--foreground)]/20 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                    : "bg-[var(--card-beige)]/80 text-[var(--foreground)] border-[var(--foreground)]/20 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    )}
                >
                        <span className="relative overflow-hidden h-5 w-14">
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
                        <div className="relative w-6 h-2 flex flex-col justify-between">
                            <span
                                className={cn(
                                    "block h-px w-full transition-all duration-500 origin-center",
                                    isMenuOpen ? "bg-[var(--beige)] rotate-45 translate-y-[3.5px] w-5" : "bg-current"
                                )}
                            />
                            <span
                                className={cn(
                                    "block h-px w-full transition-all duration-500 origin-center",
                                    isMenuOpen ? "bg-[var(--beige)] -rotate-45 -translate-y-[3.5px] w-5" : "bg-current"
                                )}
                    />
                        </div>
                </button>
            </div>
        </header>

        {/* Overlay */}
        <div
            ref={overlayRef}
                className="fixed inset-0 z-[45] bg-[var(--foreground)]/70 backdrop-blur-sm cursor-pointer"
                style={{ display: "none" }}
            onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
            ref={menuRef}
                className="fixed top-0 right-0 h-full w-full md:w-[480px] lg:w-[540px] z-[46] bg-[var(--beige)]"
                style={{ display: "none" }}
        >
                <div
                    ref={menuContentRef}
                    className="h-full flex flex-col px-8 md:px-12 pt-28 pb-8 overflow-y-auto"
                >
                    {/* Top Auth Links */}
                    <div className="flex items-center justify-between pb-6 border-b border-[var(--foreground)]/10 mb-6">
                        <span className="menu-footer-item text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--foreground)]/50">
                            Espace membre
                        </span>
                        <div className="flex items-center gap-6">
                            <SmallNavLink href="/login">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                                    <polyline points="10 17 15 12 10 7"/>
                                    <line x1="15" y1="12" x2="3" y2="12"/>
                                </svg>
                                Se connecter
                            </SmallNavLink>
                            <SmallNavLink href="/register" variant="accent">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="8.5" cy="7" r="4"/>
                                    <line x1="20" y1="8" x2="20" y2="14"/>
                                    <line x1="23" y1="11" x2="17" y2="11"/>
                                </svg>
                                S&apos;inscrire
                            </SmallNavLink>
                            </div>
            </div>

                    {/* Main Navigation avec dropdown */}
                    <nav className="space-y-0 flex-1">
                        {/* Accueil */}
                        {mainNavLinks.map((link) => (
                            <NavLink 
                                key={link.name} 
                                link={link} 
                                onLinkClick={handleLinkClick}
                            />
                        ))}
                        
                        {/* Dropdown Pages */}
                        <PagesDropdown onLinkClick={handleLinkClick} />
                        
                        {/* Contact, Soins, Dashboard */}
                        {directLinks.map((link) => (
                            <NavLink 
                                key={link.name} 
                                link={link} 
                                onLinkClick={handleLinkClick}
                            />
                        ))}
                    </nav>

                    {/* Footer Info */}
                    <div className="space-y-5 pt-6 border-t border-[var(--foreground)]/10 mt-auto">
                        <div className="menu-footer-item flex justify-between items-start">
                    <div>
                                <h4 className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--foreground)]/50 mb-2">
                                    Email
                                </h4>
                                <a
                                    href="mailto:contact@harmonie-sante.fr"
                                    className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors text-sm"
                                >
                                    contact@harmonie-sante.fr
                            </a>
                            </div>
                            <div className="text-right">
                                <h4 className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--foreground)]/50 mb-2">
                                    Téléphone
                                </h4>
                                <a
                                    href="tel:+33553560303"
                                    className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors text-sm"
                                >
                                    +33 5 53 56 03 03
                            </a>
                        </div>
                    </div>

                        <div className="menu-footer-item flex justify-between items-end">
                    <div>
                                <h4 className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--foreground)]/50 mb-2">
                                    Adresse
                                </h4>
                                <p className="text-[var(--foreground)] text-sm">
                                    MSP Nontron, 24300 Dordogne
                                </p>
                            </div>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className="menu-footer-item w-9 h-9 rounded-full border border-[var(--foreground)]/20 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-[var(--beige)] transition-all text-xs font-medium"
                                    >
                                        {social.name}
                                    </a>
                                ))}
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const navigationLinks = [
    { number: "01", name: "Accueil", href: "#hero" },
    { number: "02", name: "À propos", href: "#about" },
    { number: "03", name: "Services", href: "#services" },
    { number: "04", name: "Informations", href: "#informations" },
    { number: "05", name: "Équipe", href: "#team" },
    { number: "06", name: "Contact", href: "#contact" },
];

const socialLinks = [
    { name: "Instagram", href: "#" },
    { name: "Facebook", href: "#" },
    { name: "LinkedIn", href: "#" },
];

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const bigTextRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!footerRef.current) return;

        // Animation du contenu
        if (contentRef.current) {
            const footerCols = contentRef.current.querySelectorAll(".footer-col");
            const footerLines = contentRef.current.querySelectorAll(".footer-line");

            gsap.fromTo(
                footerCols,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            gsap.fromTo(
                footerLines,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }

        // Animation du grand texte
        if (bigTextRef.current) {
            gsap.fromTo(
                bigTextRef.current,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 0.05,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: bigTextRef.current,
                        start: "top 95%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            // Parallax effect
            gsap.to(bigTextRef.current, {
                xPercent: -5,
                ease: "none",
                scrollTrigger: {
                    trigger: bigTextRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                },
            });
        }
    }, { scope: footerRef });

    const handleScrollToTop = () => {
        gsap.to(window, {
            scrollTo: { y: 0 },
            duration: 1.5,
            ease: "power3.inOut",
        });
    };

    return (
        <footer ref={footerRef} className="relative bg-[#0a0a0a]">
            {/* Top decorative line */}
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
            
            {/* Main Footer */}
            <div className="container mx-auto px-6 py-16 md:py-24">
                <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Logo & Description */}
                    <div className="footer-col lg:col-span-1">
                        <Link href="/" className="inline-block mb-6 group">
                            <span className="text-2xl md:text-3xl font-serif text-white group-hover:text-[var(--accent)] transition-colors duration-300">
                                Harmonie
                            </span>
                        </Link>
                        <p className="text-sm text-white/40 leading-relaxed mb-6">
                            Signifiant &quot;équilibre&quot; et &quot;sérénité&quot;, reflétant
                            notre engagement pour des soins personnalisés et bienveillants.
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
                            </span>
                            <span className="text-xs text-white/60 uppercase tracking-wider">Disponible 7j/7</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="footer-col">
                        <h4 className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] mb-6">
                            (navigation)
                        </h4>
                        <div className="footer-line h-px bg-white/10 mb-6 origin-left" />
                        <nav className="space-y-3">
                            {navigationLinks.map((link) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-300"
                                    initial="idle"
                                    whileHover="hover"
                                >
                                    <span className="text-[10px] text-[var(--accent)]/60 group-hover:text-[var(--accent)] transition-colors duration-300">
                                        ({link.number})
                                    </span>
                                    <motion.span 
                                        className="text-sm"
                                        variants={{
                                            idle: { x: 0 },
                                            hover: { x: 5 }
                                        }}
                                        transition={{ duration: 0.3, ease: [0.625, 0.05, 0, 1] }}
                                    >
                                        {link.name}
                                    </motion.span>
                                    <motion.svg
                                        className="w-3 h-3 text-[var(--accent)]"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        variants={{
                                            idle: { x: -10, opacity: 0 },
                                            hover: { x: 0, opacity: 1 }
                                        }}
                                        transition={{ duration: 0.3, ease: [0.625, 0.05, 0, 1] }}
                                    >
                                        <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                                    </motion.svg>
                                </motion.a>
                            ))}
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="footer-col">
                        <h4 className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] mb-6">
                            (contact)
                        </h4>
                        <div className="footer-line h-px bg-white/10 mb-6 origin-left" />
                        <div className="space-y-5">
                            <div>
                                <span className="text-[10px] text-white/30 block mb-1 uppercase tracking-wider">
                                    Email
                                </span>
                                <a
                                    href="mailto:contact@harmonie-sante.fr"
                                    className="text-sm text-white/60 hover:text-[var(--accent)] transition-colors duration-300"
                                >
                                    contact@harmonie-sante.fr
                                </a>
                            </div>
                            <div>
                                <span className="text-[10px] text-white/30 block mb-1 uppercase tracking-wider">
                                    Téléphone
                                </span>
                                <a
                                    href="tel:+33553560303"
                                    className="text-sm text-white/60 hover:text-[var(--accent)] transition-colors duration-300"
                                >
                                    +33 5 53 56 03 03
                                </a>
                            </div>
                            <div>
                                <span className="text-[10px] text-white/30 block mb-1 uppercase tracking-wider">
                                    Social
                                </span>
                                <div className="flex gap-4">
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            className="text-sm text-white/60 hover:text-[var(--accent)] transition-colors duration-300"
                                        >
                                            {social.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Office */}
                    <div className="footer-col">
                        <h4 className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] mb-6">
                            (cabinet)
                        </h4>
                        <div className="footer-line h-px bg-white/10 mb-6 origin-left" />
                        <address className="not-italic text-sm text-white/60 leading-relaxed mb-4">
                            Maison de Santé Pluriprofessionnelle
                            <br />
                            <span className="text-white/40">Place des Droits de l&apos;Homme</span>
                            <br />
                            <span className="text-[var(--accent)]">24300 Nontron</span>, France
                        </address>
                        <div className="space-y-1 text-xs text-white/40">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                                <span>Lundi - Vendredi: 6h30 - 20h00</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                                <span>Samedi - Dimanche: 7h00 - 19h00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative line */}
            <div className="container mx-auto px-6">
                <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />
            </div>

            {/* Bottom Bar */}
            <div className="container mx-auto px-6 py-6 md:py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Copyright */}
                    <div className="flex items-center gap-4 text-xs text-white/30">
                        <span>©{new Date().getFullYear()}</span>
                        <span className="text-[var(--accent)]">HARMONIE</span>
                        <span>—</span>
                        <span>Tous droits réservés</span>
                    </div>

                    {/* Legal links */}
                    <div className="flex items-center gap-6 text-xs">
                        <a
                            href="#"
                            className="text-white/30 hover:text-[var(--accent)] transition-colors duration-300"
                        >
                            Mentions légales
                        </a>
                        <a
                            href="#"
                            className="text-white/30 hover:text-[var(--accent)] transition-colors duration-300"
                        >
                            Politique de confidentialité
                        </a>
                    </div>

                    {/* Back to top */}
                    <motion.button
                        onClick={handleScrollToTop}
                        className="group flex items-center gap-3 text-xs text-white/30 hover:text-white transition-colors duration-300"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="uppercase tracking-wider">Retour en haut</span>
                        <div className="w-10 h-10 rounded-full border border-[var(--accent)]/30 flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] transition-all duration-300">
                            <svg
                                className="w-4 h-4 rotate-[-90deg] text-[var(--accent)] group-hover:text-[var(--dark-brown)] transition-colors duration-300"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            >
                                <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                            </svg>
                        </div>
                    </motion.button>
                </div>
            </div>

            {/* Large decorative text */}
            <div className="container mx-auto px-6 py-8 overflow-hidden">
                <div
                    ref={bigTextRef}
                    className="text-[12vw] md:text-[15vw] font-serif leading-none text-center select-none pointer-events-none whitespace-nowrap"
                    style={{ 
                        opacity: 0,
                        color: 'var(--accent)',
                    }}
                >
                    HARMONIE
                </div>
            </div>

            {/* Bottom decorative elements */}
            <div className="absolute bottom-4 left-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                <span className="text-[10px] text-white/20 font-mono">45.5333° N</span>
            </div>
            <div className="absolute bottom-4 right-6 flex items-center gap-2">
                <span className="text-[10px] text-white/20 font-mono">0.6667° E</span>
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            </div>
        </footer>
    );
}

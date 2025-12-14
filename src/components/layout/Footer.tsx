"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";

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

  useGSAP(
    () => {
      if (!footerRef.current) return;

      // Animation du contenu
      if (contentRef.current) {
        const footerCols = contentRef.current.querySelectorAll(".footer-col");
        const footerLines = contentRef.current.querySelectorAll(".footer-line");

        if (footerCols.length > 0) {
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
        }

        if (footerLines.length > 0) {
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
    },
    { scope: footerRef }
  );

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
      <div className="h-px bg-gradient-to-r from-transparent via-[#927950]/30 to-transparent" />

      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div
          ref={contentRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
        >
          {/* Logo & Description */}
          <div className="footer-col lg:col-span-1">
            <Link href="/" className="inline-block mb-6 group">
              <span className="text-3xl md:text-4xl font-serif text-white group-hover:text-[#927950] transition-colors duration-300">
                Harmonie
              </span>
            </Link>
            <p className="text-sm md:text-base text-white/60 leading-relaxed mb-6">
              Signifiant &quot;équilibre&quot; et &quot;sérénité&quot;,
              reflétant notre engagement pour des soins personnalisés et
              bienveillants.
            </p>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#927950]/10 rounded-full border border-[#927950]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#927950] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#927950]"></span>
              </span>
              <span className="text-xs md:text-sm text-white/80 uppercase tracking-wider">
                Disponible 7j/7
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h4 className="text-xs md:text-sm font-medium tracking-[0.15em] uppercase text-[#927950] mb-6">
              (navigation)
            </h4>
            <div className="footer-line h-px bg-white/20 mb-6 origin-left" />
            <nav className="space-y-3">
              {navigationLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300"
                  initial="idle"
                  whileHover="hover"
                >
                  <span className="text-[10px] md:text-xs text-[#927950]/80 group-hover:text-[#927950] transition-colors duration-300">
                    ({link.number})
                  </span>
                  <motion.span
                    className="text-sm md:text-base"
                    variants={{
                      idle: { x: 0 },
                      hover: { x: 5 },
                    }}
                    transition={{ duration: 0.3, ease: [0.625, 0.05, 0, 1] }}
                  >
                    {link.name}
                  </motion.span>
                  <motion.svg
                    className="w-3 h-3 text-[#927950]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    variants={{
                      idle: { x: -10, opacity: 0 },
                      hover: { x: 0, opacity: 1 },
                    }}
                    transition={{ duration: 0.3, ease: [0.625, 0.05, 0, 1] }}
                  >
                    <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
                  </motion.svg>
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="text-xs md:text-sm font-medium tracking-[0.15em] uppercase text-[#927950] mb-6">
              (contact)
            </h4>
            <div className="footer-line h-px bg-white/20 mb-6 origin-left" />
            <div className="space-y-5">
              <div className="group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                <span className="text-[10px] md:text-xs text-white/50 block mb-1 uppercase tracking-wider">
                  Email
                </span>
                <a
                  href="mailto:cabinet.rfm24@orange.fr"
                  className="text-sm md:text-base text-white/80 hover:text-[#927950] transition-colors duration-300 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 text-[#927950]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  cabinet.rfm24@orange.fr
                </a>
              </div>
              <div className="group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                <span className="text-[10px] md:text-xs text-white/50 block mb-1 uppercase tracking-wider">
                  Téléphone
                </span>
                <a
                  href="tel:+33553560303"
                  className="text-sm md:text-base text-white/80 hover:text-[#927950] transition-colors duration-300 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 text-[#927950]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  +33 5 53 56 03 03
                </a>
              </div>
              <div>
                <span className="text-[10px] md:text-xs text-white/50 block mb-3 uppercase tracking-wider">
                  Réseaux sociaux
                </span>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className="px-3 py-2 text-xs md:text-sm text-white/70 hover:text-white bg-white/5 hover:bg-[#927950]/20 rounded-lg border border-white/10 hover:border-[#927950]/30 transition-all duration-300"
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
            <h4 className="text-xs md:text-sm font-medium tracking-[0.15em] uppercase text-[#927950] mb-6">
              (cabinet)
            </h4>
            <div className="footer-line h-px bg-white/20 mb-6 origin-left" />
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#927950]/20 flex items-center justify-center shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-[#927950]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>
                <address className="not-italic text-sm md:text-base text-white/80 leading-relaxed">
                  Maison de Santé Pluriprofessionnelle
                  <br />
                  <span className="text-white/60">
                    Place des Droits de l&apos;Homme
                  </span>
                  <br />
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-[#927950]/20 rounded text-[#927950] text-xs font-medium">
                    📍 24300 Nontron
                  </span>
                </address>
              </div>
            </div>
            <div className="space-y-2 text-xs md:text-sm text-white/60">
              <div className="flex items-center gap-2 py-1.5 px-3 rounded bg-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#927950]" />
                <span>Lun - Ven:</span>
                <span className="text-white/90 ml-auto">6h30 - 20h00</span>
              </div>
              <div className="flex items-center gap-2 py-1.5 px-3 rounded bg-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#927950]" />
                <span>Sam - Dim:</span>
                <span className="text-white/90 ml-auto">7h00 - 19h00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="container mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#927950]/20 to-transparent" />
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto px-6 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 md:gap-4 text-xs md:text-sm text-white/50">
            <span>©{new Date().getFullYear()}</span>
            <span className="text-[#927950] font-medium">HARMONIE</span>
            <span className="hidden sm:inline">—</span>
            <span>Tous droits réservés</span>
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs md:text-sm">
            <a
              href="#"
              className="text-white/50 hover:text-[#927950] transition-colors duration-300"
            >
              Mentions légales
            </a>
            <span className="text-white/20">|</span>
            <a
              href="#"
              className="text-white/50 hover:text-[#927950] transition-colors duration-300"
            >
              Politique de confidentialité
            </a>
          </div>

          {/* Back to top */}
          <motion.button
            onClick={handleScrollToTop}
            className="group flex items-center gap-3 text-xs md:text-sm text-white/50 hover:text-white transition-colors duration-300"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="uppercase tracking-wider hidden sm:inline">
              Retour en haut
            </span>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#927950]/30 flex items-center justify-center group-hover:border-[#927950] group-hover:bg-[#927950] transition-all duration-300">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 -rotate-90 text-[#927950] group-hover:text-[#1E211E] transition-colors duration-300"
                viewBox="0 0 24 24"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              >
                <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
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
            color: "var(--accent)",
          }}
        >
          HARMONIE
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-4 left-4 md:left-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#927950]" />
        <span className="text-[8px] md:text-[10px] text-white/40 font-mono">
          45.5333° N
        </span>
      </div>
      <div className="absolute bottom-4 right-4 md:right-6 flex items-center gap-2">
        <span className="text-[8px] md:text-[10px] text-white/40 font-mono">
          0.6667° E
        </span>
        <div className="w-2 h-2 rounded-full bg-[#927950]" />
      </div>
    </footer>
  );
}

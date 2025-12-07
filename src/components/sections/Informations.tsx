"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const medecins = [
    { name: "Dr. CHRAÏBI", specialite: "Médecin Généraliste", tel: "05 53 56 03 03" },
    { name: "Dr. IONICA", specialite: "Médecin Généraliste", tel: "05 53 56 03 03" },
];

const specialistes = [
    { specialite: "Pneumologie", tel: "05 45 38 08 90" },
    { specialite: "Urologie", tel: "05 45 97 88 89" },
    { specialite: "Gynécologie", tel: "05 45 69 66 36" },
    { specialite: "Hypnothérapie", tel: "06 45 91 61 57" },
    { specialite: "Sage-femme", tel: "06 88 21 65 61" },
];

const infirmiers = [
    "05 53 56 20 19",
    "05 53 56 04 56",
    "06 43 60 37 24",
];

export default function Informations() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        // Animation du header
        if (headerRef.current) {
            const headerItems = headerRef.current.querySelectorAll(".reveal-item");
            const headerLine = headerRef.current.querySelector(".header-line");

            gsap.fromTo(
                headerItems,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            if (headerLine) {
                gsap.fromTo(
                    headerLine,
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        duration: 1.2,
                        ease: "power4.out",
                        scrollTrigger: {
                            trigger: headerRef.current,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            }
        }

        // Animation des cards
        const cards = sectionRef.current.querySelectorAll(".info-card");
        gsap.fromTo(
            cards,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: cards[0],
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        // Animation des lignes décoratives
        const lines = sectionRef.current.querySelectorAll(".content-line");
        gsap.fromTo(
            lines,
            { scaleX: 0 },
            {
                scaleX: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: lines[0],
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            }
        );
    }, { scope: sectionRef });

    return (
        <section 
            ref={sectionRef}
            id="informations" 
            className="relative py-32 md:py-48 bg-[var(--beige)] overflow-hidden"
        >
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--card-beige)]/30 to-transparent pointer-events-none" />
            <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full border border-[var(--accent)]/10 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full border border-[var(--accent)]/10 -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section header */}
                <div ref={headerRef} className="flex items-start justify-between mb-16 md:mb-24">
                    <div>
                        <span className="reveal-item text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] block mb-4">
                            (informations)
                        </span>
                        <div className="header-line w-16 h-[2px] bg-[var(--accent)] mb-6 origin-left" />
                        <h2 className="reveal-item text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--foreground)] leading-[1.1]">
                            Maison de Santé
                            <br />
                            <span className="text-[var(--accent)]">Pluriprofessionnelle</span>
                        </h2>
                        <p className="reveal-item text-lg md:text-xl text-[var(--foreground)]/60 leading-relaxed mt-6 max-w-2xl">
                            Retrouvez-nous à la Maison de Santé de Nontron, regroupant médecins généralistes,
                            spécialistes et infirmiers pour votre prise en charge complète.
                        </p>
                    </div>
                    <span className="reveal-item section-number text-[var(--foreground)]/20 hidden md:block">
                        05
                    </span>
                </div>

                {/* Address & Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="info-card group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full border border-[var(--accent)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent)] transition-colors duration-300">
                                <svg className="w-5 h-5 text-[var(--accent)] group-hover:text-[var(--beige)] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] block mb-2">
                                    (adresse)
                                </span>
                                <p className="text-lg text-[var(--foreground)] leading-relaxed">
                                    Maison de Santé Pluriprofessionnelle
                                    <br />
                                    <span className="text-[var(--foreground)]/60">Place des Droits de l&apos;Homme</span>
                                    <br />
                                    <span className="text-[var(--accent)] font-medium">24300 Nontron</span>
                                </p>
                            </div>
                        </div>
                        <div className="content-line mt-6 h-px bg-[var(--foreground)]/10 origin-left" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="info-card group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full border border-[var(--accent)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent)] transition-colors duration-300">
                                <svg className="w-5 h-5 text-[var(--accent)] group-hover:text-[var(--beige)] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] block mb-2">
                                    (horaires)
                                </span>
                                <p className="text-lg text-[var(--foreground)] leading-relaxed">
                                    Lundi au Vendredi : <span className="font-medium">8h - 12h / 14h - 18h</span>
                                    <br />
                                    Samedi : <span className="font-medium">8h - 12h</span>
                                </p>
                            </div>
                        </div>
                        <div className="content-line mt-6 h-px bg-[var(--foreground)]/10 origin-left" />
                    </motion.div>
                </div>

                {/* Médecins Généralistes */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
                            <svg className="w-5 h-5 text-[var(--beige)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-serif text-[var(--foreground)]">Médecins Généralistes</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {medecins.map((medecin, index) => (
                            <motion.div 
                                key={index} 
                                className="info-card relative p-8 bg-[var(--card-beige)] border border-[var(--foreground)]/5 hover:border-[var(--accent)]/30 transition-all duration-300 group"
                                whileHover={{ y: -4 }}
                            >
                                {/* Corner decorations */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] block mb-3">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <p className="text-2xl font-serif text-[var(--foreground)] mb-2">{medecin.name}</p>
                                <p className="text-[var(--foreground)]/50 mb-4">{medecin.specialite}</p>
                                <a 
                                    href={`tel:${medecin.tel.replace(/\s/g, '')}`} 
                                    className="inline-flex items-center gap-2 text-lg font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-300"
                                >
                                    {medecin.tel}
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Spécialistes */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
                            <svg className="w-5 h-5 text-[var(--beige)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-serif text-[var(--foreground)]">Consultations de Spécialistes</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {specialistes.map((spec, index) => (
                            <motion.div 
                                key={index} 
                                className="info-card relative p-6 bg-[var(--card-beige)] border border-[var(--foreground)]/5 hover:border-[var(--accent)]/30 transition-all duration-300 group"
                                whileHover={{ y: -2 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-medium text-[var(--foreground)] mb-1">{spec.specialite}</p>
                                        <a 
                                            href={`tel:${spec.tel.replace(/\s/g, '')}`} 
                                            className="text-sm text-[var(--foreground)]/50 hover:text-[var(--accent)] transition-colors duration-300"
                                        >
                                            {spec.tel}
                                        </a>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-[var(--accent)]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Infirmiers */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
                            <svg className="w-5 h-5 text-[var(--beige)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-serif text-[var(--foreground)]">Cabinets Infirmiers</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {infirmiers.map((tel, index) => (
                            <motion.a
                                key={index}
                                href={`tel:${tel.replace(/\s/g, '')}`}
                                className="info-card relative px-8 py-4 bg-[var(--card-beige)] border border-[var(--foreground)]/10 text-lg font-medium text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--beige)] hover:border-[var(--accent)] transition-all duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {tel}
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Téléconsultation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative p-8 md:p-12 bg-[var(--foreground)] text-[var(--beige)] overflow-hidden"
                >
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--accent)]" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--accent)]" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--accent)]" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--accent)]" />

                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] block mb-4">
                        (téléconsultation)
                    </span>
                    <h3 className="text-3xl md:text-4xl font-serif text-[var(--beige)] mb-8">Point de Téléconsultation</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-xl text-[var(--accent)] mb-4">CMSI Périgueux</p>
                            <p className="text-[var(--beige)]/60 leading-relaxed">
                                Centre Médical de Soins Immédiats<br />
                                Traumatologie adultes et enfants (membres supérieurs et inférieurs)<br />
                                Infections ORL ou pulmonaires adultes
                            </p>
                        </div>
                        <div>
                            <div className="mb-6">
                                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] block mb-2">
                                    (disponibilité)
                                </span>
                                <p className="text-lg text-[var(--beige)]">Lundi au Vendredi : <span className="font-medium">14h - 17h30</span></p>
                            </div>
                            <div>
                                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] block mb-2">
                                    (contact)
                                </span>
                                <a href="tel:0553560456" className="text-lg font-medium text-[var(--beige)] hover:text-[var(--accent)] transition-colors duration-300 inline-flex items-center gap-2">
                                    05 53 56 04 56
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                                <p className="text-[var(--beige)]/40 mt-1 text-sm">Bureau N°7</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />
        </section>
    );
}

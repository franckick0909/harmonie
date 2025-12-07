"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

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

        // Animation du contenu
        if (contentRef.current) {
            const contentItems = contentRef.current.querySelectorAll(".content-item");
            const contentLines = contentRef.current.querySelectorAll(".content-line");

            gsap.fromTo(
                contentItems,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            gsap.fromTo(
                contentLines,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }

        // Animation du formulaire
        if (formRef.current) {
            const formFields = formRef.current.querySelectorAll(".form-field");
            const formLines = formRef.current.querySelectorAll(".form-line");

            gsap.fromTo(
                formFields,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: formRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            gsap.fromTo(
                formLines,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 0.6,
                    stagger: 0.06,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: formRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }
    }, { scope: sectionRef });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="relative py-32 md:py-48 bg-[var(--accent)] overflow-hidden"
        >
            {/* Background decorative elements */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[var(--foreground)]/5 to-transparent pointer-events-none" />
            <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full border border-[var(--beige)]/20 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full border border-[var(--beige)]/10 -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section header */}
                <div ref={headerRef} className="flex items-start justify-between mb-16 md:mb-24">
                    <div>
                        <span className="reveal-item text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--beige)] block mb-4">
                            (contact)
                        </span>
                        <div className="header-line w-16 h-[2px] bg-[var(--beige)] mb-6 origin-left" />
                        <h2 className="reveal-item text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--beige)] leading-[1.1]">
                            Créez votre
                            <br />
                            <span className="text-[var(--foreground)]">parcours santé</span>
                        </h2>
                    </div>
                    <span className="reveal-item section-number text-[var(--beige)]/40 hidden md:block">
                        04
                    </span>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Left side - Info */}
                    <div ref={contentRef}>
                        <p className="content-item text-lg md:text-xl text-[var(--beige)]/70 leading-relaxed mb-12">
                            Harmonie allie innovation et bienveillance pour créer des espaces
                            de soins qui se distinguent et qui ont du sens.{" "}
                            <span className="text-[var(--beige)]">
                                Donnons vie à votre projet santé
                            </span>{" "}
                            avec un accompagnement personnalisé et{" "}
                            <span className="text-[var(--foreground)]">moderne</span>.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-8 mb-12">
                            <div className="content-item group">
                                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--beige)]/60 block mb-2">
                                    (email)
                                </span>
                                <a
                                    href="mailto:contact@harmonie-sante.fr"
                                    className="text-lg text-[var(--beige)] hover:text-[var(--foreground)] transition-colors duration-300 inline-flex items-center gap-3"
                                >
                                    contact@harmonie-sante.fr
                                    <motion.svg
                                        className="w-4 h-4 text-[var(--foreground)]"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        initial={{ x: -10, opacity: 0 }}
                                        whileHover={{ x: 0, opacity: 1 }}
                                    >
                                        <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                                    </motion.svg>
                                </a>
                                <div className="content-line mt-4 h-px bg-[var(--beige)]/20 origin-left" />
                            </div>
                            <div className="content-item group">
                                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--beige)]/60 block mb-2">
                                    (téléphone)
                                </span>
                                <a
                                    href="tel:+33553560303"
                                    className="text-lg text-[var(--beige)] hover:text-[var(--foreground)] transition-colors duration-300 inline-flex items-center gap-3"
                                >
                                    +33 5 53 56 03 03
                                    <motion.svg
                                        className="w-4 h-4 text-[var(--foreground)]"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        initial={{ x: -10, opacity: 0 }}
                                        whileHover={{ x: 0, opacity: 1 }}
                                    >
                                        <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                                    </motion.svg>
                                </a>
                                <div className="content-line mt-4 h-px bg-[var(--beige)]/20 origin-left" />
                            </div>
                            <div className="content-item">
                                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--beige)]/60 block mb-2">
                                    (adresse)
                                </span>
                                <p className="text-lg text-[var(--beige)] leading-relaxed">
                                    Maison de Santé Pluriprofessionnelle
                                    <br />
                                    <span className="text-[var(--beige)]/70">Place des Droits de l&apos;Homme</span>
                                    <br />
                                    <span className="text-[var(--foreground)]">24300 Nontron</span>, France
                                </p>
                                <div className="content-line mt-4 h-px bg-[var(--beige)]/20 origin-left" />
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="content-item relative p-6 border border-[var(--beige)]/30 bg-[var(--foreground)]/10 backdrop-blur-sm">
                            {/* Corner decorations */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--beige)]" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--beige)]" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--beige)]" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--beige)]" />
                            
                            <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--beige)] block mb-4">
                                (horaires)
                            </span>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-[var(--beige)]/60">Lundi - Vendredi</span>
                                    <span className="text-[var(--beige)] font-medium">6h30 - 20h00</span>
                                </div>
                                <div className="h-px bg-[var(--beige)]/20" />
                                <div className="flex justify-between items-center">
                                    <span className="text-[var(--beige)]/60">Samedi - Dimanche</span>
                                    <span className="text-[var(--beige)] font-medium">7h00 - 19h00</span>
                                </div>
                                <div className="h-px bg-[var(--beige)]/20" />
                                <div className="flex justify-between items-center">
                                    <span className="text-[var(--beige)]/60">Permanence cabinet</span>
                                    <span className="text-[var(--foreground)] font-medium">11h00 - 12h00</span>
                                </div>
                            </div>
                        </div>

                        {/* Coordinates */}
                        <div className="content-item mt-6 flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-[var(--beige)]" />
                            <span className="text-xs text-[var(--beige)]/50 font-mono">
                                45.5333° N 0.6667° E
                            </span>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-field relative">
                            <label
                                className={`text-[10px] font-medium tracking-[0.15em] uppercase block mb-3 transition-colors duration-300 ${
                                    focusedField === "name" ? "text-[var(--beige)]" : "text-[var(--beige)]/60"
                                }`}
                            >
                                (nom complet)
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                onFocus={() => setFocusedField("name")}
                                onBlur={() => setFocusedField(null)}
                                className="w-full bg-transparent border-b border-[var(--beige)]/30 py-4 text-[var(--beige)] placeholder:text-[var(--beige)]/40 focus:outline-none focus:border-[var(--beige)] transition-colors duration-300"
                                placeholder="Jean Dupont"
                                required
                            />
                            <div className="form-line absolute bottom-0 left-0 right-0 h-px bg-[var(--beige)] origin-left scale-x-0 transition-transform duration-300" style={{ transform: focusedField === "name" ? "scaleX(1)" : "scaleX(0)" }} />
                        </div>

                        <div className="form-field relative">
                            <label
                                className={`text-[10px] font-medium tracking-[0.15em] uppercase block mb-3 transition-colors duration-300 ${
                                    focusedField === "email" ? "text-[var(--beige)]" : "text-[var(--beige)]/60"
                                }`}
                            >
                                (email)
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                onFocus={() => setFocusedField("email")}
                                onBlur={() => setFocusedField(null)}
                                className="w-full bg-transparent border-b border-[var(--beige)]/30 py-4 text-[var(--beige)] placeholder:text-[var(--beige)]/40 focus:outline-none focus:border-[var(--beige)] transition-colors duration-300"
                                placeholder="jean@example.com"
                                required
                            />
                            <div className="form-line absolute bottom-0 left-0 right-0 h-px bg-[var(--beige)] origin-left scale-x-0 transition-transform duration-300" style={{ transform: focusedField === "email" ? "scaleX(1)" : "scaleX(0)" }} />
                        </div>

                        <div className="form-field relative">
                            <label
                                className={`text-[10px] font-medium tracking-[0.15em] uppercase block mb-3 transition-colors duration-300 ${
                                    focusedField === "phone" ? "text-[var(--beige)]" : "text-[var(--beige)]/60"
                                }`}
                            >
                                (téléphone)
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                                onFocus={() => setFocusedField("phone")}
                                onBlur={() => setFocusedField(null)}
                                className="w-full bg-transparent border-b border-[var(--beige)]/30 py-4 text-[var(--beige)] placeholder:text-[var(--beige)]/40 focus:outline-none focus:border-[var(--beige)] transition-colors duration-300"
                                placeholder="+33 6 00 00 00 00"
                            />
                            <div className="form-line absolute bottom-0 left-0 right-0 h-px bg-[var(--beige)] origin-left scale-x-0 transition-transform duration-300" style={{ transform: focusedField === "phone" ? "scaleX(1)" : "scaleX(0)" }} />
                        </div>

                        <div className="form-field relative">
                            <label
                                className={`text-[10px] font-medium tracking-[0.15em] uppercase block mb-3 transition-colors duration-300 ${
                                    focusedField === "message" ? "text-[var(--beige)]" : "text-[var(--beige)]/60"
                                }`}
                            >
                                (message)
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) =>
                                    setFormData({ ...formData, message: e.target.value })
                                }
                                onFocus={() => setFocusedField("message")}
                                onBlur={() => setFocusedField(null)}
                                className="w-full bg-transparent border-b border-[var(--beige)]/30 py-4 text-[var(--beige)] placeholder:text-[var(--beige)]/40 focus:outline-none focus:border-[var(--beige)] transition-colors duration-300 resize-none min-h-[120px]"
                                placeholder="Décrivez votre besoin..."
                                required
                            />
                            <div className="form-line absolute bottom-0 left-0 right-0 h-px bg-[var(--beige)] origin-left scale-x-0 transition-transform duration-300" style={{ transform: focusedField === "message" ? "scaleX(1)" : "scaleX(0)" }} />
                        </div>

                        <motion.button
                            type="submit"
                            className="form-field group relative w-full py-5 bg-[var(--beige)] text-[var(--accent)] font-medium text-xs uppercase tracking-[0.15em] overflow-hidden mt-8"
                            whileHover="hover"
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Hover effect */}
                            <motion.div
                                className="absolute inset-0 bg-[var(--foreground)]"
                                initial={{ x: "-100%" }}
                                variants={{ hover: { x: 0 } }}
                                transition={{ duration: 0.4, ease: [0.625, 0.05, 0, 1] }}
                            />
                            <motion.span 
                                className="relative z-10 flex items-center justify-center gap-3"
                                variants={{ hover: { color: "var(--beige)" } }}
                            >
                                Envoyer le message
                                <svg
                                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                >
                                    <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                                </svg>
                            </motion.span>
                        </motion.button>

                        <p className="form-field text-xs text-[var(--beige)]/50 mt-6">
                            En soumettant ce formulaire, vous acceptez notre{" "}
                            <a
                                href="#"
                                className="text-[var(--beige)]/70 hover:text-[var(--beige)] transition-colors duration-300"
                            >
                                politique de confidentialité
                            </a>
                            .
                        </p>
                    </form>
                </div>
            </div>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--beige)]/30 to-transparent" />
        </section>
    );
}

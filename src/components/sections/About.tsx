"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { value: "05", label: "Infirmières diplômées", suffix: "" },
    { value: "7", label: "Jours sur 7", suffix: "/7" },
    { value: "15", label: "Années d'expérience", suffix: "+" },
    { value: "100", label: "Engagement total", suffix: "%" },
];

const values = [
    {
        number: "01",
        title: "Bienveillance",
        description: "Chaque patient est unique. Nous prenons le temps d'écouter et d'accompagner avec empathie."
    },
    {
        number: "02", 
        title: "Excellence",
        description: "Des soins techniques de qualité, réalisés avec rigueur et professionnalisme."
    },
    {
        number: "03",
        title: "Proximité",
        description: "Une équipe disponible 7j/7, au plus proche de vos besoins et de votre quotidien."
    }
];

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const valuesRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        // Animation du header
        if (headerRef.current) {
            const headerItems = headerRef.current.querySelectorAll(".reveal-item");
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
                        toggleActions: "play none none none",
                    },
                }
            );

            // Animation de la ligne décorative
            const line = headerRef.current.querySelector(".header-line");
            if (line) {
                gsap.fromTo(
                    line,
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        duration: 1.2,
                        ease: "power4.out",
                        scrollTrigger: {
                            trigger: headerRef.current,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }
        }

        // Animation du contenu
        if (contentRef.current) {
            const contentItems = contentRef.current.querySelectorAll(".content-item");
            gsap.fromTo(
                contentItems,
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: "top 75%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // Animation des mots
            const words = contentRef.current.querySelectorAll(".word");
            if (words.length > 0) {
                gsap.fromTo(
                    words,
                    { opacity: 0.2 },
                    {
                        opacity: 1,
                        stagger: 0.03,
                        ease: "none",
                        scrollTrigger: {
                            trigger: contentRef.current,
                            start: "top 70%",
                            end: "bottom 60%",
                            scrub: 1,
                        },
                    }
                );
            }
        }

        // Animation de l'image - reveal avec clipPath du haut vers le bas
        if (imageRef.current) {
            const imageContainer = imageRef.current;
            
            // Reveal avec clipPath - du bas vers le haut
            gsap.fromTo(
                imageContainer,
                { clipPath: "inset(0% 0% 100% 0%)" },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1.4,
                    ease: "power4.inOut",
                    scrollTrigger: {
                        trigger: imageContainer,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // Parallax sur l'image inner
            const imgInner = imageRef.current.querySelector(".image-inner");
            if (imgInner) {
                gsap.fromTo(
                    imgInner,
                    { y: -200 },
                    {
                        y: 200,
                        ease: "none",
                        scrollTrigger: {
                            trigger: imageContainer,
                            scrub: true,
                        },
                    }
                );
            }
        }

        // Animation des valeurs
        if (valuesRef.current) {
            const valueItems = valuesRef.current.querySelectorAll(".value-item");
            const valueLines = valuesRef.current.querySelectorAll(".value-line");

            gsap.fromTo(
                valueItems,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: valuesRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );

            gsap.fromTo(
                valueLines,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: valuesRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }

        // Animation des stats
        if (statsRef.current) {
            const statItems = statsRef.current.querySelectorAll(".stat-item");
            const statLines = statsRef.current.querySelectorAll(".stat-line");

            gsap.fromTo(
                statItems,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );

            gsap.fromTo(
                statLines,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // Animation des valeurs des stats
            statItems.forEach((item) => {
                const value = item.querySelector(".stat-value");
                if (value) {
                    gsap.fromTo(
                        value,
                        { scale: 0.8, opacity: 0 },
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 0.6,
                            ease: "back.out(1.7)",
                            scrollTrigger: {
                                trigger: item,
                                start: "top 85%",
                                toggleActions: "play none none none",
                            },
                        }
                    );
                }
            });
        }
    }, { scope: sectionRef });

    const splitText = (text: string) => {
        return text.split(" ").map((word, i) => (
            <span key={i} className="word inline-block mr-[0.25em]">
                {word}
            </span>
        ));
    };

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative py-32 md:py-48 bg-[var(--light-beige)] overflow-hidden"
        >
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--accent)]/5 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full border border-[var(--accent)]/10 -translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-6">
                {/* Section header */}
                <div ref={headerRef} className="flex items-start justify-between mb-16 md:mb-24">
                    <div>
                        <span className="reveal-item text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] block mb-4">
                            (à propos)
                        </span>
                        <div className="header-line w-16 h-[2px] bg-[var(--accent)] mb-6 origin-left" />
                        <h2 className="reveal-item text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--dark-brown)] leading-[1.1]">
                            Tradition &<br />
                            <span className="text-[var(--accent)]">Bienveillance</span>
                        </h2>
                    </div>
                    <span className="reveal-item section-number text-[var(--dark-brown)]/40 hidden md:block">
                        01
                    </span>
                </div>

                {/* Main content grid */}
                <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24 md:mb-32">
                    {/* Left column - Image avec parallax */}
                    <div ref={imageRef} className="content-item relative aspect-[4/5] overflow-hidden">
                        {/* Image inner pour le parallax */}
                        <div className="image-inner absolute inset-0 scale-[1.3]">
                            <Image
                                src="/images/hero5.jpg"
                                alt="Soins infirmiers personnalisés"
                                fill
                                className="object-cover"
                            />
                        </div>
                        
                        {/* Decorative frame */}
                        <div className="absolute inset-4 border border-[var(--accent)]/30 pointer-events-none z-20" />
                        
                        {/* Corner accent */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-[var(--accent)] pointer-events-none" />
                    </div>

                    {/* Right column - Text content */}
                    <div className="content-item flex flex-col justify-center">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-[var(--dark-brown)] mb-8 leading-tight">
                            Chaque soin raconte<br />
                            <span className="text-[var(--accent)]">une histoire</span>
                        </h3>
                        
                        <div className="text-base md:text-lg text-[var(--dark-brown)]/60 leading-relaxed mb-8">
                            <p className="mb-6">
                                {splitText(
                                    "Dans chaque intervention chez Harmonie, l'essence du soin traditionnel est présente. En intégrant les méthodes éprouvées et l'attention bienveillante de nos prédécesseurs, nous assurons que chaque patient bénéficie non seulement de soins techniques de qualité, mais aussi d'une approche profondément humaine."
                                )}
                            </p>
                            <p>
                                {splitText(
                                    "Nos soins reflètent un profond respect pour la personne, tout en embrassant les innovations de la médecine moderne."
                                )}
                            </p>
                        </div>

                        {/* CTA Button */}
                        <a
                            href="#contact"
                            className="group inline-flex items-center gap-4 text-[var(--dark-brown)] hover:text-[var(--accent)] transition-colors duration-500 self-start"
                        >
                            <span className="text-sm font-medium uppercase tracking-[0.15em]">En savoir plus</span>
                            <span className="flex items-center gap-3">
                                <span className="block w-8 h-[1px] bg-current transition-all duration-500 group-hover:w-16" />
                                <svg
                                    className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                >
                                    <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                                </svg>
                            </span>
                        </a>
                    </div>
                </div>

                {/* Values section */}
                <div ref={valuesRef} className="mb-24 md:mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--accent)]">
                            (nos valeurs)
                        </span>
                        <div className="flex-1 h-px bg-[var(--dark-brown)]/10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {values.map((value, index) => (
                            <div key={index} className="value-item group">
                                <div className="value-line h-[2px] bg-[var(--accent)] mb-6 origin-left" />
                                <span className="text-[10px] font-medium tracking-[0.15em] text-[var(--accent)] block mb-3">
                                    ({value.number})
                                </span>
                                <h4 className="text-xl md:text-2xl font-serif text-[var(--dark-brown)] mb-4 group-hover:text-[var(--accent)] transition-colors duration-500">
                                    {value.title}
                                </h4>
                                <p className="text-sm text-[var(--dark-brown)]/60 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div ref={statsRef}>
                    <div className="flex items-center gap-4 mb-12">
                        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--accent)]">
                            (en chiffres)
                        </span>
                        <div className="flex-1 h-px bg-[var(--dark-brown)]/10" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--dark-brown)]/10">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="stat-item bg-[var(--light-beige)] p-6 md:p-10 group hover:bg-[var(--accent)]/5 transition-colors duration-500 relative"
                            >
                                <div className="stat-line absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent)] origin-left" />
                                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--dark-brown)]/40 block mb-4 md:mb-6">
                                    {stat.label}
                                </span>
                                <span className="stat-value text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--dark-brown)] group-hover:text-[var(--accent)] transition-colors duration-500 block">
                                    {stat.value}
                                    <span className="text-[var(--accent)]">{stat.suffix}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
        </section>
    );
}

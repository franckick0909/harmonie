"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);

// Créer l'ease Osmo
if (typeof window !== "undefined" && !CustomEase.get("osmo-ease")) {
    CustomEase.create("osmo-ease", "0.625, 0.05, 0, 1");
}

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const subtitleLineRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const linesRef = useRef<HTMLDivElement[]>([]);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Animation de révélation de l'image - simple et propre
        if (imageRef.current) {
            const img = imageRef.current.querySelector("img");
            
            // Image commence invisible et légèrement décalée
            gsap.set(imageRef.current, { 
                opacity: 0
            });
            
            // Fade in de l'image
            tl.to(imageRef.current, {
                opacity: 1,
                duration: 1.2,
                ease: "power2.out",
            }, 0.3);
            
            // Image zoom out + deblur simultané
            if (img) {
                tl.fromTo(
                    img,
                    { scale: 1.2, filter: "blur(6px)" },
                    { scale: 1, filter: "blur(0px)", duration: 1.6, ease: "power2.out" },
                    0.3
                );
            }
        }

        // Animation d'entrée du titre
        const titleChars = titleRef.current?.querySelectorAll(".char");
        if (titleChars) {
            tl.fromTo(
                titleChars,
                { y: 120, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.04,
                    ease: "power4.out",
                },
                0.5
            );
        }

        // Animation des lignes décoratives
        if (linesRef.current.length > 0) {
            tl.fromTo(
                linesRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power4.out",
                },
                0.8
            );
        }

        // Animation du sous-titre avec split text en lignes (style Osmo)
        if (subtitleRef.current) {
            const subtitleLines = subtitleRef.current.querySelectorAll(".subtitle-line");
            if (subtitleLines.length > 0) {
                tl.fromTo(
                    subtitleLines,
                    { yPercent: 110 },
                    {
                        yPercent: 0,
                        duration: 0.8,
                        stagger: 0.08,
                        ease: "osmo-ease",
                    },
                    1
                );
            }
        }

        // Animation de la ligne sous le paragraphe
        if (subtitleLineRef.current) {
            tl.fromTo(
                subtitleLineRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 0.8,
                    ease: "power4.out",
                },
                1.2
            );
        }

        // Animation du bouton
        if (buttonRef.current) {
            tl.fromTo(
                buttonRef.current,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                },
                1.3
            );
        }

        // Animation de l'annotation
        const annotation = sectionRef.current?.querySelector(".annotation");
        if (annotation) {
            tl.fromTo(
                annotation,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                },
                0.4
            );
        }

        // Animation de la barre d'info en bas
        const infoItems = sectionRef.current?.querySelectorAll(".info-item");
        if (infoItems) {
            tl.fromTo(
                infoItems,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                },
                1.4
            );
        }

        // Parallax effect sur l'image au scroll
        if (imageRef.current) {
            gsap.to(imageRef.current, {
                yPercent: 20,
                scale: 1.1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }

        // Parallax du titre (plus lent que l'image)
        if (titleRef.current) {
            gsap.to(titleRef.current, {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }

        // Fade du contenu au scroll
        const contentElements = sectionRef.current?.querySelector(".hero-content");
        if (contentElements) {
            gsap.to(contentElements, {
                opacity: 0,
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "30% top",
                    end: "60% top",
                    scrub: true,
                },
            });
        }
    }, { scope: sectionRef });

    // Split title into characters
    const splitTitle = (text: string) => {
        return text.split("").map((char, i) => (
            <span
                key={i}
                className="char inline-block"
                style={{ fontSize: "inherit", lineHeight: "inherit" }}
            >
                {char === " " ? "\u00A0" : char}
            </span>
        ));
    };

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[var(--beige)]"
        >
            {/* Gradient background style Leandra 
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--beige)] via-[#EDE4D3] to-[#E5D9C3] z-0" />*/}

            {/* Background Image */}
            <div
                ref={imageRef}
                className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 z-0 overflow-hidden"
            >
                <Image
                    src="/images/hero5.jpg"
                    alt="Soins infirmiers professionnels"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={100}
                />
                {/* Overlay gradient pour lisibilité - un seul layer propre */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--beige)] via-[var(--beige)]/50 to-transparent z-[1]" />
            </div>

            {/* Content */}
            <div className="hero-content container mx-auto px-6 relative z-10 pt-32 md:pt-40">
                {/* Annotation */}
                <div className="mb-6 md:mb-8">
                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--accent)]">
                        (cabinet infirmier)
                    </span>
                </div>

                {/* Decorative line */}
                <div
                    ref={(el) => { if (el) linesRef.current[0] = el; }}
                    className="w-20 h-[2px] bg-[var(--accent)] mb-8 origin-left"
                />

                {/* Main Title */}
                <h1
                    ref={titleRef}
                    className="text-[clamp(3.5rem,12vw,10rem)] font-serif text-[var(--foreground)] mb-6 md:mb-8 overflow-hidden leading-[0.9] tracking-[-0.03em] drop-shadow-gray-500 drop-shadow-lg"
                >
                    {splitTitle("HARMONIE")}
                </h1>

                {/* Second line */}
                <div
                    ref={(el) => { if (el) linesRef.current[1] = el; }}
                    className="w-32 h-px bg-[var(--foreground)]/20 mb-8 origin-left"
                />

                {/* Subtitle - Split text avec masque de lignes (style Osmo) */}
                <div className="max-w-xl">
                    <div
                        ref={subtitleRef}
                        className="text-base md:text-lg lg:text-xl font-light text-[var(--foreground)]/70 leading-tight"
                    >
                        {/* Ligne 1 */}
                        <span className="block overflow-hidden">
                            <span className="subtitle-line block">
                                Des soins infirmiers{" "}
                                <span className="text-[var(--accent)] font-normal">personnalisés</span> et
                            </span>
                        </span>
                        {/* Ligne 2 */}
                        <span className="block overflow-hidden">
                            <span className="subtitle-line block">
                                <span className="text-[var(--accent)] font-normal">bienveillants</span>,
                                au service de votre santé
                            </span>
                        </span>
                        {/* Ligne 3 */}
                        <span className="block overflow-hidden">
                            <span className="subtitle-line block">
                                et de votre bien-être.
                            </span>
                        </span>
                    </div>
                    {/* Ligne animée sous le paragraphe */}
                    <div 
                        ref={subtitleLineRef}
                        className="w-full h-px bg-gradient-to-r from-[var(--accent)]/50 to-transparent mt-6 origin-left"
                    />
                </div>

                {/* CTA Button */}
                <div className="mt-10 md:mt-12">
                    <a
                        ref={buttonRef}
                        href="/demande/soins"
                        className="group inline-flex items-center gap-4 px-8 py-4 bg-[var(--foreground)] text-[var(--beige)] hover:bg-[var(--accent)] transition-all duration-500 text-xs font-medium uppercase tracking-[0.2em] rounded-sm"
                    >
                        <span>Prendre rendez-vous</span>
                        <svg 
                            className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2"
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                        >
                            <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                        </svg>
                    </a>
                </div>

                {/* Side decoration */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6">
                    <div className="w-px h-16 bg-[var(--accent)]/40" />
                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--foreground)]/60 vertical-text px-2 py-3 bg-[var(--beige-dark)]/80 backdrop-blur-sm rounded border border-[var(--foreground)]/10">
                        Nontron • Dordogne
                    </span>
                    <div className="w-px h-16 bg-[var(--accent)]/40" />
                </div>
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--foreground)]/10 z-10">
                <div className="container mx-auto px-6 py-5 md:py-6 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-8 md:gap-16">
                        <div className="info-item">
                            <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] block mb-1">
                                Localisation
                            </span>
                            <span className="text-sm text-[var(--foreground)]">MSP Nontron, 24300</span>
                        </div>
                        <div className="info-item hidden md:block">
                            <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] block mb-1">
                                Horaires
                            </span>
                            <span className="text-sm text-[var(--foreground)]">7j/7 • 6h30 - 20h</span>
                        </div>
                        <div className="info-item hidden lg:block">
                            <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] block mb-1">
                                Contact
                            </span>
                            <span className="text-sm text-[var(--foreground)]">05 53 56 03 03</span>
                        </div>
                    </div>
                    <div className="info-item flex items-center gap-3">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
                        </span>
                        <span className="text-sm text-[var(--foreground)]">Disponible maintenant</span>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 z-10">
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--foreground)]/40">
                    Scroll
                </span>
                <div className="w-px h-12 bg-gradient-to-b from-[var(--accent)] to-transparent relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-4 bg-[var(--accent)] animate-pulse" 
                         style={{ animation: "scrollLine 1.5s ease-in-out infinite" }} />
                </div>
            </div>
        </section>
    );
}

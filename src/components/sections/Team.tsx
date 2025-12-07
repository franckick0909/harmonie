"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const team = [
    {
        name: "Marie Dupont",
        role: "Infirmière Coordinatrice",
        image: "/images/hero2.jpg",
        description: "Avec 15 ans d'expérience en soins à domicile, Marie coordonne l'ensemble de l'équipe et assure la qualité des soins prodigués. Sa vision et son leadership ont permis de construire une équipe soudée et performante.",
        speciality: "Coordination & Management",
        featured: true,
    },
    {
        name: "Sophie Martin",
        role: "Infirmière DE",
        image: "/images/hero4.jpg",
        description: "Sophie accompagne les patients et leurs familles dans les moments les plus délicats avec compassion et professionnalisme. Son approche humaine fait toute la différence.",
        speciality: "Soins Palliatifs",
        featured: false,
    },
    {
        name: "Claire Bernard",
        role: "Infirmière DE",
        image: "/images/hero5.jpg",
        description: "Claire excelle dans la prise en charge des plaies chroniques et complexes. Sa rigueur et son expertise technique garantissent des soins de haute qualité.",
        speciality: "Pansements Complexes",
        featured: false,
    },
    {
        name: "Isabelle Moreau",
        role: "Infirmière DE",
        image: "/images/hero3.jpg",
        description: "Isabelle accompagne les patients diabétiques au quotidien, de l'éducation thérapeutique au suivi régulier. Son approche pédagogique aide chaque patient à mieux vivre avec sa maladie.",
        speciality: "Suivi Diabétique",
        featured: false,
    },
    {
        name: "Nathalie Petit",
        role: "Infirmière DE",
        image: "/images/hero2.jpg",
        description: "Nathalie assure un suivi post-opératoire rigoureux et bienveillant. Sa réactivité et son sens du détail permettent une récupération optimale des patients.",
        speciality: "Soins Post-Opératoires",
        featured: false,
    },
];

export default function Team() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const featuredRef = useRef<HTMLDivElement>(null);
    const membersRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    const featuredMember = team.find(m => m.featured);
    const otherMembers = team.filter(m => !m.featured);

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
                        toggleActions: "play none none none",
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
                            toggleActions: "play none none none",
                        },
                    }
                );
            }
        }

        // Animation du membre featured
        if (featuredRef.current) {
            const featuredImage = featuredRef.current.querySelector(".featured-image");
            const featuredContent = featuredRef.current.querySelectorAll(".featured-content");

            if (featuredImage) {
                gsap.fromTo(
                    featuredImage,
                    { clipPath: "inset(0% 100% 0% 0%)" },
                    {
                        clipPath: "inset(0% 0% 0% 0%)",
                        duration: 1.4,
                        ease: "power4.inOut",
                        scrollTrigger: {
                            trigger: featuredRef.current,
                            start: "top 75%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }

            gsap.fromTo(
                featuredContent,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: featuredRef.current,
                        start: "top 70%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }

        // Animation des autres membres
        if (membersRef.current) {
            const memberItems = membersRef.current.querySelectorAll(".member-item");

            memberItems.forEach((item, index) => {
                const image = item.querySelector(".member-image");
                const content = item.querySelectorAll(".member-content");
                const line = item.querySelector(".member-line");
                const isEven = index % 2 === 0;

                if (image) {
                    gsap.fromTo(
                        image,
                        { clipPath: isEven ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)" },
                        {
                            clipPath: "inset(0% 0% 0% 0%)",
                            duration: 1.2,
                            ease: "power4.inOut",
                            scrollTrigger: {
                                trigger: item,
                                start: "top 80%",
                                toggleActions: "play none none none",
                            },
                        }
                    );
                }

                gsap.fromTo(
                    content,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.08,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 75%",
                            toggleActions: "play none none none",
                        },
                    }
                );

                if (line) {
                    gsap.fromTo(
                        line,
                        { scaleX: 0 },
                        {
                            scaleX: 1,
                            duration: 1,
                            ease: "power4.out",
                            scrollTrigger: {
                                trigger: item,
                                start: "top 80%",
                                toggleActions: "play none none none",
                            },
                        }
                    );
                }
            });
        }

        // Animation du CTA
        if (ctaRef.current) {
            gsap.fromTo(
                ctaRef.current.querySelectorAll(".cta-reveal"),
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ctaRef.current,
                        start: "top 90%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            id="team"
            className="relative py-32 md:py-48 bg-[var(--beige)] overflow-hidden"
        >
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--accent)]/5 to-transparent pointer-events-none" />
            
            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, var(--accent) 1px, transparent 0)`,
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section header */}
                <div ref={headerRef} className="flex items-start justify-between mb-20 md:mb-32">
                    <div>
                        <span className="reveal-item text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] block mb-4">
                            (notre équipe)
                        </span>
                        <div className="header-line w-16 h-[2px] bg-[var(--accent)] mb-6 origin-left" />
                        <h2 className="reveal-item text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--foreground)] leading-[1.1]">
                            Précision dans
                            <br />
                            <span className="text-[var(--accent)]">chaque geste</span>
                        </h2>
                    </div>
                    <span className="reveal-item section-number text-[var(--foreground)]/30 hidden md:block">
                        03
                    </span>
                </div>

                {/* Featured Member - Coordinatrice */}
                {featuredMember && (
                    <div ref={featuredRef} className="mb-24 md:mb-40">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            {/* Image */}
                            <motion.div 
                                className="featured-image relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden"
                                whileHover="hover"
                                initial="idle"
                            >
                                <div className="absolute inset-0 scale-[1.1]">
                                    <Image
                                        src={featuredMember.image}
                                        alt={featuredMember.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                
                                {/* Overlay */}
                                <motion.div
                                    className="absolute inset-0 bg-black/20"
                                    variants={{
                                        idle: { opacity: 0.2 },
                                        hover: { opacity: 0.4 }
                                    }}
                                    transition={{ duration: 0.4 }}
                                />
                                
                                {/* Decorative frame */}
                                <motion.div
                                    className="absolute inset-6 border border-[var(--accent)]/40 pointer-events-none"
                                    variants={{
                                        idle: { opacity: 0 },
                                        hover: { opacity: 1 }
                                    }}
                                    transition={{ duration: 0.4 }}
                                />

                                {/* Badge */}
                                <div className="absolute top-6 left-6 bg-[var(--accent)] text-[var(--dark-brown)] px-4 py-2">
                                    <span className="text-[10px] font-medium uppercase tracking-[0.15em]">
                                        Coordinatrice
                                    </span>
                                </div>
                            </motion.div>

                            {/* Content */}
                            <div className="lg:pl-8">
                                <span className="featured-content text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] block mb-4">
                                    (01) — {featuredMember.speciality}
                                </span>
                                
                                <h3 className="featured-content text-3xl md:text-4xl lg:text-5xl font-serif text-[var(--foreground)] mb-6">
                                    {featuredMember.name}
                                </h3>
                                
                                <p className="featured-content text-xs text-[var(--foreground)]/40 uppercase tracking-[0.15em] mb-8">
                                    {featuredMember.role}
                                </p>
                                
                                <div className="featured-content h-px w-24 bg-[var(--accent)] mb-8" />
                                
                                <p className="featured-content text-lg md:text-xl text-[var(--foreground)]/60 leading-relaxed mb-8">
                                    {featuredMember.description}
                                </p>

                                <div className="featured-content flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border border-[var(--accent)]/30 flex items-center justify-center">
                                        <span className="text-[var(--accent)] text-sm font-serif">15</span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--foreground)] text-sm block">Années</span>
                                        <span className="text-[var(--foreground)]/40 text-xs">d'expérience</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Team Members - Editorial Layout */}
                <div ref={membersRef} className="space-y-20 md:space-y-32">
                    {otherMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            className="member-item"
                            initial="idle"
                            whileHover="hover"
                        >
                            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                                index % 2 === 1 ? 'lg:direction-rtl' : ''
                            }`}>
                                {/* Image - alternating sides */}
                                <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2 lg:col-start-8' : 'lg:order-1'}`}>
                                    <div className="member-image relative aspect-[4/5] overflow-hidden">
                                        <div className="absolute inset-0 scale-[1.15]">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover transition-transform duration-700"
                                            />
                                        </div>
                                        
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--beige)]/60 via-transparent to-transparent" />
                                        
                                        {/* Number overlay */}
                                        <div className="absolute bottom-6 left-6">
                                            <span className="text-6xl md:text-7xl font-serif text-[var(--foreground)]/10">
                                                {String(index + 2).padStart(2, "0")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className={`lg:col-span-6 ${index % 2 === 1 ? 'lg:order-1 lg:col-start-1 lg:text-right' : 'lg:order-2 lg:col-start-7'}`}>
                                    <span className="member-content text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] block mb-3">
                                        ({String(index + 2).padStart(2, "0")}) — {member.speciality}
                                    </span>
                                    
                                    <h3 className="member-content text-2xl md:text-3xl lg:text-4xl font-serif text-[var(--foreground)] mb-2 hover:text-[var(--accent)] transition-colors duration-500">
                                        {member.name}
                                    </h3>
                                    
                                    <p className="member-content text-xs text-[var(--foreground)]/40 uppercase tracking-[0.15em] mb-6">
                                        {member.role}
                                    </p>
                                    
                                    <div className={`member-line h-px w-16 bg-[var(--accent)]/50 mb-6 ${index % 2 === 1 ? 'lg:ml-auto' : ''} origin-left`} />
                                    
                                    <p className="member-content text-base text-[var(--foreground)]/50 leading-relaxed mb-6">
                                        {member.description}
                                    </p>

                                    {/* Arrow link */}
                                    <motion.div 
                                        className={`member-content flex items-center gap-3 text-[var(--foreground)]/40 hover:text-[var(--accent)] transition-colors duration-300 cursor-pointer ${index % 2 === 1 ? 'lg:justify-end' : ''}`}
                                        variants={{
                                            idle: {},
                                            hover: {}
                                        }}
                                    >
                                        <span className="text-xs uppercase tracking-[0.15em]">En savoir plus</span>
                                        <motion.svg
                                            className="w-4 h-4"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            variants={{
                                                idle: { x: 0 },
                                                hover: { x: 5 }
                                            }}
                                            transition={{ duration: 0.3, ease: [0.625, 0.05, 0, 1] }}
                                        >
                                            <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                                        </motion.svg>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <div
                    ref={ctaRef}
                    className="relative pt-20 md:pt-32 mt-20 md:mt-32"
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[var(--accent)]/50 via-[var(--foreground)]/10 to-transparent" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="cta-reveal text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] block mb-4">
                                (rejoignez-nous)
                            </span>
                            <h3 className="cta-reveal text-2xl md:text-3xl lg:text-4xl font-serif text-[var(--foreground)] mb-6">
                                Envie de faire partie
                                <br />
                                de l&apos;aventure ?
                            </h3>
                            <p className="cta-reveal text-base text-[var(--foreground)]/40 leading-relaxed max-w-md">
                                Nous recherchons des professionnels passionnés qui partagent nos valeurs d&apos;excellence et de bienveillance.
                            </p>
                        </div>
                        
                        <div className="lg:text-right">
                            <a
                                href="#contact"
                                className="cta-reveal group inline-flex items-center gap-6 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-500"
                            >
                                <span className="text-lg md:text-xl font-serif">Rejoindre l&apos;équipe</span>
                                <div className="w-14 h-14 rounded-full border border-[var(--accent)]/30 flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] transition-all duration-500">
                                    <svg
                                        className="w-5 h-5 text-[var(--accent)] group-hover:text-[var(--dark-brown)] transition-all duration-500 group-hover:translate-x-1"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                    >
                                        <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                                    </svg>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />
        </section>
    );
}

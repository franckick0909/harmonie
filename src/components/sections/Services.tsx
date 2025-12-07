"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, useMotionValue, useSpring } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: "01",
        title: "Soins Techniques",
        subtitle: "Injections & Prélèvements",
        description: "Injections intramusculaires, sous-cutanées, intraveineuses. Prélèvements sanguins et analyses à domicile.",
        image: "/images/hero3.jpg",
    },
    {
        id: "02",
        title: "Pansements",
        subtitle: "Soins complexes",
        description: "Pansements simples et complexes, soins de plaies chroniques, ulcères, escarres. Suivi post-opératoire.",
        image: "/images/hero4.jpg",
    },
    {
        id: "03",
        title: "Nursing",
        subtitle: "Soins d'hygiène",
        description: "Toilette complète ou partielle, aide à l'habillage, prévention des escarres, maintien de l'autonomie.",
        image: "/images/hero5.jpg",
    },
    {
        id: "04",
        title: "Suivi Diabétique",
        subtitle: "Glycémie & Insuline",
        description: "Surveillance glycémique, injections d'insuline, éducation thérapeutique personnalisée.",
        image: "/images/hero2.jpg",
    },
    {
        id: "05",
        title: "Soins Palliatifs",
        subtitle: "Accompagnement",
        description: "Accompagnement et confort des patients en fin de vie, soutien aux familles.",
        image: "/images/hero3.jpg",
    },
    {
        id: "06",
        title: "Perfusions",
        subtitle: "Traitements IV",
        description: "Hydratation, antibiothérapie, nutrition parentérale à domicile.",
        image: "/images/hero4.jpg",
    },
];

export default function Services() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const constraintsRef = useRef<HTMLDivElement>(null);
    
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [constraintRight, setConstraintRight] = useState(0);
    
    // Mouse position for custom cursor
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Smooth cursor movement
    const cursorX = useSpring(mouseX, { stiffness: 500, damping: 50 });
    const cursorY = useSpring(mouseY, { stiffness: 500, damping: 50 });

    // Calculate carousel constraints
    useEffect(() => {
        const updateConstraints = () => {
            if (carouselRef.current && constraintsRef.current) {
                const carouselWidth = carouselRef.current.scrollWidth;
                const containerWidth = constraintsRef.current.offsetWidth;
                setConstraintRight(-(carouselWidth - containerWidth + 48));
            }
        };
        
        updateConstraints();
        window.addEventListener("resize", updateConstraints);
        return () => window.removeEventListener("resize", updateConstraints);
    }, []);

    // Track mouse position relative to viewport
    const handleMouseMove = (e: React.MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };

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

        // Animation des cards au scroll
        if (carouselRef.current) {
            const cards = carouselRef.current.querySelectorAll(".service-card");
            
            gsap.fromTo(
                cards,
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: carouselRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }
    }, { scope: sectionRef });

    return (
        <section 
            ref={sectionRef}
            id="services" 
            className="relative py-24 md:py-32 bg-[var(--beige)] overflow-hidden"
        >
            <div className="container mx-auto px-6">
                {/* Section header */}
                <div ref={headerRef} className="flex items-end justify-between mb-12 md:mb-16">
                    <div>
                        <h2 className="reveal-item text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--foreground)] leading-[1.1]">
                            Nos services
                        </h2>
                </div>

                    {/* View all link */}
                    <a
                        href="#contact"
                        className="reveal-item group hidden md:inline-flex items-center gap-3 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-300"
                    >
                    <motion.div
                            className="w-12 h-12 border border-current rounded-full flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                            </svg>
                            </motion.div>
                        <span className="text-base font-medium">Voir tout</span>
                    </a>
                </div>
                        </div>

            {/* Draggable Carousel */}
            <div 
                ref={constraintsRef}
                className="relative carousel-container"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Custom Cursor "drag" - Fixed position */}
                <motion.div
                    className="pointer-events-none fixed z-[100] flex items-center justify-center"
                    style={{
                        left: cursorX,
                        top: cursorY,
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                        opacity: isHovering ? 1 : 0,
                        scale: isDragging ? 0.8 : 1,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    <div className="w-20 h-20 bg-[var(--foreground)] rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 shadow-lg">
                        <span className="text-[var(--beige)] text-sm font-medium tracking-wide">
                            glisser
                        </span>
                        </div>
                    </motion.div>

                <motion.div
                    ref={carouselRef}
                    className="flex gap-5 pl-6 md:pl-[max(24px,calc((100vw-1280px)/2+24px))] pr-6"
                    drag="x"
                    dragConstraints={{ left: constraintRight, right: 0 }}
                    dragElastic={0.05}
                    dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                >
                    {services.map((service) => (
                            <motion.div
                                key={service.id}
                            className="service-card shrink-0 w-[380px] md:w-[450px] lg:w-[540px]"
                            animate={{
                                scale: isDragging ? 0.96 : 1,
                            }}
                            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                            {/* Card with hover border */}
                            <motion.div 
                                className="group relative bg-transparent"
                                initial="idle"
                                whileHover="hover"
                            >
                                {/* Image Container with padding for border effect */}
                                <div className="relative mb-6">
                                    {/* Hover border with padding */}
                                    <motion.div
                                        className="absolute -inset-1.5 border border-[var(--foreground)] rounded-sm z-20 pointer-events-none"
                                        variants={{
                                            idle: { opacity: 0 },
                                            hover: { opacity: 1 }
                                        }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    />
                                    
                                    {/* Image wrapper */}
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            draggable={false}
                                        />
                                        
                                        {/* Subtle overlay on hover */}
                                        <motion.div 
                                            className="absolute inset-0 bg-[var(--foreground)]/0 transition-colors duration-500 group-hover:bg-[var(--foreground)]/5"
                                        />
                                    </div>
                                    
                                    {/* Number badge */}
                                    <div className="absolute top-5 left-5 w-11 h-11 rounded-full bg-[var(--beige)] flex items-center justify-center z-10">
                                        <span className="text-[var(--foreground)] text-sm font-medium">
                                            {service.id}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-serif text-[var(--foreground)] mb-3 leading-tight">
                                            {service.title}
                                        </h3>
                                    
                                    {/* Learn more link */}
                                    <a 
                                        href="#contact"
                                        className="inline-flex items-center gap-3 text-[var(--foreground)]/60 hover:text-[var(--accent)] transition-colors duration-300 group/link"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <motion.div
                                            className="w-9 h-9 border border-current rounded-full flex items-center justify-center"
                                            whileHover={{ scale: 1.1, x: 3 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <svg
                                                className="w-4 h-4"
                                        viewBox="0 0 24 24" 
                                                fill="currentColor"
                                    >
                                                <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                                    </svg>
                                        </motion.div>
                                        <span className="text-sm font-medium">En savoir plus</span>
                                    </a>
                                </div>
                            </motion.div>
                            </motion.div>
                        ))}

                    {/* Spacer at end */}
                    <div className="shrink-0 w-6" />
                </motion.div>
                </div>

            {/* Decorative line at bottom */}
            <div className="container mx-auto px-6 mt-20">
                <div className="h-px bg-[var(--foreground)]/10" />
            </div>
        </section>
    );
}

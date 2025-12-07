"use client";

import { useRef, useEffect } from "react";
import React from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    children?: React.ReactNode;
    text: string; // Le texte à animer
}

export function AnimatedButton({ children, text, className = "", ...props }: AnimatedButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLSpanElement>(null);
    const isAnimatingRef = useRef(false);
    const currentTlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!containerRef.current || !buttonRef.current) return;

        // Diviser le texte en caractères
        const textContent = text || "";
        containerRef.current.innerHTML = "";

        const chars: HTMLSpanElement[] = [];
        const charsDuplicate: HTMLSpanElement[] = [];

        // Créer un wrapper pour chaque caractère avec overflow hidden strict
        textContent.split("").forEach((char) => {
            const charWrapper = document.createElement("span");
            charWrapper.className = "char-wrapper inline-block relative";
            charWrapper.style.overflow = "hidden";
            charWrapper.style.height = "1.2em";
            charWrapper.style.verticalAlign = "top";
            charWrapper.style.lineHeight = "1.2em";

            // Caractère original (ligne du haut) - visible par défaut
            const charSpan = document.createElement("span");
            charSpan.className = "char inline-block";
            charSpan.style.transformStyle = "preserve-3d";
            charSpan.style.width = "100%";
            charSpan.textContent = char === " " ? "\u00A0" : char;
            charWrapper.appendChild(charSpan);
            chars.push(charSpan);

            // Caractère dupliqué (ligne du bas qui monte) - caché par défaut
            const charSpanDuplicate = document.createElement("span");
            charSpanDuplicate.className = "char-duplicate inline-block absolute";
            charSpanDuplicate.style.transformStyle = "preserve-3d";
            charSpanDuplicate.style.left = "0";
            charSpanDuplicate.style.top = "100%";
            charSpanDuplicate.style.width = "100%";
            charSpanDuplicate.textContent = char === " " ? "\u00A0" : char;
            charWrapper.appendChild(charSpanDuplicate);
            charsDuplicate.push(charSpanDuplicate);

            containerRef.current?.appendChild(charWrapper);
        });

        // Initialiser les positions avec yPercent pour s'adapter à toutes les tailles
        // Les chars originaux sont visibles, les dupliqués sont cachés en bas
        gsap.set(chars, { yPercent: 0 });
        gsap.set(charsDuplicate, { yPercent: 100 });

        // Timeline pour l'animation d'entrée (mouseenter)
        const tlEnter = gsap.timeline({
            paused: true,
            onComplete: () => {
                isAnimatingRef.current = false;
            },
        });

        // Animer les caractères originaux : montent
        tlEnter.to(
            chars,
            {
                duration: 0.5,
                yPercent: -100,
                stagger: 0.05,
                ease: "power2.out",
            }
        );

        // Animer les caractères dupliqués : montent depuis le bas (en même temps)
        tlEnter.to(
            charsDuplicate,
            {
                duration: 0.5,
                yPercent: -100,
                stagger: 0.05,
                ease: "power2.out",
            },
            "<" // Commence en même temps que l'animation précédente
        );

        // Timeline pour l'animation de sortie (mouseleave) - inverse
        const tlLeave = gsap.timeline({
            paused: true,
            onComplete: () => {
                isAnimatingRef.current = false;
            },
        });

        // Les caractères dupliqués redescendent
        tlLeave.to(
            charsDuplicate,
            {
                duration: 0.5,
                yPercent: 100,
                stagger: 0.05,
                ease: "power2.in",
            }
        );

        // Les caractères originaux redescendent (en même temps)
        tlLeave.to(
            chars,
            {
                duration: 0.5,
                yPercent: 0,
                stagger: 0.05,
                ease: "power2.in",
            },
            "<"
        );

        // Gestionnaires d'événements sur le bouton
        const handleMouseEnter = () => {
            if (isAnimatingRef.current) return;
            isAnimatingRef.current = true;
            // Tuer l'animation de sortie si elle est en cours
            if (currentTlRef.current) {
                currentTlRef.current.kill();
            }
            currentTlRef.current = tlEnter;
            tlEnter.restart();
        };

        const handleMouseLeave = () => {
            if (isAnimatingRef.current) return;
            isAnimatingRef.current = true;
            // Tuer l'animation d'entrée si elle est en cours
            if (currentTlRef.current) {
                currentTlRef.current.kill();
            }
            currentTlRef.current = tlLeave;
            tlLeave.restart();
        };

        const button = buttonRef.current;
        button.addEventListener("mouseenter", handleMouseEnter);
        button.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            button.removeEventListener("mouseenter", handleMouseEnter);
            button.removeEventListener("mouseleave", handleMouseLeave);
            if (tlEnter) tlEnter.kill();
            if (tlLeave) tlLeave.kill();
        };
    }, [text]);

    return (
        <button
            ref={buttonRef}
            className={cn("relative", className)}
            {...props}
        >
            <span ref={containerRef} className="relative z-10 inline-block">
                {text}
            </span>
            {children}
        </button>
    );
}


"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface AnimatedTextProps {
    children: string;
    className?: string;
    as?: "span" | "div";
    triggerOnParent?: boolean; // Si true, écoute les événements du parent au lieu de l'élément lui-même
}

export function AnimatedText({ children, className = "", as: Component = "span", triggerOnParent = false }: AnimatedTextProps) {
    const containerRef = useRef<HTMLElement>(null);
    const isAnimatingRef = useRef(false);
    const currentTlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Diviser le texte en caractères
        const text = containerRef.current.textContent || "";
        containerRef.current.innerHTML = "";

        const chars: HTMLSpanElement[] = [];
        const charsDuplicate: HTMLSpanElement[] = [];

        // Créer un wrapper pour chaque caractère avec overflow hidden strict
        const textToSplit = text || "";
        textToSplit.split("").forEach((char) => {
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
        gsap.set(chars, { yPercent: 0, opacity: 1 });
        gsap.set(charsDuplicate, { yPercent: 100, opacity: 0 });

        // Timeline pour l'animation d'entrée (mouseenter)
        const tlEnter = gsap.timeline({
            paused: true,
            onComplete: () => {
                isAnimatingRef.current = false;
            },
        });

        // Animer les caractères originaux : montent et disparaissent
        tlEnter.to(
            chars,
            {
                duration: 0.5,
                yPercent: -100,
                opacity: 0,
                stagger: 0.05,
                ease: "power2.out",
            }
        );

        // Animer les caractères dupliqués : montent depuis le bas et apparaissent (en même temps)
        tlEnter.to(
            charsDuplicate,
            {
                duration: 0.5,
                yPercent: -100,
                opacity: 1,
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

        // Les caractères dupliqués redescendent et disparaissent
        tlLeave.to(
            charsDuplicate,
            {
                duration: 0.5,
                yPercent: 100,
                opacity: 0,
                stagger: 0.05,
                ease: "power2.in",
            }
        );

        // Les caractères originaux redescendent et réapparaissent (en même temps)
        tlLeave.to(
            chars,
            {
                duration: 0.5,
                yPercent: 0,
                opacity: 1,
                stagger: 0.05,
                ease: "power2.in",
            },
            "<"
        );

        // Gestionnaires d'événements
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

        const element = containerRef.current;
        let targetElement = element;

        if (triggerOnParent && containerRef.current) {
            // Remonter dans la hiérarchie pour trouver le bouton ou l'élément parent approprié
            let parent = containerRef.current.parentElement;
            let depth = 0;
            const maxDepth = 10; // Augmenter la profondeur pour être sûr de trouver le bouton
            
            while (parent && depth < maxDepth) {
                const tagName = parent.tagName?.toUpperCase();
                if (tagName === 'BUTTON' || tagName === 'A') {
                    targetElement = parent;
                    break;
                }
                // Si on trouve un élément avec la classe group, c'est aussi un bon candidat
                if (parent.classList?.contains('group')) {
                    targetElement = parent;
                    break;
                }
                parent = parent.parentElement;
                depth++;
            }
            
            // Si on n'a pas trouvé de bouton/lien, utiliser le parent direct
            if (targetElement === element && containerRef.current.parentElement) {
                targetElement = containerRef.current.parentElement;
            }
        }

        // S'assurer qu'on a un élément valide avant d'ajouter les listeners
        // Utiliser une petite délai pour s'assurer que le DOM est bien monté
        const attachListeners = () => {
            if (targetElement && targetElement !== element) {
                // Utiliser capture pour s'assurer que les événements sont bien capturés
                targetElement.addEventListener("mouseenter", handleMouseEnter, true);
                targetElement.addEventListener("mouseleave", handleMouseLeave, true);
            } else if (element) {
                element.addEventListener("mouseenter", handleMouseEnter);
                element.addEventListener("mouseleave", handleMouseLeave);
            }
        };

        // Attacher les listeners immédiatement et aussi après un petit délai pour s'assurer
        attachListeners();
        const timeoutId = setTimeout(attachListeners, 0);

        return () => {
            clearTimeout(timeoutId);
            if (targetElement && targetElement !== element) {
                targetElement.removeEventListener("mouseenter", handleMouseEnter, true);
                targetElement.removeEventListener("mouseleave", handleMouseLeave, true);
            } else if (element) {
                element.removeEventListener("mouseenter", handleMouseEnter);
                element.removeEventListener("mouseleave", handleMouseLeave);
            }
            // Tuer les timelines avant de les recréer
            if (tlEnter) tlEnter.kill();
            if (tlLeave) tlLeave.kill();
            // Réinitialiser le flag d'animation
            isAnimatingRef.current = false;
            currentTlRef.current = null;
        };
    }, [children, triggerOnParent]);

    return (
        <Component
            ref={containerRef as React.RefObject<HTMLDivElement>}
            className={`inline-block ${className}`}
        >
            {children}
        </Component>
    );
}


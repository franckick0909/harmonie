"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatedText } from "./AnimatedText";

interface AnimatedLinkProps {
  href: string;
  children: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  arrowSize?: "small" | "medium" | "large";
}

// Composant de flèche utilisant le SVG personnalisé
function StyledArrow({
  size = "medium",
}: {
  size?: "small" | "medium" | "large";
}) {
  const sizes = {
    small: { width: 22, height: 22 },
    medium: { width: 28, height: 28 },
    large: { width: 36, height: 36 },
  };

  const { width, height } = sizes[size];

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
      className="flex-shrink-0"
      viewBox="0 0 24 24"
    >
      <path
        d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AnimatedLink({
  href,
  children,
  className = "",
  onClick,
  arrowSize,
}: AnimatedLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const currentTlRef = useRef<gsap.core.Timeline | null>(null);

  // Déterminer la taille de la flèche automatiquement si non spécifiée
  const getArrowSize = (): "small" | "medium" | "large" => {
    if (arrowSize) return arrowSize;

    // Détecter la taille du texte depuis les classes
    if (
      className.includes("text-xl") ||
      className.includes("text-sm") ||
      className.includes("text-base")
    ) {
      return "small";
    }
    if (className.includes("text-2xl")) {
      return "medium";
    }
    // Par défaut pour text-3xl, text-4xl, text-5xl
    return "large";
  };

  const size = getArrowSize();
  const arrowWidth = size === "small" ? 26 : size === "medium" ? 32 : 40;

  useEffect(() => {
    if (!linkRef.current || !arrowRef.current || !textRef.current) return;

    const link = linkRef.current;
    const arrow = arrowRef.current;
    const text = textRef.current;

    // Fonction pour réinitialiser à l'état de départ
    const resetToInitial = () => {
      gsap.set(arrow, {
        x: -(arrowWidth + 10),
        opacity: 0,
      });
      gsap.set(text, { x: 0 });
    };

    // Initialiser la position de la flèche (cachée à gauche)
    resetToInitial();

    const handleMouseEnter = () => {
      // Tuer l'animation en cours si elle existe
      if (currentTlRef.current) {
        currentTlRef.current.kill();
      }

      // Créer une nouvelle timeline pour animer la flèche et le texte en même temps
      const tl = gsap.timeline();
      currentTlRef.current = tl;

      // La flèche apparaît et se positionne à gauche
      tl.to(arrow, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });

      // Le texte se décale vers la droite pour faire de la place à la flèche
      tl.to(
        text,
        {
          x: arrowWidth + 10, // Espace pour la flèche + marge
          duration: 0.5,
          ease: "power2.out",
        },
        "<"
      ); // Commence en même temps que l'animation de la flèche

      tl.eventCallback("onComplete", () => {
        currentTlRef.current = null;
      });
    };

    const handleMouseLeave = () => {
      // Tuer l'animation en cours si elle existe
      if (currentTlRef.current) {
        currentTlRef.current.kill();
      }

      // Animation inverse - forcer le retour à l'état initial
      const tl = gsap.timeline();
      currentTlRef.current = tl;

      tl.to(arrow, {
        x: -(arrowWidth + 10),
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });

      tl.to(
        text,
        {
          x: 0,
          duration: 0.4,
          ease: "power2.in",
        },
        "<"
      );

      tl.eventCallback("onComplete", () => {
        currentTlRef.current = null;
        // S'assurer que tout est bien réinitialisé
        resetToInitial();
      });
    };

    link.addEventListener("mouseenter", handleMouseEnter);
    link.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      link.removeEventListener("mouseenter", handleMouseEnter);
      link.removeEventListener("mouseleave", handleMouseLeave);
      // Tuer toute animation en cours au démontage
      if (currentTlRef.current) {
        currentTlRef.current.kill();
      }
      resetToInitial();
    };
  }, [arrowWidth]);

  return (
    <Link
      ref={linkRef}
      href={href}
      onClick={onClick}
      className={cn("group relative flex items-center", className)}
    >
      <div
        ref={arrowRef}
        className="absolute left-0 flex items-center justify-center"
        style={{
          height: "0%",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <StyledArrow size={size} />
      </div>
      <span ref={textRef} className="inline-block relative">
        <AnimatedText>{children}</AnimatedText>
      </span>
    </Link>
  );
}

// ============================================
// MENU LINK - Enhanced for menu with underline animation
// ============================================
interface MenuLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MenuLink = ({
  href,
  children,
  onClick,
  className,
}: MenuLinkProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-block text-3xl md:text-4xl lg:text-5xl font-serif font-light italic leading-none transition-all duration-500",
        className
      )}
    >
      <span className="relative inline-flex items-center gap-4">
        {/* Animated dot */}
        <span className="w-2 h-2 rounded-full bg-[#EDDEC5] opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />

        {/* Text content with underline */}
        <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#EDDEC5] after:to-[#F4E6CD] group-hover:after:w-full after:transition-all after:duration-700 after:ease-out">
          {children}
        </span>
      </span>
    </Link>
  );
};

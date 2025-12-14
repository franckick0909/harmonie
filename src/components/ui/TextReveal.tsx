"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  type?: "words" | "chars" | "lines";
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
  stagger?: number;
}

export default function TextReveal({
  children,
  delay = 0,
  duration = 0.8,
  type = "words",
  className = "",
  as: Component = "span",
  stagger = 0.02,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      const text = textRef.current;

      // Animation simple de reveal
      gsap.fromTo(
        text,
        {
          y: 40,
          opacity: 0,
          rotateX: -15,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: text,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef, dependencies: [delay, duration, type, stagger] }
  );

  return (
    <Component
      ref={containerRef as unknown as React.RefObject<HTMLDivElement>}
      className={`inline-block overflow-hidden ${className}`}
      style={{ perspective: "1000px" }}
    >
      <span
        ref={textRef}
        className="inline-block will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </span>
    </Component>
  );
}

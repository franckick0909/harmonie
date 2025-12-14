"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import {
  ReactNode,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";

gsap.registerPlugin(CustomEase);

// Créer l'ease Osmo si pas déjà créé
if (!CustomEase.get("osmo-ease")) {
  CustomEase.create("osmo-ease", "0.625, 0.05, 0, 1");
}

interface SplitTextRevealProps {
  children: ReactNode;
  className?: string;
  type?: "lines" | "words" | "chars";
  delay?: number;
  duration?: number;
  stagger?: number;
  trigger?: boolean; // Pour déclencher l'animation manuellement
  onComplete?: () => void;
}

// Extraire du texte depuis n'importe quel ReactNode (safe + typé)
function getTextFromNode(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextFromNode).join("");
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return getTextFromNode(el.props.children);
  }
  return "";
}

export default function SplitTextReveal({
  children,
  className = "",
  type = "lines",
  delay = 0,
  duration,
  stagger,
  trigger = true,
  onComplete,
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const hasAnimated = useRef(false);

  // Configuration par défaut selon le type
  const config = useMemo(() => {
    return {
      lines: { duration: duration ?? 0.8, stagger: stagger ?? 0.08 },
      words: { duration: duration ?? 0.6, stagger: stagger ?? 0.06 },
      chars: { duration: duration ?? 0.4, stagger: stagger ?? 0.008 },
    };
  }, [duration, stagger]);

  useEffect(() => {
    // Attendre que les fonts soient chargées
    document.fonts.ready.then(() => {
      if (!containerRef.current) return;

      const text = getTextFromNode(children);

      if (type === "lines") {
        // Créer un élément temporaire pour calculer les lignes
        const temp = document.createElement("div");
        temp.style.cssText = window.getComputedStyle(
          containerRef.current
        ).cssText;
        temp.style.position = "absolute";
        temp.style.visibility = "hidden";
        temp.style.width = containerRef.current.offsetWidth + "px";
        temp.innerHTML = text;
        document.body.appendChild(temp);

        // Calculer les lignes en utilisant les ranges
        const words = text.split(" ");
        const computedLines: string[] = [];
        let currentLine = "";
        let testLine = "";

        temp.innerHTML = "";
        const span = document.createElement("span");
        temp.appendChild(span);

        words.forEach((word) => {
          testLine = currentLine + (currentLine ? " " : "") + word;
          span.textContent = testLine;

          if (span.offsetWidth > temp.offsetWidth && currentLine) {
            computedLines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });

        if (currentLine) {
          computedLines.push(currentLine);
        }

        document.body.removeChild(temp);
        setLines(computedLines.length > 0 ? computedLines : [text]);
      } else if (type === "words") {
        setLines(text.split(" "));
      } else {
        setLines(text.split(""));
      }

      setIsReady(true);
    });
  }, [children, type]);

  useEffect(() => {
    if (!isReady || !trigger || hasAnimated.current) return;
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(".split-item");
    if (elements.length === 0) return;

    hasAnimated.current = true;
    const { duration: dur, stagger: stag } = config[type];

    gsap.fromTo(
      elements,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: dur,
        stagger: stag,
        delay,
        ease: "osmo-ease",
        onComplete,
      }
    );
  }, [isReady, trigger, type, delay, onComplete, config]);

  // Render avec masque
  if (!isReady) {
    // Placeholder invisible pendant le calcul
    return (
      <div
        ref={containerRef}
        className={className}
        style={{ visibility: "hidden" }}
      >
        {children}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ display: type === "lines" ? "block" : "inline-block" }}
        >
          <span
            className="split-item inline-block"
            style={{
              transform: "translateY(110%)",
              marginRight:
                type === "words" ? "0.25em" : type === "chars" ? "0" : "0",
            }}
          >
            {line}
            {type === "chars" && line === " " ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </div>
  );
}

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

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

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Animation de révélation de l'image - simple et propre
      if (imageRef.current) {
        const img = imageRef.current.querySelector("img");

        // Image commence invisible et légèrement décalée
        gsap.set(imageRef.current, {
          opacity: 0,
        });

        // Fade in de l'image
        tl.to(
          imageRef.current,
          {
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          0.3
        );

        // Image zoom out + deblur simultané
        if (img) {
          tl.fromTo(
            img,
            { scale: 1.2, filter: "blur(6px)" },
            {
              scale: 1,
              filter: "blur(0px)",
              duration: 1.6,
              ease: "power2.out",
            },
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
        const subtitleLines =
          subtitleRef.current.querySelectorAll(".subtitle-line");
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
      const contentElements =
        sectionRef.current?.querySelector(".hero-content");
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
    },
    { scope: sectionRef }
  );

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
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#F4E6CD]"
    >
      {/* Gradient background style Leandra */}
      <div className="absolute inset-0 bg-[#F4E6CD] z-0" />

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
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          quality={75}
        />
        {/* Overlay gradient pour lisibilité - un seul layer propre */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F4E6CD] via-[#F4E6CD]/50 to-transparent z-[1]" />
      </div>

      {/* Content */}
      <div className="hero-content w-full px-2 lg:px-6 py-8 pt-24 md:pt-28 relative z-10 container mx-auto">
        {/* Annotation */}
        <div className="mb-6 md:mb-8">
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#927950]">
            (cabinet infirmier)
          </span>
        </div>

        {/* Decorative line */}
        <div
          ref={(el) => {
            if (el) linesRef.current[0] = el;
          }}
          className="w-20 h-[2px] bg-[#927950] mb-8 origin-left"
        />

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="text-[clamp(3.5rem,12vw,10rem)] font-serif text-[#1E211E] mb-6 md:mb-8 overflow-hidden leading-[0.9] tracking-[-0.03em] drop-shadow-gray-500 drop-shadow-lg"
        >
          {splitTitle("HARMONIE")}
        </h1>

        {/* Second line */}
        <div
          ref={(el) => {
            if (el) linesRef.current[1] = el;
          }}
          className="w-32 h-px bg-[#1E211E]/20 mb-8 origin-left"
        />

        {/* Subtitle - Split text avec masque de lignes (style Osmo) */}
        <div className="max-w-xl">
          <div
            ref={subtitleRef}
            className="text-base md:text-lg lg:text-xl font-light text-[#1E211E] leading-relaxed"
          >
            {/* Mobile / Tablet : highlight all, desktop : highlight only blocks */}
            <span className="block overflow-hidden">
              <span className="subtitle-line block">
                <span className="
                  bg-[#f8ddb3] px-1 rounded font-normal
                  md:bg-transparent md:px-0 md:rounded-none md:font-light
                  ">
                  Des soins infirmiers{" "}
                  <span className="md:bg-[#f8ddb3] md:px-1 md:rounded md:font-normal">
                    personnalisés
                  </span>{" "}
                  et
                </span>
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="subtitle-line block">
                <span className="
                  bg-[#f8ddb3] px-1 rounded font-normal
                  md:bg-transparent md:px-0 md:rounded-none md:font-light
                  "
                >
                  <span className="md:bg-[#f8ddb3] md:px-1 md:rounded md:font-normal">
                    bienveillants
                  </span>
                  , au service de votre santé
                </span>
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="subtitle-line block">
                <span className="
                  bg-[#f8ddb3] px-1 rounded font-normal
                  md:bg-transparent md:px-0 md:rounded-none md:font-light
                  ">
                  et de votre bien-être.
                </span>
              </span>
            </span>
          </div>
          {/* Ligne animée sous le paragraphe */}
          <div
            ref={subtitleLineRef}
            className="w-full h-px bg-gradient-to-r from-[#927950]/50 to-transparent mt-6 origin-left"
          />
        </div>

        {/* CTA Button */}
        <div className="mt-10 md:mt-12">
          <a
            ref={buttonRef}
            href="/demande/soins"
            className="group inline-flex items-center gap-4 px-8 py-4 bg-[#1E211E] text-[#F4E6CD] hover:bg-[#927950] transition-all duration-500 text-xs font-medium uppercase tracking-[0.2em] rounded-sm"
          >
            <span>Prendre rendez-vous</span>
            <svg
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2"
              viewBox="0 0 24 24"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            >
              <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
            </svg>
          </a>
        </div>

        {/* Side decoration */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6">
          <div className="w-px h-16 bg-[#927950]/40" />
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#1E211E]/60 vertical-text px-2 py-3 bg-[#EDDEC5]/80 backdrop-blur-sm rounded border border-[#1E211E]/10">
            Nontron • Dordogne
          </span>
          <div className="w-px h-16 bg-[#927950]/40" />
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#1E211E]/10 z-10 bg-[#F4E6CD]/95 backdrop-blur-sm">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4">
          {/* Grid layout pour tous les écrans */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-2 sm:gap-x-4 md:gap-x-6">
            {/* Localisation */}
            <div className="info-item">
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-medium tracking-[0.1em] uppercase text-[#927950]">
                Localisation
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm text-[#1E211E] block">
                MSP Nontron
              </span>
            </div>

            {/* Horaires */}
            <div className="info-item">
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-medium tracking-[0.1em] uppercase text-[#927950]">
                Horaires
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm text-[#1E211E] block">
                7j/7 • 5h30-20h
              </span>
            </div>

            {/* Secrétariat */}
            <div className="info-item">
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-medium tracking-[0.1em] uppercase text-[#927950]">
                Secrétariat
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm text-[#1E211E] block">
                <span className="hidden sm:inline">Lun-Ven • </span>
                9h-12h/14h-18h
              </span>
            </div>

            {/* Contact */}
            <div className="info-item">
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-medium tracking-[0.1em] uppercase text-[#927950]">
                Contact
              </span>
              <a
                href="tel:0553560456"
                className="text-[10px] sm:text-xs md:text-sm text-[#1E211E] hover:text-[#927950] transition-colors block"
              >
                05 53 56 04 56
              </a>
            </div>

            {/* Disponibilité */}
            <div className="info-item flex items-center gap-1.5 sm:gap-2 col-span-2 sm:col-span-1 justify-center sm:justify-start mt-1 sm:mt-0">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#927950] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#927950]"></span>
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm text-[#1E211E]">
                Disponible
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 z-10">
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#1E211E]/40">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-[#927950] to-transparent relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-4 bg-[#927950] animate-pulse"
            style={{ animation: "scrollLine 1.5s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}

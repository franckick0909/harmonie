"use client";

import TextReveal from "@/components/ui/TextReveal";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    id: 1,
    name: "Hélène ROPARS",
    role: "Infirmière D.E.",
    img: "/images/team/helene.png",
    desc: "Rééducation post-opératoire et soins de plaies complexes avec rigueur.",
  },
  {
    id: 2,
    name: "Florence BROUARD",
    role: "Infirmière D.E.",
    img: "/images/team/flo.png",
    desc: "Expertise en soins techniques et chimiothérapie à domicile. Accompagnement personnalisé.",
  },
  {
    id: 3,
    name: "Émilie CHAPLAIN",
    role: "Infirmière D.E.",
    img: "/images/team/emilie.png",
    desc: "Spécialisée en soins palliatifs et accompagnement de la douleur avec compassion.",
  },
  {
    id: 4,
    name: "Aude LESTRADE-CARBONNEL",
    role: "Infirmière D.E.",
    img: "/images/team/aude.png",
    desc: "Suivi des pathologies chroniques et éducation thérapeutique des patients.",
  },
  {
    id: 5,
    name: "Christine LEVA",
    role: "Infirmière D.E.",
    img: "/images/team/christ.png",
    desc: "Coordination et gestion du cabinet. 15 ans d'expérience en soins intensifs et management d'équipe.",
  },
];

export default function Team() {
  const containerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(1);

  useGSAP(
    () => {
      if (!accordionRef.current) return;

      // Animation d'entrée de l'accordéon
      gsap.fromTo(
        accordionRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: accordionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="team"
      className="relative bg-[#F4E6CD] overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#927950]/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-[#927950]/5 to-transparent pointer-events-none" />

      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #927950 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-12 py-8 pt-24 md:pt-28 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-8">
          <div>
            <TextReveal className="block text-[10px] font-medium uppercase tracking-[0.2em] text-[#927950] mb-6">
              (notre équipe)
            </TextReveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1]">
              <TextReveal className="text-[#1E211E]">Vos</TextReveal>
              <TextReveal className="italic text-[#927950] ml-3 leading-tight">
                Soignantes.
              </TextReveal>
            </h2>
          </div>
          <div className="max-w-md md:text-right">
            <TextReveal
              type="lines"
              className="text-lg font-light text-[#1E211E]/60 leading-relaxed"
            >
              Cinq parcours, cinq expertises, une seule équipe unie pour votre
              santé au quotidien.
            </TextReveal>
          </div>
        </div>

        {/* Editorial Accordion */}
        <div
          ref={accordionRef}
          className="flex flex-col lg:flex-row gap-1 h-auto lg:h-[85vh] lg:min-h-[700px] lg:max-h-[900px] rounded-2xl overflow-hidden shadow-2xl shadow-[#1E211E]/10"
        >
          {team.map((member) => {
            const isActive = activeId === member.id;

            return (
              <div
                key={member.id}
                onMouseEnter={() => setActiveId(member.id)}
                onClick={() => setActiveId(member.id)}
                className={`
                  relative overflow-hidden cursor-pointer
                  transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                  ${isActive ? "lg:flex-[3.5]" : "lg:flex-1"}
                  h-[280px] sm:h-[350px] lg:h-auto
                  group
                `}
              >
                {/* Image */}
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={`
                    object-cover object-top transition-all duration-700 ease-out
                    ${
                      isActive
                        ? "scale-100 brightness-100"
                        : "scale-105 brightness-75 group-hover:brightness-90"
                    }
                  `}
                />

                {/* Gradient Overlay */}
                <div
                  className={`
                  absolute inset-0 transition-all duration-500
                  ${
                    isActive
                      ? "bg-gradient-to-t from-[#1E211E]/70 via-transparent to-transparent"
                      : "bg-gradient-to-t from-[#1E211E]/80 via-[#1E211E]/20 to-[#1E211E]/10 group-hover:from-[#1E211E]/60"
                  }
                `}
                />

                {/* Gold accent line */}
                <div
                  className={`
                  absolute bottom-0 left-0 right-0 h-1 bg-[#927950] 
                  transition-transform duration-500 origin-left
                  ${isActive ? "scale-x-100" : "scale-x-0"}
                `}
                />

                {/* Content */}
                <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-between text-white">
                  {/* Top: Number & Icon */}
                  <div className="flex justify-between items-start">
                    <span
                      className={`
                      text-xs font-mono transition-all duration-500
                      ${isActive ? "text-[#927950]" : "text-white/60"}
                    `}
                    >
                      0{member.id}
                    </span>
                    <div
                      className={`
                      w-10 h-10 rounded-full border flex items-center justify-center 
                      transition-all duration-500
                      ${
                        isActive
                          ? "border-[#927950] bg-[#927950] rotate-45 opacity-100"
                          : "border-white/30 opacity-70 group-hover:opacity-100"
                      }
                    `}
                    >
                      <Plus
                        className={`w-5 h-5 transition-colors duration-500 ${
                          isActive ? "text-white" : "text-white"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Bottom: Info */}
                  <div
                    className={`
                    transition-all duration-500 transform
                    ${isActive ? "translate-y-0" : "translate-y-2"}
                  `}
                  >
                    {/* Role badge */}
                    <span
                      className={`
                      inline-block px-3 py-1 text-[10px] uppercase tracking-widest mb-4
                      transition-all duration-500
                      ${
                        isActive
                          ? "bg-[#927950] text-white"
                          : "bg-white/10 backdrop-blur-sm text-white/80"
                      }
                    `}
                    >
                      {member.role}
                    </span>

                    {/* Name */}
                    <h3
                      className={`
                      font-serif leading-tight mb-3
                      transition-all duration-500
                      ${
                        isActive
                          ? "text-3xl md:text-4xl"
                          : "text-xl md:text-2xl lg:text-xl"
                      }
                    `}
                    >
                      {member.name}
                    </h3>

                    {/* Description - only visible when active */}
                    <div
                      className={`
                      overflow-hidden transition-all duration-700 ease-out
                      ${isActive ? "max-h-32 opacity-100" : "max-h-0 opacity-0"}
                    `}
                    >
                      <div className="border-t border-[#927950]/40 pt-4 mt-2">
                        <p className="text-sm font-light leading-relaxed text-white/80 max-w-sm">
                          {member.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Philosophie Section */}
        <div className="relative pt-16 md:pt-24 mt-16 md:mt-24">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#927950]/50 via-[#1E211E]/10 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <TextReveal className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#927950] block mb-4">
                (notre philosophie)
              </TextReveal>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-[#1E211E] mb-6">
                <TextReveal>Une équipe soudée,</TextReveal>
                <TextReveal className="ml-2"> à votre écoute.</TextReveal>
              </h3>
              <TextReveal
                type="lines"
                className="text-base text-[#1E211E]/50 leading-relaxed max-w-md"
              >
                Ensemble, nous partageons une même vision du soin :
                l&apos;excellence technique alliée à une approche humaine et
                bienveillante.
              </TextReveal>
            </div>

            <div className="lg:text-right">
              <a
                href="#contact"
                className="group inline-flex items-center gap-6 text-[#1E211E] hover:text-[#927950] transition-colors duration-500"
              >
                <span className="text-lg md:text-xl font-serif">
                  Nous contacter
                </span>
                <div className="w-14 h-14 rounded-full border-2 border-[#927950]/30 flex items-center justify-center group-hover:border-[#927950] group-hover:bg-[#927950] transition-all duration-500">
                  <svg
                    className="w-5 h-5 text-[#927950] group-hover:text-white transition-all duration-500 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  >
                    <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#927950]/20 to-transparent" />
    </section>
  );
}

"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const medecins = [
  {
    name: "Dr. CHRAÏBI",
    specialite: "Médecin Généraliste",
    tel: "05 53 56 03 03",
  },
  {
    name: "Dr. IONICA",
    specialite: "Médecin Généraliste",
    tel: "05 53 56 03 03",
  },
];

const specialistes = [
  { specialite: "Pneumologie", tel: "05 45 38 08 90" },
  { specialite: "Urologie", tel: "05 45 97 88 89" },
  { specialite: "Gynécologie", tel: "05 45 69 66 36" },
  { specialite: "Hypnothérapie", tel: "06 45 91 61 57" },
  { specialite: "Sage-femme", tel: "06 88 21 65 61" },
];

const infirmiers = ["05 53 56 04 56"];

export default function Informations() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
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
              toggleActions: "play none none reverse",
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
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }

      // Animation des cards
      const cards = sectionRef.current.querySelectorAll(".info-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cards[0],
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animation des lignes décoratives
      const lines = sectionRef.current.querySelectorAll(".content-line");
      if (lines.length > 0) {
        gsap.fromTo(
          lines,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: lines[0],
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="informations"
      className="relative py-32 md:py-48 bg-[#F4E6CD] overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-card/30 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full border border-[#927950]/10 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full border border-[#927950]/10 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div
          ref={headerRef}
          className="flex items-start justify-between mb-16 md:mb-24"
        >
          <div>
            <span className="reveal-item text-[10px] font-medium tracking-[0.2em] uppercase text-[#927950] block mb-4">
              (informations)
            </span>
            <div className="header-line w-16 h-[2px] bg-[#927950] mb-6 origin-left" />
            <h2 className="reveal-item text-4xl md:text-5xl lg:text-6xl font-serif text-[#1E211E] leading-[1.1]">
              Maison de Santé
              <br />
              <span className="text-[#927950]">Pluriprofessionnelle</span>
            </h2>
            <p className="reveal-item text-lg md:text-xl text-[#1E211E]/60 leading-relaxed mt-6 max-w-2xl">
              Retrouvez-nous à la Maison de Santé de Nontron, regroupant
              médecins généralistes, spécialistes et infirmiers pour votre prise
              en charge complète.
            </p>
          </div>
          <span className="reveal-item section-number text-[#1E211E]/20 hidden md:block">
            05
          </span>
        </div>

        {/* Address & Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="info-card group p-6 md:p-8 bg-white/70 backdrop-blur-sm rounded-xl border border-[#1E211E]/5 hover:border-[#927950]/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#927950] flex items-center justify-center shrink-0 shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#927950] block mb-3">
                  (adresse)
                </span>
                <p className="text-lg text-[#1E211E] leading-relaxed font-medium">
                  Maison de Santé Pluriprofessionnelle
                </p>
                <p className="text-base text-[#1E211E]/60 mt-1">
                  Place des Droits de l&apos;Homme
                </p>
                <p className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-[#927950]/10 rounded-full text-[#927950] font-semibold text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  24300 Nontron
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="info-card group p-6 md:p-8 bg-white/70 backdrop-blur-sm rounded-xl border border-[#1E211E]/5 hover:border-[#927950]/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#927950] flex items-center justify-center shrink-0 shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#927950] block mb-3">
                  (horaires secrétariat)
                </span>
                <p className="text-lg text-[#1E211E] leading-relaxed font-medium">
                  Du lundi au vendredi
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1.5 bg-[#927950] text-white rounded-full text-sm font-semibold">
                    9h - 12h
                  </span>
                  <span className="px-3 py-1.5 bg-[#927950] text-white rounded-full text-sm font-semibold">
                    14h - 18h
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Médecins Généralistes */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#927950] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#F4E6CD]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-[#1E211E]">
              Médecins Généralistes
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {medecins.map((medecin, index) => (
              <motion.div
                key={index}
                className="info-card relative p-8 bg-white/80 backdrop-blur-sm border border-[#1E211E]/5 hover:border-[#927950]/40 hover:shadow-lg transition-all duration-300 group rounded-lg"
                whileHover={{ y: -4 }}
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#927950] rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#927950] rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#927950] rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#927950] rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#927950] block mb-3">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-2xl font-serif text-[#1E211E] mb-2">
                  {medecin.name}
                </p>
                <p className="text-[#1E211E]/50 mb-4">{medecin.specialite}</p>
                <a
                  href={`tel:${medecin.tel.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-3 px-4 py-2 bg-[#927950] text-white rounded-full text-base font-medium hover:bg-[#1E211E] transition-colors duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {medecin.tel}
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Spécialistes */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#927950] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#F4E6CD]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-[#1E211E]">
              Consultations de Spécialistes
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialistes.map((spec, index) => (
              <motion.a
                key={index}
                href={`tel:${spec.tel.replace(/\s/g, "")}`}
                className="info-card relative p-5 bg-white/60 backdrop-blur-sm border border-[#1E211E]/5 hover:border-[#927950]/40 hover:bg-white hover:shadow-md transition-all duration-300 group rounded-lg"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-[#1E211E] mb-1">
                      {spec.specialite}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm text-[#927950] font-medium">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {spec.tel}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#927950]/10 flex items-center justify-center group-hover:bg-[#927950] transition-all duration-300 shrink-0">
                    <svg
                      className="w-4 h-4 text-[#927950] group-hover:text-white transition-colors duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Infirmiers */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#927950] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#F4E6CD]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-[#1E211E]">
              Cabinets Infirmiers
            </h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {infirmiers.map((tel, index) => (
              <motion.a
                key={index}
                href={`tel:${tel.replace(/\s/g, "")}`}
                className="info-card relative px-6 py-4 bg-white border border-[#927950] text-lg font-semibold text-[#927950] hover:bg-[#927950] hover:text-white rounded-lg transition-all duration-300 inline-flex items-center gap-3 shadow-sm hover:shadow-md"
                whileTap={{ scale: 0.98 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {tel}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Téléconsultation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-8 md:p-12 bg-[#1E211E] text-[#F4E6CD] overflow-hidden"
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#927950]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#927950]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#927950]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#927950]" />

          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#927950] block mb-4">
            (téléconsultation)
          </span>
          <h3 className="text-3xl md:text-4xl font-serif text-[#F4E6CD] mb-8">
            Point de Téléconsultation antenne de Nontron - 14h / 16h30
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xl text-[#927950] mb-4">CMSI Périgueux</p>
              <p className="text-[#F4E6CD]/60 leading-relaxed">
                Centre Médical de Soins Immédiats
                <br />
                Traumatologie adultes et enfants (membres supérieurs et
                inférieurs)
                <br />
                Infections ORL ou pulmonaires adultes
              </p>
            </div>
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#927950] block mb-2">
                  (disponibilité)
                </span>
                <p className="text-lg text-[#F4E6CD]">
                  Lundi au Vendredi :{" "}
                  <span className="font-medium">14h - 17h30</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#927950] block mb-2">
                  (contact)
                </span>
                <a
                  href="tel:0553560456"
                  className="text-lg font-medium text-[#F4E6CD] hover:text-[#927950] transition-colors duration-300 inline-flex items-center gap-2"
                >
                  05 53 56 04 56
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
                <p className="text-[#F4E6CD]/40 mt-1 text-sm">Bureau N°7</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#927950]/30 to-transparent" />
    </section>
  );
}

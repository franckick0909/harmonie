"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Animation du header
      if (headerRef.current) {
        const headerItems = headerRef.current.querySelectorAll(".reveal-item");
        const headerLine = headerRef.current.querySelector(".header-line");

        if (headerItems.length > 0) {
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
        }

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

      // Animation du contenu
      if (contentRef.current) {
        const contentItems =
          contentRef.current.querySelectorAll(".content-item");
        const contentLines =
          contentRef.current.querySelectorAll(".content-line");

        if (contentItems.length > 0) {
          gsap.fromTo(
            contentItems,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: contentRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (contentLines.length > 0) {
          gsap.fromTo(
            contentLines,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: "power4.out",
              scrollTrigger: {
                trigger: contentRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }

      // Animation du formulaire
      if (formRef.current) {
        const formFields = formRef.current.querySelectorAll(".form-field");
        const formLines = formRef.current.querySelectorAll(".form-line");

        if (formFields.length > 0) {
          gsap.fromTo(
            formFields,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: formRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (formLines.length > 0) {
          gsap.fromTo(
            formLines,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.6,
              stagger: 0.06,
              ease: "power4.out",
              scrollTrigger: {
                trigger: formRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }
    },
    { scope: sectionRef }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 md:py-48 bg-[#927950] overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#1E211E]/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full border border-[#F4E6CD]/20 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full border border-[#F4E6CD]/10 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div
          ref={headerRef}
          className="flex items-start justify-between mb-16 md:mb-24"
        >
          <div>
            <span className="reveal-item text-[10px] font-medium tracking-[0.2em] uppercase text-[#F4E6CD] block mb-4">
              (contact)
            </span>
            <div className="header-line w-16 h-[2px] bg-[#F4E6CD] mb-6 origin-left" />
            <h2 className="reveal-item text-4xl md:text-5xl lg:text-6xl font-serif text-[#F4E6CD] leading-[1.1]">
              Créez votre
              <br />
              <span className="text-white drop-shadow-sm">parcours santé</span>
            </h2>
          </div>
          <span className="reveal-item section-number text-[#F4E6CD]/40 hidden md:block">
            04
          </span>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left side - Info */}
          <div ref={contentRef}>
            <p className="content-item text-lg md:text-xl text-[#F4E6CD]/70 leading-relaxed mb-12">
              Harmonie allie innovation et bienveillance pour créer des espaces
              de soins qui se distinguent et qui ont du sens.{" "}
              <span className="text-[#F4E6CD]">
                Donnons vie à votre projet santé
              </span>{" "}
              avec un accompagnement personnalisé et{" "}
              <span className="text-[#1E211E]">moderne</span>.
            </p>

            {/* Contact Info */}
            <div className="space-y-6 mb-12">
              <div className="content-item group p-5 bg-[#1E211E]/10 backdrop-blur-sm rounded-lg border border-[#F4E6CD]/10 hover:border-[#F4E6CD]/30 hover:bg-[#1E211E]/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F4E6CD]/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-[#F4E6CD]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#F4E6CD]/60 block mb-2">
                      (email)
                    </span>
                    <a
                      href="mailto:cabinet.rfm24@orange.fr"
                      className="text-lg text-[#F4E6CD] hover:text-white transition-colors duration-300 inline-flex items-center gap-3"
                    >
                      cabinet.rfm24@orange.fr
                      <svg
                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="content-item group p-5 bg-[#1E211E]/10 backdrop-blur-sm rounded-lg border border-[#F4E6CD]/10 hover:border-[#F4E6CD]/30 hover:bg-[#1E211E]/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F4E6CD]/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-[#F4E6CD]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#F4E6CD]/60 block mb-2">
                      (téléphone)
                    </span>
                    <a
                      href="tel:+33553560303"
                      className="text-lg text-[#F4E6CD] hover:text-white transition-colors duration-300 inline-flex items-center gap-3"
                    >
                      +33 5 53 56 03 03
                      <svg
                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="content-item p-5 bg-[#1E211E]/10 backdrop-blur-sm rounded-lg border border-[#F4E6CD]/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F4E6CD]/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-[#F4E6CD]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#F4E6CD]/60 block mb-2">
                      (adresse)
                    </span>
                    <p className="text-lg text-[#F4E6CD] leading-relaxed">
                      Maison de Santé Pluriprofessionnelle
                      <br />
                      <span className="text-[#F4E6CD]/70">
                        Place des Droits de l&apos;Homme
                      </span>
                      <br />
                      <span className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-[#F4E6CD]/10 rounded-full text-sm text-[#F4E6CD] font-medium">
                        📍 24300 Nontron
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="content-item relative p-6 rounded-lg bg-[#F4E6CD]/10 backdrop-blur-sm border border-[#F4E6CD]/20">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#F4E6CD] rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#F4E6CD] rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#F4E6CD] rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#F4E6CD] rounded-br-lg" />

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#F4E6CD]/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#F4E6CD]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#F4E6CD]">
                  (horaires)
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 px-3 rounded-md bg-[#1E211E]/10">
                  <span className="text-[#F4E6CD]/80">Lundi - Vendredi</span>
                  <span className="text-[#F4E6CD] font-semibold">
                    6h30 - 20h00
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-md bg-[#1E211E]/10">
                  <span className="text-[#F4E6CD]/80">Samedi - Dimanche</span>
                  <span className="text-[#F4E6CD] font-semibold">
                    7h00 - 19h00
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-md bg-[#F4E6CD]/20 border border-[#F4E6CD]/30">
                  <span className="text-[#F4E6CD]">Permanence cabinet</span>
                  <span className="text-white font-semibold px-2 py-0.5 bg-[#1E211E]/50 rounded">
                    11h - 12h
                  </span>
                </div>
              </div>
            </div>

            {/* Coordinates */}
            <div className="content-item mt-6 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-[#F4E6CD]" />
              <span className="text-xs text-[#F4E6CD]/50 font-mono">
                45.5333° N 0.6667° E
              </span>
            </div>
          </div>

          {/* Right side - Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6 p-6 md:p-8 bg-[#1E211E]/15 backdrop-blur-sm rounded-2xl border border-[#F4E6CD]/10"
          >
            <div className="form-field relative">
              <label
                className={`text-[10px] font-medium tracking-[0.15em] uppercase block mb-3 transition-colors duration-300 ${
                  focusedField === "name"
                    ? "text-[#F4E6CD]"
                    : "text-[#F4E6CD]/60"
                }`}
              >
                (nom complet)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent border-b border-[#F4E6CD]/30 py-4 text-[#F4E6CD] placeholder:text-[#F4E6CD]/40 focus:outline-none focus:border-[#F4E6CD] transition-colors duration-300"
                placeholder="Jean Dupont"
                required
              />
              <div
                className="form-line absolute bottom-0 left-0 right-0 h-px bg-[#F4E6CD] origin-left scale-x-0 transition-transform duration-300"
                style={{
                  transform:
                    focusedField === "name" ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </div>

            <div className="form-field relative">
              <label
                className={`text-[10px] font-medium tracking-[0.15em] uppercase block mb-3 transition-colors duration-300 ${
                  focusedField === "email"
                    ? "text-[#F4E6CD]"
                    : "text-[#F4E6CD]/60"
                }`}
              >
                (email)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent border-b border-[#F4E6CD]/30 py-4 text-[#F4E6CD] placeholder:text-[#F4E6CD]/40 focus:outline-none focus:border-[#F4E6CD] transition-colors duration-300"
                placeholder="jean@example.com"
                required
              />
              <div
                className="form-line absolute bottom-0 left-0 right-0 h-px bg-[#F4E6CD] origin-left scale-x-0 transition-transform duration-300"
                style={{
                  transform:
                    focusedField === "email" ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </div>

            <div className="form-field relative">
              <label
                className={`text-[10px] font-medium tracking-[0.15em] uppercase block mb-3 transition-colors duration-300 ${
                  focusedField === "phone"
                    ? "text-[#F4E6CD]"
                    : "text-[#F4E6CD]/60"
                }`}
              >
                (téléphone)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent border-b border-[#F4E6CD]/30 py-4 text-[#F4E6CD] placeholder:text-[#F4E6CD]/40 focus:outline-none focus:border-[#F4E6CD] transition-colors duration-300"
                placeholder="+33 6 00 00 00 00"
              />
              <div
                className="form-line absolute bottom-0 left-0 right-0 h-px bg-[#F4E6CD] origin-left scale-x-0 transition-transform duration-300"
                style={{
                  transform:
                    focusedField === "phone" ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </div>

            <div className="form-field relative">
              <label
                className={`text-[10px] font-medium tracking-[0.15em] uppercase block mb-3 transition-colors duration-300 ${
                  focusedField === "message"
                    ? "text-[#F4E6CD]"
                    : "text-[#F4E6CD]/60"
                }`}
              >
                (message)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent border-b border-[#F4E6CD]/30 py-4 text-[#F4E6CD] placeholder:text-[#F4E6CD]/40 focus:outline-none focus:border-[#F4E6CD] transition-colors duration-300 resize-none min-h-[120px]"
                placeholder="Décrivez votre besoin..."
                required
              />
              <div
                className="form-line absolute bottom-0 left-0 right-0 h-px bg-[#F4E6CD] origin-left scale-x-0 transition-transform duration-300"
                style={{
                  transform:
                    focusedField === "message" ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </div>

            <motion.button
              type="submit"
              className="form-field group relative w-full py-5 bg-[#F4E6CD] text-[#927950] font-medium text-xs uppercase tracking-[0.15em] overflow-hidden mt-8"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
            >
              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 bg-[#1E211E]"
                initial={{ x: "-100%" }}
                variants={{ hover: { x: 0 } }}
                transition={{ duration: 0.4, ease: [0.625, 0.05, 0, 1] }}
              />
              <motion.span
                className="relative z-10 flex items-center justify-center gap-3"
                variants={{ hover: { color: "var(--beige)" } }}
              >
                Envoyer le message
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                >
                  <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
                </svg>
              </motion.span>
            </motion.button>

            <p className="form-field text-xs text-[#F4E6CD]/50 mt-6">
              En soumettant ce formulaire, vous acceptez notre{" "}
              <a
                href="#"
                className="text-[#F4E6CD]/70 hover:text-[#F4E6CD] transition-colors duration-300"
              >
                politique de confidentialité
              </a>
              .
            </p>
          </form>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F4E6CD]/30 to-transparent" />
    </section>
  );
}

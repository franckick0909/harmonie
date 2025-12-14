"use client";

import TextReveal from "@/components/ui/TextReveal";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, ArrowRight, Heart, Home, Syringe } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

// Enregistrer le plugin
gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "01",
    title: "Soins Techniques",
    subtitle: "L'expertise au service de votre santé",
    description:
      "Nos infirmières diplômées d'État assurent des actes techniques avec rigueur et précision, dans le respect des protocoles médicaux les plus stricts. De l'injection simple à la perfusion complexe, chaque geste est réalisé avec soin.",
    icon: Syringe,
    image: "/images/hero3.jpg",
    image2: "/images/hero4.jpg",
    features: [
      "Injections & Prélèvements",
      "Perfusions",
      "Pansements complexes",
      "Gestion diabète",
    ],
    bgColor: "bg-[#3D5A4C]",
    textColor: "text-[#E8F4E8]",
    borderColor: "border-[#927950]",
    accentColor: "#927950",
  },
  {
    id: "02",
    title: "Soins à Domicile",
    subtitle: "Diversité des interventions",
    description:
      "Un accompagnement quotidien ou hebdomadaire bienveillant dans la gestion des traitements ainsi que relais pharmacie si besoin. Nous intervenons avec respect de votre dignité en créant un lien de confiance durable.",
    icon: Home,
    image: "/images/hero5.jpg",
    image2: "/images/hero2.jpg",
    features: [
      "Distribution des traitements",
      "Piluliers quotidiens",
      "Piluliers hebdomadaires",
      "Visites au cabinet",
    ],
    bgColor: "bg-[#927950]",
    textColor: "text-[#F4E6CD]",
    borderColor: "border-[#F4E6CD]",
    accentColor: "#F4E6CD",
  },
  {
    id: "03",
    title: "Suivi Post-Opératoire",
    subtitle: "Une convalescence sereine",
    description:
      "Après une intervention chirurgicale, nous assurons le suivi médical nécessaire et veillons à votre rétablissement optimal. Surveillance rigoureuse, gestion de la douleur et rapport au chirurgien si nécessaire.",
    icon: Activity,
    image: "/images/hero4.jpg",
    image2: "/images/hero3.jpg",
    features: [
      "Réfection de pansements",
      "Retrait fils/agrafes",
      "Surveillance cicatrisation",
      "Gestion de la douleur",
    ],
    bgColor: "bg-[#1E211E]",
    textColor: "text-[#F4E6CD]",
    borderColor: "border-[#927950]",
    accentColor: "#927950",
  },
  {
    id: "04",
    title: "Soins Palliatifs",
    subtitle: "Un accompagnement humain",
    description:
      "Une présence bienveillante et des soins de confort pour accompagner la fin de vie. Nous offrons un soutien médical et humain à la personne et à ses proches, dans le respect de sa dignité et de ses choix.",
    icon: Heart,
    image: "/images/hero2.jpg",
    image2: "/images/hero5.jpg",
    features: [
      "Gestion de la douleur",
      "Soutien psychologique",
      "Accompagnement famille",
      "Soins de confort",
    ],
    bgColor: "bg-[#F5EFE7]",
    textColor: "text-[#1E211E]",
    borderColor: "border-[#927950]",
    accentColor: "#927950",
  },
];

// Version Desktop avec scroll horizontal
function DesktopServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      // Calculer la distance totale à parcourir
      const getScrollDistance = () => {
        return track.scrollWidth - window.innerWidth;
      };

      // Créer l'animation de scroll horizontal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // markers: true, // Décommenter pour debug
        },
      });

      tl.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
      });

      // Parallax images principales - mouvement vers le bas
      const serviceImages = gsap.utils.toArray<HTMLElement>(".service-image");
      if (serviceImages.length > 0) {
        serviceImages.forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -17, scale: 1.3 },
            {
              yPercent: 17,
              scale: 1.3,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${getScrollDistance()}`,
                scrub: 1,
              },
            }
          );
        });
      }

      // Parallax images secondaires - mouvement opposé (vers le haut)
      const serviceImages2 =
        gsap.utils.toArray<HTMLElement>(".service-image-2");
      if (serviceImages2.length > 0) {
        serviceImages2.forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: 10, scale: 1.15 },
            {
              yPercent: -10,
              scale: 1.15,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${getScrollDistance()}`,
                scrub: 1,
              },
            }
          );
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative h-screen w-full overflow-hidden bg-[#F4E6CD]"
    >
      <div
        ref={trackRef}
        className="absolute top-0 left-0 h-full flex will-change-transform"
      >
        {/* Intro Card */}
        <div className="relative w-screen h-full flex-none flex items-center justify-center bg-[#1E211E] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero3.jpg"
              alt="Soins infirmiers"
              fill
              sizes="(min-width: 1024px) 100vw, 0vw"
              className="object-cover opacity-20"
              priority
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl px-8 lg:px-12 text-center">
            <span className="text-xs uppercase tracking-[0.4em] text-[#F4E6CD]/60 mb-8 block font-light">
              Nos Expertises
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-light text-[#F4E6CD] leading-[0.9] mb-8 lg:mb-12">
              <TextReveal delay={0.1} className="block">
                DÉCOUVREZ
              </TextReveal>
              <TextReveal delay={0.3} className="block">
                NOS SOINS
              </TextReveal>
              <TextReveal delay={0.5} className="block italic">
                INFIRMIERS
              </TextReveal>
            </h2>
            <TextReveal
              delay={0.7}
              className="text-base lg:text-xl text-[#F4E6CD]/80 font-light leading-relaxed max-w-2xl mx-auto"
            >
              Une gamme complète de soins dispensés avec rigueur et humanité,
              adaptés à vos besoins spécifiques.
            </TextReveal>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[#F4E6CD]/50">
            <span className="text-xs uppercase tracking-[0.2em]">Défiler</span>
            <div className="w-px h-12 bg-linear-to-b from-[#927950] to-transparent relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-4 bg-[#927950] animate-scroll-line" />
            </div>
          </div>
        </div>

        {/* Service Cards */}
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`relative w-screen h-full flex-none ${service.bgColor} flex items-center overflow-hidden`}
          >
            {/* Split Layout alternating */}
            {index % 2 === 0 ? (
              <>
                {/* Left: Images */}
                <div className="relative w-1/2 h-full flex items-center justify-center p-8 lg:p-12">
                  {/* Main Image */}
                  <div
                    className={`service-image-container relative w-[65%] lg:w-[70%] h-[65%] lg:h-[75%] border ${service.borderColor} p-2 lg:p-3 shadow-2xl rounded-lg bg-transparent`}
                  >
                    <div className="relative w-full h-full overflow-hidden rounded">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="35vw"
                        className="service-image object-cover"
                      />
                    </div>
                  </div>

                  {/* Secondary Image */}
                  <div className="service-image-container-2 absolute bottom-12 lg:bottom-16 right-8 lg:right-16 w-[35%] lg:w-[40%] h-[28%] lg:h-[35%] bg-white/10 backdrop-blur-sm p-1.5 lg:p-2 shadow-2xl rounded">
                    <div className="relative w-full h-full overflow-hidden rounded">
                      <Image
                        src={service.image2}
                        alt={service.title}
                        fill
                        sizes="20vw"
                        className="service-image-2 object-cover"
                      />
                    </div>
                  </div>

                  {/* Number Badge */}
                  <div className="absolute top-12 lg:top-24 left-8 lg:left-16 bg-white/95 backdrop-blur px-6 lg:px-7 py-3 lg:py-2 text-2xl lg:text-3xl xl:text-4xl font-light font-serif tracking-tight rounded shadow-lg">
                    {service.id}
                  </div>
                </div>

                {/* Right: Content */}
                <ServiceContent service={service} index={index} align="left" />
              </>
            ) : (
              <>
                {/* Left: Content */}
                <ServiceContent service={service} index={index} align="right" />

                {/* Right: Images */}
                <div className="relative w-1/2 h-full flex items-center justify-center p-8 lg:p-12">
                  {/* Main Image */}
                  <div
                    className={`service-image-container relative w-[65%] lg:w-[70%] h-[65%] lg:h-[75%] border ${service.borderColor} p-2 lg:p-3 shadow-2xl rounded-lg bg-transparent`}
                  >
                    <div className="relative w-full h-full overflow-hidden rounded">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="35vw"
                        className="service-image object-cover"
                      />
                    </div>
                  </div>

                  {/* Secondary Image */}
                  <div className="service-image-container-2 absolute top-12 lg:top-24 left-8 lg:left-16 w-[35%] lg:w-[40%] h-[28%] lg:h-[35%] bg-white/20 backdrop-blur-sm p-1.5 lg:p-2 shadow-2xl rounded">
                    <div className="relative w-full h-full overflow-hidden rounded">
                      <Image
                        src={service.image2}
                        alt={service.title}
                        fill
                        sizes="20vw"
                        className="service-image-2 object-cover"
                      />
                    </div>
                  </div>

                  {/* Number Badge */}
                  <div className="absolute bottom-12 lg:bottom-16 right-8 lg:right-16 bg-white/95 backdrop-blur px-6 lg:px-7 py-3 lg:py-2 text-2xl lg:text-3xl xl:text-4xl font-light font-serif tracking-tight rounded shadow-lg">
                    {service.id}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// Version Mobile avec cards empilées
function MobileServices() {
  return (
    <section id="services" className="relative bg-[#F4E6CD] py-16 md:py-24">
      {/* Header Mobile */}
      <div className="container mx-auto px-6 mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-[#927950] mb-4 block font-medium">
          Nos Expertises
        </span>
        <h2 className="text-4xl md:text-5xl font-serif text-[#1E211E] leading-[1.1] mb-6">
          Découvrez nos
          <br />
          <span className="italic">soins infirmiers</span>
        </h2>
        <p className="text-base text-[#1E211E]/70 leading-relaxed max-w-lg">
          Une gamme complète de soins dispensés avec rigueur et humanité,
          adaptés à vos besoins spécifiques.
        </p>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-6 px-4 md:px-6">
        {services.map((service) => (
          <MobileServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}

// Composant principal qui choisit la version
export default function Services() {
  return (
    <>
      {/* Desktop uniquement */}
      <div className="hidden lg:block">
        <DesktopServices />
      </div>

      {/* Mobile uniquement */}
      <div className="lg:hidden">
        <MobileServices />
      </div>
    </>
  );
}

// Composant pour le contenu du service (Desktop)
function ServiceContent({
  service,
  index,
  align,
}: {
  service: (typeof services)[0];
  index: number;
  align: "left" | "right";
}) {
  const Icon = service.icon;

  return (
    <div
      className={`w-1/2 h-full flex flex-col justify-center px-8 lg:px-16 ${service.textColor}`}
    >
      <div className={`max-w-xl ${align === "right" ? "ml-auto" : ""}`}>
        <Icon className="w-10 h-10 lg:w-12 lg:h-12 mb-6 lg:mb-8 stroke-[1.5]" />

        <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light leading-[0.95] mb-4 lg:mb-6">
          <TextReveal delay={index * 0.1}>{service.title}</TextReveal>
        </h3>

        <TextReveal
          delay={index * 0.1 + 0.2}
          className="text-lg lg:text-2xl font-serif italic mb-6 lg:mb-8 opacity-80"
        >
          {service.subtitle}
        </TextReveal>

        <TextReveal
          delay={index * 0.1 + 0.4}
          className="text-sm lg:text-base leading-relaxed mb-8 lg:mb-12 font-light opacity-90"
        >
          {service.description}
        </TextReveal>

        <ul className="space-y-3 lg:space-y-4 mb-8 lg:mb-12">
          {service.features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm uppercase tracking-[0.15em] lg:tracking-[0.2em] font-light opacity-80"
            >
              <span className="text-lg lg:text-2xl font-light">
                {String(idx + 1).padStart(2, "0")}
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="inline-flex items-center gap-3 text-xs lg:text-sm uppercase tracking-widest font-medium group cursor-pointer w-fit"
        >
          <span
            className="w-10 lg:w-12 h-[2px] group-hover:w-14 lg:group-hover:w-16 transition-all duration-300"
            style={{ backgroundColor: service.accentColor }}
          />
          <span className="transition-colors duration-300 hover:opacity-70">
            En savoir plus
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </a>
      </div>
    </div>
  );
}

// Composant Card pour la version Mobile
function MobileServiceCard({ service }: { service: (typeof services)[0] }) {
  const Icon = service.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!cardRef.current) return;

      gsap.fromTo(
        cardRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: cardRef }
  );

  return (
    <div
      ref={cardRef}
      className={`${service.bgColor} ${service.textColor} rounded-2xl overflow-hidden shadow-xl`}
    >
      {/* Image */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

        {/* Number Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-2 text-lg font-light font-serif tracking-[0.2em] rounded shadow-md text-[#1E211E]">
          {service.id}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4 mb-4">
          <Icon className="w-8 h-8 shrink-0 stroke-[1.5] mt-1" />
          <div>
            <h3 className="text-2xl md:text-3xl font-serif font-light leading-tight mb-1">
              {service.title}
            </h3>
            <p className="text-sm font-serif italic opacity-80">
              {service.subtitle}
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-6 opacity-90">
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {service.features.slice(0, 3).map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 text-xs uppercase tracking-widest font-light opacity-80"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium group"
        >
          <span className="transition-colors duration-300">En savoir plus</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </a>
      </div>
    </div>
  );
}

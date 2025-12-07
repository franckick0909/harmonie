"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Informations from "@/components/sections/Informations";
import Team from "@/components/sections/Team";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0a0a0a] grain">
      <Header />
      <Hero />
      <About />
      <Services />
      <Informations />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}

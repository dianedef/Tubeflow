"use client";

import Header from "@/components/Header";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import FooterHero from "@/components/home/FooterHero";
import Hero from "@/components/home/Hero";
import ProblemSection from "@/components/home/ProblemSection";
import SolutionSection from "@/components/home/SolutionSection";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <Features />
      <Testimonials />
      <FooterHero />
      <Footer />
    </main>
  );
}

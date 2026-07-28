import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { StorySection } from "@/components/sections/StorySection";
import { DemoSection } from "@/components/sections/DemoSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <StorySection />
        <DemoSection />
        <BenefitsSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

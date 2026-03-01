import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ForWhoSection from "@/components/landing/ForWhoSection";
import AIToolsSection from "@/components/landing/AIToolsSection";
import ProgramSection from "@/components/landing/ProgramSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ForWhoSection />
      <AIToolsSection />
      <ProgramSection />
      <PricingSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
};

export default Index;

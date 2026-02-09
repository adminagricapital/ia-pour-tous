import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
    </div>

    <div className="container mx-auto px-4 relative z-10 pt-20">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground mb-6 animate-fade-in-up">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          Plateforme N°1 d'initiation à l'IA en Afrique
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          L'Intelligence Artificielle{" "}
          <span className="text-accent">à la portée de tous</span>
        </h1>

        <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Enseignants, commerçants, artisans, pasteurs, médecins… Quel que soit votre métier, 
          maîtrisez l'IA et transformez votre quotidien. Formations pratiques à partir de <strong>2 500 FCFA</strong>.
        </p>

        <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Button size="lg" className="gradient-primary border-0 text-primary-foreground gap-2 text-base px-8">
            Commencer maintenant <ArrowRight className="h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="gap-2 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            <Play className="h-5 w-5" /> Voir la démo
          </Button>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {[
            { value: "500+", label: "Apprenants" },
            { value: "12", label: "Modules" },
            { value: "98%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-2xl font-bold text-primary-foreground">{stat.value}</div>
              <div className="text-sm text-primary-foreground/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
    </div>

    <div className="container mx-auto px-4 relative z-10 pt-20">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground mb-6"
        >
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          Plateforme N°1 d'initiation à l'IA en Afrique
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
        >
          L'Intelligence Artificielle{" "}
          <span className="text-accent">à la portée de tous</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-primary-foreground/80 mb-8 max-w-xl"
        >
          Enseignants, commerçants, artisans, pasteurs, agriculteurs, étudiants… Quel que soit votre métier, 
          maîtrisez l'IA et transformez votre quotidien. Formations pratiques à partir de <strong>2 500 FCFA</strong>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <Link to="/auth">
            <Button size="lg" className="gradient-primary border-0 text-primary-foreground gap-2 text-base px-8">
              Commencer maintenant <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/catalogue">
            <Button size="lg" variant="outline" className="gap-2 text-base border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20">
              <Play className="h-5 w-5" /> Voir la démo
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-8 mt-12"
        >
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
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;

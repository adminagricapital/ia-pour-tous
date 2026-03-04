import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Users, BookOpen, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "linear-gradient(160deg, hsl(217, 90%, 12%) 0%, hsl(230, 80%, 20%) 40%, hsl(217, 85%, 30%) 100%)" }}>
    {/* Decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle, hsl(36, 95%, 55%) 0%, transparent 70%)" }} />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-5" style={{ background: "radial-gradient(circle, hsl(217, 90%, 60%) 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
    </div>

    <div className="container mx-auto px-4 relative z-10 pt-24 pb-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-6"
            style={{ background: "hsla(36, 95%, 55%, 0.15)", color: "hsl(36, 95%, 65%)", border: "1px solid hsla(36, 95%, 55%, 0.3)" }}
          >
            <Sparkles className="h-4 w-4" />
            Formation pratique à l'Intelligence Artificielle
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl lg:text-[3.4rem] font-bold leading-tight mb-6"
            style={{ color: "white" }}
          >
            Maîtrisez l'
            <span style={{ color: "hsl(36, 95%, 55%)" }}>Intelligence Artificielle</span>
            {" "}et transformez votre quotidien
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg mb-8 max-w-xl leading-relaxed"
            style={{ color: "hsla(0, 0%, 100%, 0.75)" }}
          >
            Enseignants, commerçants, artisans, pasteurs, agriculteurs, étudiants… 
            Quel que soit votre métier, apprenez à utiliser l'IA au quotidien. 
            Formations pratiques à partir de <strong style={{ color: "hsl(36, 95%, 65%)" }}>500 FCFA/semaine</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/auth?tab=signup">
              <Button size="lg" className="gap-2 text-base px-8 font-bold h-13 shadow-lg"
                style={{ background: "hsl(36, 95%, 48%)", color: "hsl(217, 90%, 10%)" }}>
                🚀 Commencer maintenant <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/catalogue">
              <Button size="lg" variant="outline" className="gap-2 text-base h-13"
                style={{ borderColor: "hsla(0,0%,100%,0.25)", color: "white", background: "hsla(0,0%,100%,0.08)" }}>
                <Play className="h-5 w-5" /> Voir les cours
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
              { icon: Users, value: "11+", label: "Secteurs" },
              { icon: BookOpen, value: "50+", label: "Modules" },
              { icon: Award, value: "100%", label: "Pratique" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "hsla(36, 95%, 55%, 0.15)" }}>
                  <stat.icon className="h-5 w-5" style={{ color: "hsl(36, 95%, 55%)" }} />
                </div>
                <div>
                  <div className="font-display text-xl font-bold" style={{ color: "white" }}>{stat.value}</div>
                  <div className="text-xs" style={{ color: "hsla(0,0%,100%,0.5)" }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right side - Feature cards */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="hidden lg:grid grid-cols-2 gap-4"
        >
          {[
            { emoji: "🤖", title: "ChatGPT", desc: "Maîtrisez l'assistant IA le plus puissant" },
            { emoji: "🎨", title: "Création visuelle", desc: "Créez logos, affiches et visuels en 1 clic" },
            { emoji: "📊", title: "Productivité", desc: "Automatisez vos tâches quotidiennes" },
            { emoji: "📄", title: "Documents pro", desc: "Rapports, CV, contrats générés par IA" },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="rounded-2xl p-5"
              style={{
                background: "hsla(0,0%,100%,0.06)",
                border: "1px solid hsla(0,0%,100%,0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="text-3xl block mb-3">{card.emoji}</span>
              <h3 className="font-display font-bold text-sm mb-1" style={{ color: "white" }}>{card.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "hsla(0,0%,100%,0.6)" }}>{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;

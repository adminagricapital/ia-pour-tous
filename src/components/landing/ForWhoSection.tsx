import { motion } from "framer-motion";

const sectors = [
  { emoji: "🎓", label: "Enseignants", desc: "Révolutionnez votre pédagogie" },
  { emoji: "🛒", label: "Commerçants", desc: "Boostez vos ventes avec l'IA" },
  { emoji: "🏥", label: "Santé", desc: "Optimisez vos diagnostics" },
  { emoji: "🎨", label: "Artisans", desc: "Automatisez vos tâches" },
  { emoji: "⛪", label: "Églises", desc: "Modernisez votre communication" },
  { emoji: "🤝", label: "Associations", desc: "Gérez mieux vos membres" },
  { emoji: "🏢", label: "Entreprises", desc: "Gagnez en productivité" },
  { emoji: "💼", label: "Freelances", desc: "Multipliez vos compétences" },
  { emoji: "🌾", label: "Agriculteurs", desc: "Modernisez vos exploitations" },
  { emoji: "💻", label: "Cyber & Imprimerie", desc: "Digitalisez vos services" },
  { emoji: "📚", label: "Étudiants", desc: "Accélérez votre apprentissage" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

const ForWhoSection = () => (
  <section id="pour-qui" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "hsl(36, 95%, 48%)" }}>Pour qui ?</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          L'IA concerne <span className="gradient-text">tous les métiers</span>
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Peu importe votre secteur d'activité, l'Intelligence Artificielle peut transformer votre façon de travailler.
        </p>
      </motion.div>

      <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
        {sectors.map((sector) => (
          <motion.div key={sector.label} variants={item}
            className="group rounded-2xl border border-border bg-card p-5 sm:p-6 text-center hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
            <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{sector.emoji}</span>
            <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">{sector.label}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{sector.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ForWhoSection;

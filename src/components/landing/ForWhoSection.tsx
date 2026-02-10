import { GraduationCap, ShoppingBag, Stethoscope, Wrench, Church, Users, Building2, Briefcase, Sprout, Printer, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const sectors = [
  { icon: GraduationCap, label: "Enseignants", desc: "Révolutionnez votre pédagogie" },
  { icon: ShoppingBag, label: "Commerçants", desc: "Boostez vos ventes avec l'IA" },
  { icon: Stethoscope, label: "Santé", desc: "Optimisez vos diagnostics" },
  { icon: Wrench, label: "Artisans", desc: "Automatisez vos tâches" },
  { icon: Church, label: "Églises", desc: "Modernisez votre communication" },
  { icon: Users, label: "Associations", desc: "Gérez mieux vos membres" },
  { icon: Building2, label: "Entreprises & Employés", desc: "Gagnez en productivité" },
  { icon: Briefcase, label: "Freelances", desc: "Multipliez vos compétences" },
  { icon: Sprout, label: "Agriculteurs", desc: "Modernisez vos exploitations" },
  { icon: Printer, label: "Cyber, Imprimerie & Saisie", desc: "Digitalisez vos services" },
  { icon: BookOpen, label: "Élèves & Étudiants", desc: "Accélérez votre apprentissage" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ForWhoSection = () => (
  <section id="pour-qui" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-sm font-semibold text-accent uppercase tracking-wider">Pour qui ?</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          L'IA concerne <span className="gradient-text">tous les métiers</span>
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Peu importe votre secteur d'activité, l'Intelligence Artificielle peut transformer votre façon de travailler.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {sectors.map((sector) => (
          <motion.div
            key={sector.label}
            variants={item}
            className="group rounded-xl border border-border bg-card p-5 sm:p-6 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl gradient-primary text-primary-foreground group-hover:scale-110 transition-transform">
              <sector.icon className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">{sector.label}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{sector.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ForWhoSection;

import { GraduationCap, ShoppingBag, Stethoscope, Wrench, Church, Users, Building2, Briefcase } from "lucide-react";

const sectors = [
  { icon: GraduationCap, label: "Enseignants", desc: "Révolutionnez votre pédagogie" },
  { icon: ShoppingBag, label: "Commerçants", desc: "Boostez vos ventes avec l'IA" },
  { icon: Stethoscope, label: "Santé", desc: "Optimisez vos diagnostics" },
  { icon: Wrench, label: "Artisans", desc: "Automatisez vos tâches" },
  { icon: Church, label: "Églises", desc: "Modernisez votre communication" },
  { icon: Users, label: "Associations", desc: "Gérez mieux vos membres" },
  { icon: Building2, label: "Entreprises", desc: "Gagnez en productivité" },
  { icon: Briefcase, label: "Freelances", desc: "Multipliez vos compétences" },
];

const ForWhoSection = () => (
  <section id="pour-qui" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-14">
        <span className="text-sm font-semibold text-accent uppercase tracking-wider">Pour qui ?</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          L'IA concerne <span className="gradient-text">tous les métiers</span>
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Peu importe votre secteur d'activité, l'Intelligence Artificielle peut transformer votre façon de travailler.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sectors.map((sector) => (
          <div
            key={sector.label}
            className="group rounded-xl border border-border bg-card p-6 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-primary-foreground group-hover:scale-110 transition-transform">
              <sector.icon className="h-7 w-7" />
            </div>
            <h3 className="font-display font-semibold text-foreground">{sector.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">{sector.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ForWhoSection;

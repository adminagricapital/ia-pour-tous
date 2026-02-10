import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Pasteur Emmanuel", role: "Église Évangélique, Abidjan", text: "Grâce à cette formation, j'utilise maintenant l'IA pour préparer mes sermons et gérer la communication de notre église. Extraordinaire !" },
  { name: "Aminata K.", role: "Commerçante, Dakar", text: "J'ai appris à utiliser ChatGPT pour rédiger mes annonces et gérer mon stock. Mes ventes ont augmenté de 40% en 2 mois !" },
  { name: "Prof. Moussa D.", role: "Enseignant, Bamako", text: "La formation m'a permis de créer des supports de cours interactifs avec l'IA. Mes étudiants sont plus engagés que jamais." },
];

const TestimonialsSection = () => (
  <section className="py-20 bg-secondary/50">
    <div className="container mx-auto px-4">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-sm font-semibold text-accent uppercase tracking-wider">Témoignages</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Ils ont <span className="gradient-text">transformé leur métier</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <MessageSquare className="h-8 w-8 text-primary/30 mb-3" />
            <p className="text-sm text-foreground italic mb-4">"{t.text}"</p>
            <div>
              <div className="font-display font-semibold text-foreground text-sm">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;

import { BookOpen, Video, FileText, Brain, MessageSquare, Award } from "lucide-react";
import { motion } from "framer-motion";

const modules = [
  { icon: Brain, title: "Comprendre l'IA", desc: "Les bases de l'intelligence artificielle expliquées simplement", duration: "2h", format: "Vidéo + Quiz" },
  { icon: MessageSquare, title: "ChatGPT & Assistants IA", desc: "Maîtrisez les outils conversationnels comme ChatGPT, Gemini, Claude", duration: "3h", format: "Vidéo + Pratique" },
  { icon: FileText, title: "IA pour vos documents", desc: "Automatisez la rédaction, résumé et analyse de documents", duration: "2h", format: "PDF + Vidéo" },
  { icon: Video, title: "IA & Création de contenu", desc: "Créez des images, vidéos et présentations avec l'IA", duration: "3h", format: "Live + Replay" },
  { icon: BookOpen, title: "IA dans votre métier", desc: "Applications concrètes de l'IA dans votre secteur d'activité", duration: "4h", format: "Atelier pratique" },
  { icon: Award, title: "Projet final & Certificat", desc: "Mettez en pratique vos acquis et obtenez votre certificat", duration: "2h", format: "Projet + Quiz" },
];

const ProgramSection = () => (
  <section id="programme" className="py-20 bg-secondary/50">
    <div className="container mx-auto px-4">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-sm font-semibold text-accent uppercase tracking-wider">Programme</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Un parcours complet et <span className="gradient-text">pratique</span>
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Des modules progressifs conçus pour vous rendre opérationnel rapidement, quel que soit votre niveau.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, i) => (
          <motion.div
            key={mod.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                <mod.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-accent">Module {i + 1}</span>
                  <span className="text-xs text-muted-foreground">• {mod.duration}</span>
                </div>
                <h3 className="font-display font-semibold text-foreground">{mod.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{mod.desc}</p>
                <span className="inline-block mt-2 text-xs rounded-full bg-secondary px-2.5 py-0.5 text-secondary-foreground font-medium">
                  {mod.format}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProgramSection;

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const aiTools = [
  {
    name: "ChatGPT",
    by: "OpenAI",
    desc: "Assistant conversationnel polyvalent : rédaction, traduction, analyse, programmation, conseil.",
    speciality: "Texte & Conversation",
    emoji: "💬",
    color: "hsl(160, 60%, 42%)",
    url: "https://chat.openai.com",
  },
  {
    name: "Claude",
    by: "Anthropic",
    desc: "IA avancée pour l'analyse de documents, la rédaction professionnelle et le raisonnement complexe.",
    speciality: "Documents & Raisonnement",
    emoji: "🧠",
    color: "hsl(30, 80%, 50%)",
    url: "https://claude.ai",
  },
  {
    name: "Gemini",
    by: "Google",
    desc: "IA multimodale : texte, image, vidéo, code. Intégrée à Google Workspace pour la productivité.",
    speciality: "Multimodal & Productivité",
    emoji: "✨",
    color: "hsl(217, 90%, 50%)",
    url: "https://gemini.google.com",
  },
  {
    name: "DALL-E / Midjourney",
    by: "OpenAI / Midjourney",
    desc: "Génération d'images réalistes ou artistiques à partir de descriptions textuelles.",
    speciality: "Création d'images",
    emoji: "🎨",
    color: "hsl(280, 70%, 50%)",
    url: "https://openai.com/dall-e-3",
  },
  {
    name: "Runway / Sora",
    by: "Runway ML / OpenAI",
    desc: "Création et montage de vidéos par IA : effets spéciaux, animation, génération de clips.",
    speciality: "Vidéo & Animation",
    emoji: "🎬",
    color: "hsl(340, 70%, 50%)",
    url: "https://runwayml.com",
  },
  {
    name: "Canva IA",
    by: "Canva",
    desc: "Design assisté par IA : affiches, présentations, logos, visuels marketing en quelques clics.",
    speciality: "Design & Marketing",
    emoji: "🖌️",
    color: "hsl(200, 80%, 45%)",
    url: "https://www.canva.com",
  },
];

const AIToolsSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "hsl(217, 90%, 42%)" }}>
          Les outils IA
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Découvrez les <span className="gradient-text">IA les plus puissantes</span>
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Chaque IA a sa spécialité. Nos formations vous apprennent à maîtriser chacune d'elles selon votre métier.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {aiTools.map((tool, i) => (
          <motion.a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group rounded-xl border border-border bg-card p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 block"
          >
            <div className="flex items-start gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${tool.color}15` }}
              >
                {tool.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-foreground text-sm">{tool.name}</h3>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground">{tool.by}</p>
                <span
                  className="inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${tool.color}15`, color: tool.color }}
                >
                  {tool.speciality}
                </span>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default AIToolsSection;

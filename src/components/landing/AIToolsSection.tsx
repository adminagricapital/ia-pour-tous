import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const aiTools = [
  {
    name: "ChatGPT",
    by: "OpenAI",
    emoji: "🤖",
    desc: "Assistant conversationnel polyvalent : rédaction, traduction, analyse, programmation, conseil.",
    speciality: "Texte & Conversation",
    color: "hsl(160, 60%, 42%)",
    url: "https://chat.openai.com",
  },
  {
    name: "Claude",
    by: "Anthropic",
    emoji: "🧠",
    desc: "IA avancée pour l'analyse de documents, la rédaction professionnelle et le raisonnement complexe.",
    speciality: "Documents & Raisonnement",
    color: "hsl(30, 80%, 50%)",
    url: "https://claude.ai",
  },
  {
    name: "Gemini",
    by: "Google",
    emoji: "💎",
    desc: "IA multimodale : texte, image, vidéo, code. Intégrée à Google Workspace pour la productivité.",
    speciality: "Multimodal & Productivité",
    color: "hsl(217, 90%, 50%)",
    url: "https://gemini.google.com",
  },
  {
    name: "DALL-E & Midjourney",
    by: "OpenAI / Midjourney",
    emoji: "🎨",
    desc: "Génération d'images réalistes ou artistiques. Affiches, logos, visuels marketing...",
    speciality: "Création d'images",
    color: "hsl(280, 70%, 50%)",
    url: "https://openai.com/dall-e-3",
  },
  {
    name: "Runway & Sora",
    by: "Runway ML / OpenAI",
    emoji: "🎬",
    desc: "Création et montage de vidéos par IA : effets spéciaux, animation, clips professionnels.",
    speciality: "Vidéo & Animation",
    color: "hsl(340, 70%, 50%)",
    url: "https://runwayml.com",
  },
  {
    name: "Canva IA",
    by: "Canva",
    emoji: "✨",
    desc: "Design assisté par IA : affiches, présentations, logos en quelques clics. Idéal pour les débutants.",
    speciality: "Design & Marketing",
    color: "hsl(200, 80%, 45%)",
    url: "https://www.canva.com",
  },
];

const AIToolsSection = () => (
  <section className="py-20" style={{ background: "hsl(220, 30%, 97%)" }}>
    <div className="container mx-auto px-4">
      <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-4"
          style={{ background: "hsl(217, 90%, 95%)", color: "hsl(217, 90%, 42%)" }}>
          🛠️ Les outils IA
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Découvrez les <span className="gradient-text">IA les plus puissantes</span>
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Nos formations vous apprennent à maîtriser chaque outil selon votre métier. Voici ce que vous pourrez faire :
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {aiTools.map((tool, i) => (
          <motion.a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group rounded-2xl border border-border bg-card p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 block">
            <div className="flex items-start gap-4">
              <span className="text-4xl shrink-0">{tool.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-foreground text-sm">{tool.name}</h3>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground">{tool.by}</p>
                <span className="inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: `${tool.color}15`, color: tool.color }}>
                  {tool.speciality}
                </span>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* What you can create */}
      <motion.div className="mt-14 max-w-4xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h3 className="font-display text-xl font-bold text-foreground text-center mb-6">
          Ce que vous pourrez créer après la formation
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { emoji: "📄", title: "Documents professionnels", desc: "Rapports, contrats, cahiers des charges" },
            { emoji: "🎨", title: "Visuels marketing", desc: "Affiches, logos, flyers pour votre activité" },
            { emoji: "📊", title: "Présentations", desc: "PowerPoint, plans d'affaires impactants" },
            { emoji: "🎬", title: "Contenus vidéo", desc: "Clips promotionnels, formations en ligne" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5 text-center hover:shadow-sm transition-shadow">
              <span className="text-4xl block mb-3">{item.emoji}</span>
              <h4 className="font-display font-bold text-foreground text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default AIToolsSection;

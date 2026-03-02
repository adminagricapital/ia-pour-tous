import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const aiTools = [
  {
    name: "ChatGPT",
    by: "OpenAI",
    desc: "Assistant conversationnel polyvalent : rédaction, traduction, analyse, programmation, conseil.",
    speciality: "Texte & Conversation",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    color: "hsl(160, 60%, 42%)",
    url: "https://chat.openai.com",
  },
  {
    name: "Claude",
    by: "Anthropic",
    desc: "IA avancée pour l'analyse de documents, la rédaction professionnelle et le raisonnement complexe.",
    speciality: "Documents & Raisonnement",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg",
    color: "hsl(30, 80%, 50%)",
    url: "https://claude.ai",
  },
  {
    name: "Gemini",
    by: "Google",
    desc: "IA multimodale : texte, image, vidéo, code. Intégrée à Google Workspace pour la productivité.",
    speciality: "Multimodal & Productivité",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
    color: "hsl(217, 90%, 50%)",
    url: "https://gemini.google.com",
  },
  {
    name: "DALL-E & Midjourney",
    by: "OpenAI / Midjourney",
    desc: "Génération d'images réalistes ou artistiques à partir de descriptions textuelles. Affiches, logos, visuels marketing...",
    speciality: "Création d'images",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    color: "hsl(280, 70%, 50%)",
    url: "https://openai.com/dall-e-3",
  },
  {
    name: "Runway & Sora",
    by: "Runway ML / OpenAI",
    desc: "Création et montage de vidéos par IA : effets spéciaux, animation, génération de clips professionnels.",
    speciality: "Vidéo & Animation",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Runway_logo.png",
    color: "hsl(340, 70%, 50%)",
    url: "https://runwayml.com",
  },
  {
    name: "Canva IA",
    by: "Canva",
    desc: "Design assisté par IA : affiches, présentations, logos, visuels marketing en quelques clics. Idéal pour les débutants.",
    speciality: "Design & Marketing",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
    color: "hsl(200, 80%, 45%)",
    url: "https://www.canva.com",
  },
];

const AIToolsSection = () => (
  <section className="py-20 section-alt">
    <div className="container mx-auto px-4">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-4"
          style={{ background: "hsl(217, 90%, 95%)", color: "hsl(217, 90%, 42%)" }}>
          Les outils IA
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Découvrez les <span className="gradient-text">IA les plus puissantes</span>
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Chaque IA a sa spécialité. Nos formations vous apprennent à les maîtriser selon votre métier. 
          Voici ce que vous pourrez faire après la formation :
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
            className="group rounded-2xl border border-border bg-card p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 block"
          >
            <div className="flex items-start gap-4">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
                style={{ background: `${tool.color}12`, border: `2px solid ${tool.color}25` }}
              >
                <img 
                  src={tool.logoUrl} 
                  alt={tool.name}
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span style="font-size:1.75rem">${tool.name[0]}</span>`;
                    }
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-foreground text-sm">{tool.name}</h3>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground">{tool.by}</p>
                <span
                  className="inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full"
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

      {/* What you can create with AI */}
      <motion.div
        className="mt-14 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
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
            <div key={item.title} className="rounded-xl border border-border bg-card p-4 text-center">
              <span className="text-3xl block mb-2">{item.emoji}</span>
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

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const aiTools = [
  {
    name: "ChatGPT",
    by: "OpenAI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    desc: "Assistant conversationnel polyvalent : rédaction, traduction, analyse, programmation, conseil.",
    speciality: "Texte & Conversation",
    color: "hsl(160, 60%, 42%)",
    url: "https://chat.openai.com",
  },
  {
    name: "Claude",
    by: "Anthropic",
    logo: "https://cdn.worldvectorlogo.com/logos/anthropic-2.svg",
    desc: "IA avancée pour l'analyse de documents, la rédaction professionnelle et le raisonnement complexe.",
    speciality: "Documents & Raisonnement",
    color: "hsl(30, 80%, 50%)",
    url: "https://claude.ai",
  },
  {
    name: "Gemini",
    by: "Google",
    logo: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
    desc: "IA multimodale : texte, image, vidéo, code. Intégrée à Google Workspace pour la productivité.",
    speciality: "Multimodal & Productivité",
    color: "hsl(217, 90%, 50%)",
    url: "https://gemini.google.com",
  },
  {
    name: "DALL·E 3",
    by: "OpenAI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    desc: "Génération d'images réalistes ou artistiques à partir d'un simple texte. Affiches, logos, visuels marketing.",
    speciality: "Création d'images",
    color: "hsl(280, 70%, 50%)",
    url: "https://openai.com/dall-e-3",
  },
  {
    name: "Midjourney",
    by: "Midjourney Inc.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png",
    desc: "Génération d'images artistiques et créatives de très haute qualité, idéal pour le design et la communication visuelle.",
    speciality: "Art & Design",
    color: "hsl(200, 70%, 45%)",
    url: "https://www.midjourney.com",
  },
  {
    name: "Sora",
    by: "OpenAI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    desc: "Création de vidéos par IA à partir d'un texte. Clips promotionnels, animations, contenus visuels dynamiques.",
    speciality: "Vidéo & Animation",
    color: "hsl(340, 70%, 50%)",
    url: "https://openai.com/sora",
  },
  {
    name: "Canva IA",
    by: "Canva",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
    desc: "Design assisté par IA : affiches, présentations, logos en quelques clics. Idéal pour les débutants.",
    speciality: "Design & Marketing",
    color: "hsl(262, 70%, 50%)",
    url: "https://www.canva.com",
  },
  {
    name: "Copilot",
    by: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Microsoft_365_Copilot_Icon.svg",
    desc: "Assistant IA intégré à Word, Excel, PowerPoint. Automatisez vos tâches bureautiques et gagnez en productivité.",
    speciality: "Bureautique & Productivité",
    color: "hsl(200, 80%, 45%)",
    url: "https://copilot.microsoft.com",
  },
];

const AIToolsSection = () => (
  <section className="py-20 section-alt">
    <div className="container mx-auto px-4">
      <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-4"
          style={{ background: "hsl(217, 90%, 95%)", color: "hsl(217, 90%, 42%)" }}>
          🛠️ Les outils IA que vous allez maîtriser
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Découvrez les <span className="gradient-text">IA les plus puissantes</span>
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Nos formations vous apprennent à maîtriser chaque outil selon votre métier. Voici ce que vous pourrez faire :
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {aiTools.map((tool, i) => (
          <motion.a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="group rounded-2xl border border-border bg-card p-5 hover:shadow-lg hover:shadow-primary/5 transition-all block relative overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(135deg, ${tool.color}08, ${tool.color}03)` }} />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 bg-card shadow-sm border border-border overflow-hidden p-2">
                  <img src={tool.logo} alt={tool.name} className="h-8 w-8 object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl">${tool.name[0]}</span>`; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-foreground text-sm">{tool.name}</h3>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-muted-foreground">{tool.by}</p>
                </div>
              </div>
              <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2"
                style={{ background: `${tool.color}12`, color: tool.color }}>
                {tool.speciality}
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
            </div>
          </motion.a>
        ))}
      </div>

      {/* What you can create */}
      <motion.div className="mt-14 max-w-5xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h3 className="font-display text-xl font-bold text-foreground text-center mb-6">
          Ce que vous pourrez créer après la formation
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { emoji: "📄", title: "Documents professionnels", desc: "Rapports, contrats, cahiers des charges, CV" },
            { emoji: "🎨", title: "Visuels & Design", desc: "Affiches, logos, flyers, bannières publicitaires" },
            { emoji: "📊", title: "Présentations", desc: "PowerPoint, plans d'affaires, infographies" },
            { emoji: "🎬", title: "Contenus vidéo", desc: "Clips promotionnels, formations, publicités" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5 text-center hover:shadow-sm transition-shadow card-hover">
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

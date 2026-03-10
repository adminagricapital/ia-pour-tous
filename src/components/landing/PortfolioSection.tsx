import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ExternalLink, Play, Globe, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import agricapitalImg from "@/assets/agricapital-preview.png";

const defaultWebsites = [
  { id: "1", title: "AgriCapital", description: "Plateforme fintech agricole — Automatisation des financements pour producteurs", url: "https://pay.agricapital.ci", screenshot_url: agricapitalImg },
  { id: "2", title: "IA Pour Tous", description: "Plateforme de formation en Intelligence Artificielle pour professionnels", url: "#", screenshot_url: null },
];

const defaultVideos = [
  { id: "1", title: "Présentation Corporate AgriCapital", description: "Vidéo promotionnelle générée par IA — Voix off française professionnelle", video_url: "/videos/portfolio-5.mp4", thumbnail_url: null },
  { id: "2", title: "Événement Convention Ghana 2026", description: "Couverture vidéo IA d'un événement panafricain", video_url: "/videos/portfolio-4.mp4", thumbnail_url: null },
  { id: "3", title: "Fashion & Émancipation", description: "Contenu visuel mode — Animation photo-to-video IA", video_url: "/videos/portfolio-3.mp4", thumbnail_url: null },
  { id: "4", title: "Clip Festif — Musique & Voix off", description: "Production musicale avec voix off IA intégrée", video_url: "/videos/portfolio-2.mp4", thumbnail_url: null },
  { id: "5", title: "Animation Photo Réaliste", description: "Transformation de photo statique en vidéo dynamique par IA", video_url: "/videos/portfolio-6.mp4", thumbnail_url: null },
  { id: "6", title: "Contenu Professionnel", description: "Vidéo corporate produite avec outils IA avancés", video_url: "/videos/portfolio-1.mp4", thumbnail_url: null },
];

const PortfolioSection = () => {
  const [tab, setTab] = useState<"websites" | "videos">("websites");
  const [websites, setWebsites] = useState(defaultWebsites);
  const [videos, setVideos] = useState(defaultVideos);

  useEffect(() => {
    const fetchData = async () => {
      const [wRes, vRes] = await Promise.all([
        supabase.from("portfolio_websites").select("*").eq("is_published", true).order("sort_order"),
        supabase.from("portfolio_videos").select("*").eq("is_published", true).order("sort_order"),
      ]);
      if (wRes.data?.length) setWebsites(wRes.data as any);
      if (vRes.data?.length) setVideos(vRes.data as any);
    };
    fetchData();
  }, []);

  return (
    <section id="portfolio" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-4" style={{ background: "hsl(262, 70%, 95%)", color: "hsl(262, 70%, 45%)" }}>
            Nos Réalisations
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Portfolio <span className="gradient-text">Créatif</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Sites web professionnels et contenus visuels produits avec les technologies les plus avancées
          </p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-8">
          <Button variant={tab === "websites" ? "default" : "outline"} onClick={() => setTab("websites")} className={`gap-2 ${tab === "websites" ? "gradient-primary border-0 text-primary-foreground" : ""}`}>
            <Globe className="h-4 w-4" /> Sites Web
          </Button>
          <Button variant={tab === "videos" ? "default" : "outline"} onClick={() => setTab("videos")} className={`gap-2 ${tab === "videos" ? "gradient-primary border-0 text-primary-foreground" : ""}`}>
            <Video className="h-4 w-4" /> Contenus Vidéo IA
          </Button>
        </div>

        {tab === "websites" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {websites.map((site, i) => (
              <motion.div key={site.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="h-48 bg-muted overflow-hidden">
                  {site.screenshot_url ? (
                    <img src={site.screenshot_url} alt={site.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full gradient-primary flex items-center justify-center">
                      <Globe className="h-16 w-16 text-primary-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-foreground mb-1">{site.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{site.description}</p>
                  {site.url && site.url !== "#" && (
                    <a href={site.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="gap-2 text-xs">
                        <ExternalLink className="h-3 w-3" /> Visiter le site
                      </Button>
                    </a>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border">
                    Par <span className="font-medium">Innocent KOFFI</span> — Innovation & Consulting
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === "videos" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {videos.map((video, i) => (
              <motion.div key={video.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-black">
                  <video src={video.video_url} controls className="w-full h-full object-cover" preload="metadata" poster={video.thumbnail_url || undefined} />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-foreground text-sm mb-1">{video.title}</h3>
                  <p className="text-xs text-muted-foreground">{video.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border">
                    Par <span className="font-medium">Innocent KOFFI</span> — Innovation & Consulting
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;

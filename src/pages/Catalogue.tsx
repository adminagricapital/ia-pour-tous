import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Clock, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const sectorLabels: Record<string, string> = {
  education: "Éducation",
  commerce: "Commerce",
  sante: "Santé",
  artisanat: "Artisanat",
  eglise: "Églises",
  association: "Associations",
  entreprise: "Entreprises",
  freelance: "Freelances",
  agriculture: "Agriculture",
  cyber_imprimerie: "Cyber & Imprimerie",
  etudiant: "Étudiants",
};

const levelLabels: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

const levelColors: Record<string, string> = {
  debutant: "bg-green-100 text-green-800",
  intermediaire: "bg-yellow-100 text-yellow-800",
  avance: "bg-red-100 text-red-800",
};

type Course = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  level: string;
  duration_minutes: number;
  format: string;
  sector: string | null;
};

const Catalogue = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      let query = supabase.from("courses").select("*").eq("is_published", true).order("sort_order");
      if (sectorFilter) query = query.eq("sector", sectorFilter as any);
      const { data } = await query;
      setCourses((data as Course[]) || []);
      setLoading(false);
    };
    fetchCourses();
  }, [sectorFilter]);

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Catalogue des <span className="gradient-text">Formations</span>
            </h1>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Découvrez nos modules adaptés à chaque secteur d'activité.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un cours..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant={sectorFilter === "" ? "default" : "outline"} size="sm" onClick={() => setSectorFilter("")}>
                Tous
              </Button>
              {Object.entries(sectorLabels).map(([key, label]) => (
                <Button
                  key={key}
                  variant={sectorFilter === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSectorFilter(key)}
                  className={sectorFilter === key ? "gradient-primary border-0 text-primary-foreground" : ""}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-xl border border-border bg-card p-6 animate-pulse h-64" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun cours trouvé. Les cours seront bientôt disponibles !</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all group"
                >
                  <div className="h-40 gradient-primary flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary-foreground/30" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColors[course.level] || "bg-muted text-muted-foreground"}`}>
                        {levelLabels[course.level] || course.level}
                      </span>
                      {course.sector && (
                        <span className="text-xs text-muted-foreground">{sectorLabels[course.sector] || course.sector}</span>
                      )}
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {course.duration_minutes} min
                      </span>
                      <Button size="sm" variant="ghost" className="text-primary gap-1 group-hover:gap-2 transition-all">
                        Voir <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Catalogue;

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Award, Play, Clock, LogOut, User, Calendar,
  MessageSquare, TrendingUp, ArrowRight, Zap, Star, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const planLabels: Record<string, { label: string; color: string; bg: string }> = {
  decouverte: { label: "Découverte", color: "hsl(220, 20%, 30%)", bg: "hsl(220, 20%, 94%)" },
  essentiel: { label: "Essentiel", color: "hsl(217, 90%, 42%)", bg: "hsl(217, 90%, 95%)" },
  avance: { label: "Avancé", color: "hsl(262, 70%, 45%)", bg: "hsl(262, 70%, 95%)" },
  premium: { label: "Premium ⭐", color: "hsl(36, 95%, 40%)", bg: "hsl(36, 95%, 94%)" },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      const [profileRes, enrollRes, sessionsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("enrollments").select("*, courses(*)").eq("user_id", user.id),
        supabase.from("live_sessions").select("*").order("scheduled_at", { ascending: true }).limit(5),
      ]);

      setProfile(profileRes.data);
      setEnrollments(enrollRes.data || []);
      setSessions(sessionsRes.data || []);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/"); };

  const planInfo = planLabels[profile?.plan || "decouverte"];
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + (e.progress_percent || 0), 0) / enrollments.length)
    : 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-base font-bold text-foreground">IA Pour Tous</span>
          </Link>
          <div className="flex items-center gap-3">
            <span
              className="hidden sm:block text-xs font-bold px-2.5 py-1 rounded-full badge-plan"
              style={{ color: planInfo.color, background: planInfo.bg }}
            >
              {planInfo.label}
            </span>
            <span className="text-sm text-muted-foreground hidden md:block">{profile?.full_name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-5xl">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7"
        >
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Bonjour, {profile?.full_name?.split(" ")[0] || "Apprenant"} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Continuez votre parcours de formation en Intelligence Artificielle.
          </p>
          {!profile?.plan_active && (
            <div className="mt-3 flex items-center gap-3 p-3 rounded-xl border border-accent/30 bg-accent/5">
              <Star className="h-5 w-5 text-accent shrink-0" />
              <p className="text-sm text-foreground">
                Débloquez tous les modules avec un forfait payant.
                <Link to="/payment?plan=essentiel" className="ml-2 font-semibold text-accent hover:underline">
                  Voir les forfaits →
                </Link>
              </p>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { icon: BookOpen, label: "Cours inscrits", value: enrollments.length, color: "hsl(217, 90%, 42%)" },
            { icon: TrendingUp, label: "Progression moy.", value: `${avgProgress}%`, color: "hsl(142, 70%, 38%)" },
            { icon: Award, label: "Complétés", value: enrollments.filter(e => e.completed).length, color: "hsl(36, 95%, 48%)" },
            { icon: Calendar, label: "Sessions live", value: sessions.length, color: "hsl(262, 70%, 55%)" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${stat.color}18` }}
              >
                <stat.icon className="h-4.5 w-4.5" style={{ color: stat.color }} />
              </div>
              <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Courses */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-foreground">Mes cours</h2>
              <Link to="/catalogue">
                <Button variant="ghost" size="sm" className="gap-1 text-primary text-xs">
                  Voir le catalogue <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {enrollments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm mb-4">Vous n'êtes inscrit à aucun cours</p>
                <Link to="/catalogue">
                  <Button className="gradient-primary border-0 text-primary-foreground shadow-sm gap-2">
                    <Play className="h-4 w-4" /> Explorer le catalogue
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.map((enrollment: any, i) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 gradient-primary"
                    >
                      <Play className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground text-sm truncate">
                        {enrollment.courses?.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full gradient-primary transition-all"
                            style={{ width: `${enrollment.progress_percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{enrollment.progress_percent}%</span>
                      </div>
                    </div>
                    <Link to={`/cours/${enrollment.course_id}`}>
                      <Button size="sm" className="gradient-primary border-0 text-primary-foreground shadow-sm shrink-0 gap-1 text-xs">
                        Continuer <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Sessions */}
            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-3">Sessions Live</h2>
              {sessions.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-5 text-center">
                  <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Aucune session prévue</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session: any) => (
                    <div key={session.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`h-2 w-2 rounded-full ${session.status === "live" ? "bg-red-500 animate-pulse" : "bg-accent"}`} />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{session.status}</span>
                      </div>
                      <h3 className="font-display font-semibold text-foreground text-sm">{session.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(session.scheduled_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {session.meeting_url && session.status === "live" && (
                        <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="mt-2 gradient-primary border-0 text-primary-foreground w-full text-xs">Rejoindre maintenant</Button>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="font-display text-base font-bold text-foreground mb-3">Accès rapide</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: BookOpen, label: "Catalogue", to: "/catalogue" },
                  { icon: MessageSquare, label: "Forum", to: "/forum" },
                  { icon: TrendingUp, label: "Blog IA", to: "/blog" },
                  { icon: User, label: "Mon profil", to: "/dashboard" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="rounded-xl border border-border bg-card p-3 text-center hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <link.icon className="h-5 w-5 text-primary mx-auto mb-1.5" />
                    <span className="text-xs font-medium text-foreground">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

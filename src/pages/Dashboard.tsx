import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, Play, FileText, Clock, LogOut, User, Calendar, MessageSquare, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold text-foreground">IA Pour Tous</Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{profile?.full_name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Bonjour, {profile?.full_name || "Apprenant"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Forfait : <span className="font-semibold text-primary capitalize">{profile?.plan || "Aucun"}</span>
            {!profile?.plan_active && (
              <Link to="/payment?plan=decouverte" className="ml-2 text-accent hover:underline text-sm">Activer un forfait →</Link>
            )}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: "Cours inscrits", value: enrollments.length, color: "text-primary" },
            { icon: TrendingUp, label: "Progression moy.", value: enrollments.length ? Math.round(enrollments.reduce((s, e) => s + (e.progress_percent || 0), 0) / enrollments.length) + "%" : "0%", color: "text-accent" },
            { icon: Award, label: "Certificats", value: enrollments.filter(e => e.completed).length, color: "text-green-500" },
            { icon: Calendar, label: "Sessions live", value: sessions.length, color: "text-orange-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-4 sm:p-5"
            >
              <stat.icon className={`h-6 w-6 ${stat.color} mb-2`} />
              <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Courses */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground">Mes Cours</h2>
            {enrollments.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">Vous n'êtes inscrit à aucun cours</p>
                <Link to="/catalogue"><Button className="gradient-primary border-0 text-primary-foreground">Explorer le catalogue</Button></Link>
              </div>
            ) : (
              enrollments.map((enrollment: any) => (
                <div key={enrollment.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                    <Play className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-foreground text-sm truncate">{enrollment.courses?.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full gradient-primary rounded-full" style={{ width: `${enrollment.progress_percent}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{enrollment.progress_percent}%</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary shrink-0">Continuer</Button>
                </div>
              ))
            )}
          </div>

          {/* Upcoming Sessions */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground">Sessions Live</h2>
            {sessions.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aucune session prévue</p>
              </div>
            ) : (
              sessions.map((session: any) => (
                <div key={session.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`h-2 w-2 rounded-full ${session.status === "live" ? "bg-red-500 animate-pulse" : "bg-accent"}`} />
                    <span className="text-xs font-medium text-muted-foreground uppercase">{session.status}</span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-sm">{session.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(session.scheduled_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {session.meeting_url && session.status === "live" && (
                    <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="mt-2 gradient-primary border-0 text-primary-foreground w-full">Rejoindre</Button>
                    </a>
                  )}
                  {session.replay_url && session.status === "ended" && (
                    <a href={session.replay_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="mt-2 w-full">Voir le replay</Button>
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { icon: BookOpen, label: "Catalogue", to: "/catalogue" },
            { icon: MessageSquare, label: "Forum", to: "/forum" },
            { icon: FileText, label: "Blog", to: "/blog" },
            { icon: User, label: "Mon profil", to: "/dashboard" },
          ].map((link) => (
            <Link key={link.label} to={link.to} className="rounded-xl border border-border bg-card p-4 text-center hover:border-primary/50 hover:shadow-md transition-all">
              <link.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-sm font-medium text-foreground">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

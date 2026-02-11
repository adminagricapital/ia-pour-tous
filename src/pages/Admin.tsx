import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen, Users, CreditCard, Calendar, Plus, LogOut,
  BarChart3, FileText, Trash2, Edit, Eye, TrendingUp, Sparkles, Image as ImageIcon, Loader2
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, courses: 0, payments: 0, revenue: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  const [newCourse, setNewCourse] = useState({ title: "", description: "", level: "debutant", sector: "education", format: "video", duration_minutes: 60 });
  const [newSession, setNewSession] = useState({ title: "", description: "", scheduled_at: "", duration_minutes: 60, meeting_url: "" });
  
  // AI Blog Editor state
  const [blogInput, setBlogInput] = useState("");
  const [generatedPost, setGeneratedPost] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [showGenDialog, setShowGenDialog] = useState(false);
  const [previewPost, setPreviewPost] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (!roles?.some(r => r.role === "admin")) { navigate("/dashboard"); return; }

      const [coursesRes, paymentsRes, usersRes, sessionsRes, postsRes] = await Promise.all([
        supabase.from("courses").select("*").order("created_at", { ascending: false }),
        supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("live_sessions").select("*").order("scheduled_at", { ascending: false }),
        supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      ]);

      setCourses(coursesRes.data || []);
      setPayments(paymentsRes.data || []);
      setUsers(usersRes.data || []);
      setSessions(sessionsRes.data || []);
      setBlogPosts(postsRes.data || []);

      const completedPayments = (paymentsRes.data || []).filter((p: any) => p.status === "completed");
      setStats({
        users: (usersRes.data || []).length,
        courses: (coursesRes.data || []).length,
        payments: completedPayments.length,
        revenue: completedPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0),
      });
      setLoading(false);
    };
    init();
  }, [navigate]);

  const addCourse = async () => {
    const { error } = await supabase.from("courses").insert({ ...newCourse, is_published: true } as any);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Cours ajouté !" });
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    setCourses(data || []);
    setNewCourse({ title: "", description: "", level: "debutant", sector: "education", format: "video", duration_minutes: 60 });
  };

  const deleteCourse = async (id: string) => {
    await supabase.from("courses").delete().eq("id", id);
    setCourses(courses.filter(c => c.id !== id));
    toast({ title: "Cours supprimé" });
  };

  const addSession = async () => {
    const { error } = await supabase.from("live_sessions").insert(newSession as any);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Session créée !" });
    const { data } = await supabase.from("live_sessions").select("*").order("scheduled_at", { ascending: false });
    setSessions(data || []);
    setNewSession({ title: "", description: "", scheduled_at: "", duration_minutes: 60, meeting_url: "" });
  };

  // AI Blog Generation
  const generateBlog = async (withImage: boolean) => {
    setShowGenDialog(false);
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog", {
        body: { content: blogInput, generateImage: withImage },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setGeneratedPost({
        title: data.title || "ARTICLE GÉNÉRÉ",
        slug: data.slug || "article-" + Date.now(),
        content: data.content || "",
        summary: data.summary || "",
        thumbnail_url: data.image || null,
      });
      toast({ title: "Article généré avec succès !" });
    } catch (err: any) {
      toast({ title: "Erreur de génération", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const publishPost = async () => {
    if (!generatedPost) return;
    const { data: { user } } = await supabase.auth.getUser();

    // If there's a base64 image, upload it to storage first
    let thumbnailUrl = generatedPost.thumbnail_url;
    if (thumbnailUrl?.startsWith("data:")) {
      try {
        const base64 = thumbnailUrl.split(",")[1];
        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const fileName = `blog/${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage.from("course-content").upload(fileName, bytes, { contentType: "image/png" });
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("course-content").getPublicUrl(fileName);
          thumbnailUrl = urlData.publicUrl;
        }
      } catch (e) {
        console.error("Image upload failed:", e);
        thumbnailUrl = null;
      }
    }

    const { error } = await supabase.from("blog_posts").insert({
      title: generatedPost.title,
      slug: generatedPost.slug,
      content: generatedPost.content,
      thumbnail_url: thumbnailUrl,
      author_id: user?.id,
      is_published: true,
    } as any);

    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Article publié !" });
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setBlogPosts(data || []);
    setGeneratedPost(null);
    setBlogInput("");
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/"); };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
    { id: "courses", label: "Cours", icon: BookOpen },
    { id: "users", label: "Apprenants", icon: Users },
    { id: "payments", label: "Paiements", icon: CreditCard },
    { id: "sessions", label: "Sessions Live", icon: Calendar },
    { id: "blog", label: "Blog IA", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold text-foreground">🔧 Admin</Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2"><LogOut className="h-4 w-4" /> Déconnexion</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {tabs.map(t => (
            <Button key={t.id} variant={tab === t.id ? "default" : "ghost"} size="sm" onClick={() => setTab(t.id)}
              className={`gap-2 shrink-0 ${tab === t.id ? "gradient-primary border-0 text-primary-foreground" : ""}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </Button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Apprenants", value: stats.users, color: "text-primary" },
                { icon: BookOpen, label: "Cours", value: stats.courses, color: "text-accent" },
                { icon: CreditCard, label: "Paiements", value: stats.payments, color: "text-green-500" },
                { icon: TrendingUp, label: "Revenus", value: `${stats.revenue.toLocaleString()} FCFA`, color: "text-orange-500" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-4 sm:p-5">
                  <s.icon className={`h-6 w-6 ${s.color} mb-2`} />
                  <div className="font-display text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Derniers paiements</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2">Date</th><th className="pb-2">Montant</th><th className="pb-2">Forfait</th><th className="pb-2">Statut</th>
                  </tr></thead>
                  <tbody>
                    {payments.slice(0, 10).map((p: any) => (
                      <tr key={p.id} className="border-b border-border/50">
                        <td className="py-2">{new Date(p.created_at).toLocaleDateString("fr-FR")}</td>
                        <td className="py-2 font-semibold">{p.amount?.toLocaleString()} FCFA</td>
                        <td className="py-2 capitalize">{p.plan}</td>
                        <td className="py-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "completed" ? "bg-green-100 text-green-700" : p.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Courses */}
        {tab === "courses" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><Plus className="h-5 w-5" /> Ajouter un cours</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="Titre du cours" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} />
                <Input placeholder="Description" value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} />
                <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={newCourse.level} onChange={e => setNewCourse({ ...newCourse, level: e.target.value })}>
                  <option value="debutant">Débutant</option><option value="intermediaire">Intermédiaire</option><option value="avance">Avancé</option>
                </select>
                <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={newCourse.sector} onChange={e => setNewCourse({ ...newCourse, sector: e.target.value })}>
                  <option value="education">Éducation</option><option value="commerce">Commerce</option><option value="sante">Santé</option>
                  <option value="artisanat">Artisanat</option><option value="eglise">Églises</option><option value="association">Associations</option>
                  <option value="entreprise">Entreprises</option><option value="agriculture">Agriculture</option>
                  <option value="cyber_imprimerie">Cyber & Imprimerie</option><option value="etudiant">Étudiants</option>
                </select>
              </div>
              <Button onClick={addCourse} className="mt-4 gradient-primary border-0 text-primary-foreground gap-2"><Plus className="h-4 w-4" /> Ajouter</Button>
            </div>
            <div className="space-y-3">
              {courses.map((c: any) => (
                <div key={c.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-semibold text-foreground text-sm">{c.title}</h4>
                    <p className="text-xs text-muted-foreground">{c.level} • {c.sector} • {c.format}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteCourse(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2">Nom</th><th className="pb-2">Téléphone</th><th className="pb-2">Secteur</th><th className="pb-2">Forfait</th><th className="pb-2">Inscrit le</th>
              </tr></thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b border-border/50">
                    <td className="py-2 font-medium">{u.full_name || "—"}</td>
                    <td className="py-2">{u.phone || "—"}</td>
                    <td className="py-2 capitalize">{u.sector || "—"}</td>
                    <td className="py-2 capitalize">{u.plan || "—"}</td>
                    <td className="py-2">{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payments */}
        {tab === "payments" && (
          <div className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2">Date</th><th className="pb-2">Montant</th><th className="pb-2">Forfait</th><th className="pb-2">Méthode</th><th className="pb-2">Statut</th><th className="pb-2">Transaction</th>
              </tr></thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-2">{new Date(p.created_at).toLocaleDateString("fr-FR")}</td>
                    <td className="py-2 font-semibold">{p.amount?.toLocaleString()} FCFA</td>
                    <td className="py-2 capitalize">{p.plan}</td>
                    <td className="py-2">{p.payment_method || "—"}</td>
                    <td className="py-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "completed" ? "bg-green-100 text-green-700" : p.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2 text-xs text-muted-foreground">{p.transaction_id || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sessions */}
        {tab === "sessions" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><Plus className="h-5 w-5" /> Planifier une session</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="Titre" value={newSession.title} onChange={e => setNewSession({ ...newSession, title: e.target.value })} />
                <Input placeholder="Description" value={newSession.description} onChange={e => setNewSession({ ...newSession, description: e.target.value })} />
                <Input type="datetime-local" value={newSession.scheduled_at} onChange={e => setNewSession({ ...newSession, scheduled_at: e.target.value })} />
                <Input placeholder="Lien de la session (Zoom, Meet...)" value={newSession.meeting_url} onChange={e => setNewSession({ ...newSession, meeting_url: e.target.value })} />
              </div>
              <Button onClick={addSession} className="mt-4 gradient-primary border-0 text-primary-foreground gap-2"><Plus className="h-4 w-4" /> Planifier</Button>
            </div>
            <div className="space-y-3">
              {sessions.map((s: any) => (
                <div key={s.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-semibold text-foreground text-sm">{s.title}</h4>
                      <p className="text-xs text-muted-foreground">{new Date(s.scheduled_at).toLocaleString("fr-FR")} • {s.status}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "live" ? "bg-red-100 text-red-700" : s.status === "ended" ? "bg-muted text-muted-foreground" : "bg-accent/20 text-accent"}`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog IA Editor */}
        {tab === "blog" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Éditeur d'articles assisté par IA
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Écrivez un simple mot, une phrase ou un paragraphe. L'IA génèrera un article complet et professionnel.
              </p>

              <Textarea
                placeholder="Ex: Lancement formation agriculture IA, Forum agricole 2026, Comment l'IA transforme l'éducation..."
                value={blogInput}
                onChange={e => setBlogInput(e.target.value)}
                className="min-h-[120px] mb-4"
              />

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowGenDialog(true)}
                  disabled={!blogInput.trim() || generating}
                  className="gradient-primary border-0 text-primary-foreground gap-2"
                >
                  {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {generating ? "Génération en cours..." : "Générer l'article"}
                </Button>
              </div>

              {/* Generation Dialog */}
              <Dialog open={showGenDialog} onOpenChange={setShowGenDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Générer le contenu</DialogTitle>
                    <DialogDescription>Choisissez le mode de génération</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 pt-4">
                    <Button onClick={() => generateBlog(true)} className="w-full gap-2 gradient-primary border-0 text-primary-foreground">
                      <ImageIcon className="h-4 w-4" /> Avec image générée par IA
                    </Button>
                    <Button onClick={() => generateBlog(false)} variant="outline" className="w-full gap-2">
                      <FileText className="h-4 w-4" /> Sans image
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Generated Preview */}
            {generatedPost && (
              <div className="rounded-xl border-2 border-primary/30 bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                    <Eye className="h-5 w-5" /> Aperçu de l'article
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setGeneratedPost(null)}>Annuler</Button>
                    <Button size="sm" onClick={publishPost} className="gradient-primary border-0 text-primary-foreground gap-1">
                      <Plus className="h-4 w-4" /> Publier
                    </Button>
                  </div>
                </div>

                {generatedPost.thumbnail_url && (
                  <img src={generatedPost.thumbnail_url} alt="" className="w-full h-48 object-cover rounded-lg mb-4" />
                )}

                <h2 className="font-display text-xl font-bold text-foreground mb-2 uppercase">{generatedPost.title}</h2>
                {generatedPost.summary && (
                  <p className="text-muted-foreground italic mb-4">{generatedPost.summary}</p>
                )}

                {/* Editable fields */}
                <div className="space-y-3 mb-4 p-4 rounded-lg bg-muted/50">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Titre</label>
                    <Input value={generatedPost.title} onChange={e => setGeneratedPost({ ...generatedPost, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Slug URL</label>
                    <Input value={generatedPost.slug} onChange={e => setGeneratedPost({ ...generatedPost, slug: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Contenu (Markdown)</label>
                    <Textarea value={generatedPost.content} onChange={e => setGeneratedPost({ ...generatedPost, content: e.target.value })} className="min-h-[200px] font-mono text-xs" />
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Rendu final :</h4>
                  <MarkdownRenderer content={generatedPost.content} />
                </div>
              </div>
            )}

            {/* Existing posts */}
            <div>
              <h3 className="font-display font-semibold text-foreground mb-3">Articles publiés ({blogPosts.length})</h3>
              <div className="space-y-3">
                {blogPosts.map((p: any) => (
                  <div key={p.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-semibold text-foreground text-sm truncate">{p.title}</h4>
                      <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("fr-FR")} • {p.is_published ? "Publié" : "Brouillon"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setPreviewPost(p)}><Eye className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview existing post */}
            <Dialog open={!!previewPost} onOpenChange={() => setPreviewPost(null)}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="uppercase">{previewPost?.title}</DialogTitle>
                </DialogHeader>
                {previewPost && <MarkdownRenderer content={previewPost.content || ""} />}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

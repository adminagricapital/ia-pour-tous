import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Globe, Video, ArrowLeft, Upload, Eye, EyeOff } from "lucide-react";

const AdminPortfolio = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<"websites" | "videos">("websites");
  const [websites, setWebsites] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newSite, setNewSite] = useState({ title: "", description: "", url: "", screenshot_url: "" });
  const [newVideo, setNewVideo] = useState({ title: "", description: "", video_url: "", thumbnail_url: "" });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (!roles?.some(r => r.role === "admin")) { navigate("/dashboard"); return; }

      const [wRes, vRes] = await Promise.all([
        supabase.from("portfolio_websites").select("*").order("sort_order"),
        supabase.from("portfolio_videos").select("*").order("sort_order"),
      ]);
      setWebsites(wRes.data || []);
      setVideos(vRes.data || []);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const uploadFile = async (file: File, folder: string) => {
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("course-content").upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from("course-content").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const addWebsite = async () => {
    if (!newSite.title) return;
    const { error } = await (supabase.from("portfolio_websites") as any).insert(newSite);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Site ajouté !" });
    const { data } = await supabase.from("portfolio_websites").select("*").order("sort_order");
    setWebsites(data || []);
    setNewSite({ title: "", description: "", url: "", screenshot_url: "" });
  };

  const addVideo = async () => {
    if (!newVideo.title) return;
    const { error } = await (supabase.from("portfolio_videos") as any).insert(newVideo);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Vidéo ajoutée !" });
    const { data } = await supabase.from("portfolio_videos").select("*").order("sort_order");
    setVideos(data || []);
    setNewVideo({ title: "", description: "", video_url: "", thumbnail_url: "" });
  };

  const deleteWebsite = async (id: string) => {
    await (supabase.from("portfolio_websites") as any).delete().eq("id", id);
    setWebsites(websites.filter(w => w.id !== id));
    toast({ title: "Supprimé" });
  };

  const deleteVideo = async (id: string) => {
    await (supabase.from("portfolio_videos") as any).delete().eq("id", id);
    setVideos(videos.filter(v => v.id !== id));
    toast({ title: "Supprimé" });
  };

  const togglePublish = async (table: string, id: string, current: boolean) => {
    await supabase.from(table).update({ is_published: !current } as any).eq("id", id);
    if (table === "portfolio_websites") {
      setWebsites(websites.map(w => w.id === id ? { ...w, is_published: !current } : w));
    } else {
      setVideos(videos.map(v => v.id === id ? { ...v, is_published: !current } : v));
    }
    toast({ title: !current ? "Publié" : "Masqué" });
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file, "portfolio");
      setNewSite({ ...newSite, screenshot_url: url });
      toast({ title: "Image uploadée !" });
    } catch (err: any) {
      toast({ title: "Erreur upload", description: err.message, variant: "destructive" });
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file, "portfolio-videos");
      setNewVideo({ ...newVideo, video_url: url });
      toast({ title: "Vidéo uploadée !" });
    } catch (err: any) {
      toast({ title: "Erreur upload", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <h1 className="font-display text-lg font-bold text-foreground">📁 Gestion Portfolio</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex gap-2 mb-6">
          <Button variant={tab === "websites" ? "default" : "outline"} onClick={() => setTab("websites")} className={`gap-2 ${tab === "websites" ? "gradient-primary border-0 text-primary-foreground" : ""}`}>
            <Globe className="h-4 w-4" /> Sites Web
          </Button>
          <Button variant={tab === "videos" ? "default" : "outline"} onClick={() => setTab("videos")} className={`gap-2 ${tab === "videos" ? "gradient-primary border-0 text-primary-foreground" : ""}`}>
            <Video className="h-4 w-4" /> Vidéos
          </Button>
        </div>

        {tab === "websites" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Plus className="h-5 w-5" /> Ajouter un site web</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input placeholder="Nom du projet" value={newSite.title} onChange={e => setNewSite({ ...newSite, title: e.target.value })} />
                <Input placeholder="URL du site" value={newSite.url} onChange={e => setNewSite({ ...newSite, url: e.target.value })} />
                <Textarea placeholder="Description" value={newSite.description} onChange={e => setNewSite({ ...newSite, description: e.target.value })} className="sm:col-span-2" />
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground mb-1"><Upload className="h-4 w-4" /> Capture d'écran</label>
                  <Input type="file" accept="image/*" onChange={handleScreenshotUpload} />
                  {newSite.screenshot_url && <img src={newSite.screenshot_url} alt="" className="mt-2 h-20 rounded" />}
                </div>
              </div>
              <Button onClick={addWebsite} className="mt-4 gradient-primary border-0 text-primary-foreground gap-2"><Plus className="h-4 w-4" /> Ajouter</Button>
            </div>

            <div className="space-y-3">
              {websites.map(w => (
                <div key={w.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {w.screenshot_url && <img src={w.screenshot_url} alt="" className="h-12 w-20 rounded object-cover" />}
                    <div>
                      <h4 className="font-semibold text-sm">{w.title}</h4>
                      <p className="text-xs text-muted-foreground">{w.url}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => togglePublish("portfolio_websites", w.id, w.is_published)}>
                      {w.is_published ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteWebsite(w.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "videos" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Plus className="h-5 w-5" /> Ajouter une vidéo</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input placeholder="Titre" value={newVideo.title} onChange={e => setNewVideo({ ...newVideo, title: e.target.value })} />
                <Input placeholder="URL vidéo (ou uploader)" value={newVideo.video_url} onChange={e => setNewVideo({ ...newVideo, video_url: e.target.value })} />
                <Textarea placeholder="Description" value={newVideo.description} onChange={e => setNewVideo({ ...newVideo, description: e.target.value })} className="sm:col-span-2" />
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground mb-1"><Upload className="h-4 w-4" /> Uploader une vidéo</label>
                  <Input type="file" accept="video/*" onChange={handleVideoUpload} />
                </div>
              </div>
              <Button onClick={addVideo} className="mt-4 gradient-primary border-0 text-primary-foreground gap-2"><Plus className="h-4 w-4" /> Ajouter</Button>
            </div>

            <div className="space-y-3">
              {videos.map(v => (
                <div key={v.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{v.title}</h4>
                    <p className="text-xs text-muted-foreground">{v.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => togglePublish("portfolio_videos", v.id, v.is_published)}>
                      {v.is_published ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteVideo(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortfolio;

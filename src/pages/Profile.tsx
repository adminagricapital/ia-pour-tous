import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Save, Loader2, Shield, Mail, Phone, Briefcase } from "lucide-react";
import logo from "@/assets/logo.png";

const sectorLabels: Record<string, string> = {
  education: "🎓 Éducation",
  commerce: "🛒 Commerce",
  sante: "🏥 Santé",
  artisanat: "🎨 Artisanat",
  eglise: "⛪ Églises",
  association: "🤝 Associations",
  entreprise: "🏢 Entreprises",
  freelance: "💼 Freelances",
  agriculture: "🌾 Agriculture",
  cyber_imprimerie: "💻 Cyber & Imprimerie",
  etudiant: "📚 Étudiants",
};

const planLabels: Record<string, { label: string; color: string }> = {
  decouverte: { label: "Découverte (Gratuit)", color: "hsl(220, 20%, 40%)" },
  essentiel: { label: "Essentiel", color: "hsl(217, 90%, 42%)" },
  avance: { label: "Avancé", color: "hsl(262, 70%, 45%)" },
  premium: { label: "Premium ⭐", color: "hsl(36, 95%, 40%)" },
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    sector: "education",
  });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setEmail(user.email || "");

      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (data) {
        setProfile(data);
        setForm({
          full_name: data.full_name || "",
          phone: data.phone || "",
          sector: data.sector || "education",
        });
      }
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("profiles").update({
        full_name: form.full_name,
        phone: form.phone,
        sector: form.sector as any,
      }).eq("user_id", user.id);

      if (error) throw error;
      toast({ title: "✅ Profil mis à jour", description: "Vos informations ont été enregistrées." });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const planInfo = planLabels[profile?.plan || "decouverte"];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="IA Pour Tous" className="h-7 w-7 rounded-lg" />
            <span className="font-display text-sm font-bold text-foreground">IA Pour Tous</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="text-center mb-8">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Mon Profil</h1>
          <p className="text-sm text-muted-foreground mt-1">Gérez vos informations personnelles</p>
        </div>

        {/* Plan Badge */}
        <div className="rounded-xl border border-border bg-card p-4 mb-6 flex items-center gap-3">
          <Shield className="h-5 w-5" style={{ color: planInfo.color }} />
          <div>
            <p className="text-sm font-semibold text-foreground">Forfait actuel</p>
            <p className="text-xs" style={{ color: planInfo.color }}>{planInfo.label}</p>
          </div>
          {profile?.plan === "decouverte" && (
            <Link to="/payment?plan=essentiel" className="ml-auto">
              <Button size="sm" variant="outline" className="text-xs">Passer à un forfait payant</Button>
            </Link>
          )}
        </div>

        {/* Form */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <Mail className="h-4 w-4 text-muted-foreground" /> Email
            </Label>
            <Input value={email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">L'email ne peut pas être modifié</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <User className="h-4 w-4 text-muted-foreground" /> Nom complet
            </Label>
            <Input
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              placeholder="Votre nom complet"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <Phone className="h-4 w-4 text-muted-foreground" /> Téléphone
            </Label>
            <Input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+225 07 XX XX XX XX"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <Briefcase className="h-4 w-4 text-muted-foreground" /> Secteur d'activité
            </Label>
            <select
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={form.sector}
              onChange={e => setForm({ ...form, sector: e.target.value })}
            >
              {Object.entries(sectorLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-primary-foreground font-semibold gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

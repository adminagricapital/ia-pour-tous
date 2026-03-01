import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Shield, Check, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

const AdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("innocentkoffi1@gmail.com");
  const [password, setPassword] = useState("@Massa29012020");
  const [fullName, setFullName] = useState("Super Administrateur");
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSetup = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-admin", {
        body: { email, password, full_name: fullName },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data);
      setDone(true);
      toast({ title: "✅ Super Admin créé !", description: `${email} — Accès total activé` });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <img src={logo} alt="IA Pour Tous" className="h-16 w-16 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Initialisation Super Admin</h1>
        <p className="text-muted-foreground text-sm mb-8">Créez un compte administrateur avec accès total à la plateforme.</p>

        {done ? (
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="font-display font-bold text-foreground mb-2">Compte créé avec succès</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Email :</strong> {email}</p>
              <p><strong>Rôle :</strong> SUPER_ADMIN</p>
              <p><strong>Forfait :</strong> Premium à vie</p>
            </div>
            <Link to="/auth?tab=login">
              <Button className="mt-6 bg-primary text-primary-foreground w-full">Se connecter</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 space-y-4">
            <Shield className="h-12 w-12 text-primary mx-auto mb-2" />
            
            <div className="text-left space-y-3">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1">Nom complet</label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1">Email</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1">Mot de passe</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            <Button onClick={handleSetup} disabled={loading} className="bg-primary text-primary-foreground w-full gap-2" size="lg">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              {loading ? "Création..." : "Créer le Super Admin"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSetup;

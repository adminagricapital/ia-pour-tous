import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, Check } from "lucide-react";
import logo from "@/assets/logo.png";

const AdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleSetup = async () => {
    setLoading(true);
    try {
      // Sign up admin
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: "admin@iapourtous.ci",
        password: "@IApourTousAdmin",
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: "Super Administrateur" },
        },
      });

      if (signUpError) {
        // If already exists, try to sign in
        if (signUpError.message.includes("already")) {
          toast({ title: "Le compte admin existe déjà", description: "Connexion en cours..." });
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email: "admin@iapourtous.ci",
            password: "@IApourTousAdmin",
          });
          if (loginError) throw loginError;
          setDone(true);
          return;
        }
        throw signUpError;
      }

      if (signUpData.user) {
        // Update profile with premium lifetime
        await supabase.from("profiles").update({
          plan: "premium" as const,
          plan_active: true,
          full_name: "Super Administrateur",
        }).eq("user_id", signUpData.user.id);

        // Add admin role (the trigger already added 'user' role)
        await supabase.from("user_roles").insert({
          user_id: signUpData.user.id,
          role: "admin" as const,
        });
      }

      setDone(true);
      toast({ title: "Super Admin initialisé !", description: "admin@iapourtous.ci / @IApourTousAdmin" });
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
        <p className="text-muted-foreground text-sm mb-8">Cette page est réservée à l'initialisation unique du compte administrateur.</p>

        {done ? (
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="font-display font-bold text-foreground mb-2">Compte créé avec succès</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Email :</strong> admin@iapourtous.ci</p>
              <p><strong>Mot de passe :</strong> @IApourTousAdmin</p>
              <p><strong>Rôle :</strong> SUPER_ADMIN</p>
              <p><strong>Forfait :</strong> Premium à vie</p>
            </div>
            <a href="/admin">
              <Button className="mt-6 gradient-primary border-0 text-primary-foreground">Accéder au panel admin</Button>
            </a>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-8">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-6">
              Cliquez ci-dessous pour créer le compte Super Administrateur avec accès total à la plateforme.
            </p>
            <Button onClick={handleSetup} disabled={loading} className="gradient-primary border-0 text-primary-foreground w-full" size="lg">
              {loading ? "Initialisation..." : "Initialiser le Super Admin"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSetup;

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, CreditCard, ArrowLeft, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const planDetails: Record<string, { name: string; price: number; features: string[] }> = {
  decouverte: { name: "Découverte", price: 2500, features: ["1 module au choix", "Support PDF", "Quiz"] },
  essentiel: { name: "Essentiel", price: 5000, features: ["3 modules", "Vidéos + PDF", "Certificat"] },
  premium: { name: "Premium", price: 10000, features: ["Accès complet", "Tous les formats", "Support prioritaire"] },
};

const Payment = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "decouverte";
  const details = planDetails[plan] || planDetails.decouverte;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "failed">("idle");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate("/auth?tab=login");
    };
    checkAuth();
  }, [navigate]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Create payment record
      const { data: payment, error } = await supabase.from("payments").insert({
        user_id: user.id,
        amount: details.price,
        plan: plan as "decouverte" | "essentiel" | "premium",
        payment_method: "mobile_money",
        status: "pending" as const,
      }).select().single();

      if (error) throw error;

      // Simulate CinetPay integration (will be replaced with real API keys later)
      // In production, this would call the CinetPay edge function
      toast({ title: "Redirection vers CinetPay...", description: "Veuillez patienter..." });

      // Simulate success after 2s for demo
      setTimeout(async () => {
        await supabase.from("payments").update({
          status: "completed" as const,
          transaction_id: `CP_${Date.now()}`,
        }).eq("id", payment.id);

        // Activate plan
        await supabase.from("profiles").update({
          plan: plan as "decouverte" | "essentiel" | "premium",
          plan_active: true,
        }).eq("user_id", user.id);

        setStatus("success");
        setLoading(false);
      }, 2000);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
      setStatus("failed");
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Paiement réussi !</h1>
          <p className="text-muted-foreground mb-6">Votre forfait {details.name} est maintenant actif.</p>
          <Link to="/dashboard">
            <Button className="gradient-primary border-0 text-primary-foreground">Accéder à mon espace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={logo} alt="" className="h-10 w-10" />
            <span className="font-display text-xl font-bold text-foreground">IA Pour Tous</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-lg">
          <h2 className="font-display text-xl font-bold text-foreground mb-1">Forfait {details.name}</h2>
          <div className="mb-6">
            <span className="font-display text-4xl font-bold text-foreground">{details.price.toLocaleString()}</span>
            <span className="text-muted-foreground ml-1">FCFA</span>
          </div>

          <ul className="space-y-2 mb-6">
            {details.features.map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 text-accent" /> {f}
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-6">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" /> Payer via Mobile Money
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {["Orange Money", "MTN Money", "Wave", "Moov Money"].map(method => (
                <button
                  key={method}
                  className="rounded-lg border border-border bg-background p-3 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
                >
                  {method}
                </button>
              ))}
            </div>

            <Button
              onClick={handlePayment}
              className="w-full gradient-primary border-0 text-primary-foreground gap-2"
              disabled={loading}
              size="lg"
            >
              {loading ? "Traitement..." : `Payer ${details.price.toLocaleString()} FCFA`}
              <CreditCard className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/#tarifs" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Retour aux tarifs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Payment;

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowLeft, Loader2, Shield, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import waveQr from "@/assets/wave-qr.jpg";

const planDetails: Record<string, { name: string; price: number; period: string; features: string[]; color: string }> = {
  essentiel: {
    name: "Essentiel", price: 500, period: "/semaine",
    features: ["Accès aux modules de base", "Vidéos de formation", "Quiz + évaluation", "Certificat numérique", "Forum abonnés"],
    color: "from-blue-500 to-blue-600",
  },
  avance: {
    name: "Avancé", price: 1500, period: "/semaine",
    features: ["Tout le plan Essentiel", "Modules avancés inclus", "Alertes personnalisées", "Support prioritaire", "Webinaires mensuels"],
    color: "from-purple-500 to-purple-600",
  },
  premium: {
    name: "Premium", price: 2500, period: "/semaine",
    features: ["Tout le plan Avancé", "Tous les modules & secteurs", "Support VIP", "Sessions live", "Certificats officiels", "Coaching individuel"],
    color: "from-amber-500 to-orange-600",
  },
};

const specialCourseDetails: Record<string, { name: string; features: string[]; color: string }> = {
  frontend: {
    name: "Développement Web Front-End", color: "from-blue-500 to-blue-600",
    features: ["Formation complète Front-End", "Technologies modernes & Cloud", "Projet réel livré", "Certificat professionnel"],
  },
  fullstack: {
    name: "Développement Fullstack", color: "from-amber-500 to-orange-600",
    features: ["Front-End + Back-End complet", "Base de données & Auth", "API & logique métier", "Projet livré + Mentorat"],
  },
  video_live: {
    name: "Création Vidéo IA — Live", color: "from-red-500 to-red-600",
    features: ["Formation live interactive", "Création vidéo A à Z", "Assistance 1 mois", "Projet vidéo finalisé"],
  },
  video_replay: {
    name: "Création Vidéo IA — Replay", color: "from-purple-500 to-purple-600",
    features: ["Vidéos complètes en replay", "Replay illimité à vie", "Templates & ressources inclus"],
  },
};

const Payment = () => {
  const [searchParams] = useSearchParams();
  const paymentType = searchParams.get("type"); // "special" or null (subscription)
  const plan = searchParams.get("plan") || "essentiel";
  const courseType = searchParams.get("course") || "";
  const customAmount = searchParams.get("amount");

  const isSpecial = paymentType === "special";
  const specialInfo = specialCourseDetails[courseType];
  const subDetails = planDetails[plan] || planDetails.essentiel;

  const displayName = isSpecial ? (specialInfo?.name || courseType) : subDetails.name;
  const displayPrice = isSpecial ? parseInt(customAmount || "0") : subDetails.price;
  const displayColor = isSpecial ? (specialInfo?.color || "from-blue-500 to-blue-600") : subDetails.color;
  const displayFeatures = isSpecial ? (specialInfo?.features || []) : subDetails.features;
  const displayPeriod = isSpecial ? " (paiement unique)" : subDetails.period;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate("/auth?tab=login");
    };
    checkAuth();
  }, [navigate]);

  const handleWavePayment = async () => {
    setLoading(true);
    setStatus("processing");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const baseUrl = window.location.origin;

      if (isSpecial) {
        // One-time payment for special courses
        const { data, error } = await supabase.functions.invoke("wave-checkout", {
          body: { amount: displayPrice, plan: "premium", successUrl: `${baseUrl}/payment/success`, errorUrl: `${baseUrl}/payment/error` },
        });

        if (error) throw error;

        // Record the special purchase
        await supabase.from("special_course_purchases").insert({
          user_id: user.id, course_type: courseType, amount: displayPrice, status: "completed", transaction_id: `DEMO_${Date.now()}`,
        } as any);

        if (data?.demo) {
          setStatus("success");
          setLoading(false);
          return;
        }
        if (data?.wave_launch_url) {
          const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
          if (isMobile) window.location.href = data.wave_launch_url;
          else window.open(data.wave_launch_url, "_blank");
        }
      } else {
        // Subscription payment
        const { data, error } = await supabase.functions.invoke("wave-checkout", {
          body: { amount: displayPrice, plan, successUrl: `${baseUrl}/payment/success`, errorUrl: `${baseUrl}/payment/error` },
        });
        if (error) throw error;

        if (data?.demo) {
          await supabase.from("payments").insert({ user_id: user.id, amount: displayPrice, plan: plan as any, payment_method: "wave", status: "completed" as const, transaction_id: `DEMO_${Date.now()}` });
          await supabase.from("profiles").update({ plan: plan as any, plan_active: true }).eq("user_id", user.id);
          setStatus("success");
          setLoading(false);
          return;
        }
        if (data?.wave_launch_url) {
          const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
          if (isMobile) window.location.href = data.wave_launch_url;
          else { window.open(data.wave_launch_url, "_blank"); toast({ title: "Paiement Wave ouvert" }); }
        } else { throw new Error(data?.error || "Réponse Wave invalide"); }
      }
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
      setStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Paiement réussi ! 🎉</h1>
          <p className="text-muted-foreground mb-6">{isSpecial ? `Votre formation "${displayName}" est confirmée.` : `Votre forfait ${displayName} est maintenant actif.`}</p>
          <Link to="/dashboard">
            <Button className="gradient-primary border-0 text-primary-foreground">Accéder à mon espace</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={logo} alt="" className="h-8 w-8" />
            <span className="font-display text-lg font-bold text-foreground">IA Pour Tous</span>
          </Link>
          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Shield className="h-3 w-3" /> Paiement sécurisé</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">Finaliser votre achat</h1>
            <p className="text-muted-foreground mb-6">{isSpecial ? "Formation spéciale" : "Forfait sélectionné"}</p>

            <div className={`rounded-2xl p-6 text-white bg-gradient-to-br ${displayColor}`}>
              <h2 className="font-display text-xl font-bold mb-1">{displayName}</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-display text-4xl font-bold">{displayPrice.toLocaleString()}</span>
                <span className="text-white/80">FCFA{displayPeriod}</span>
              </div>
              <ul className="space-y-2">
                {displayFeatures.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/90"><Check className="h-4 w-4 shrink-0" /> {f}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-2">Récapitulatif</h3>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{displayName}</span>
                <span className="text-foreground font-medium">{displayPrice.toLocaleString()} FCFA</span>
              </div>
              <div className="border-t border-border mt-2 pt-2 flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-foreground text-lg">{displayPrice.toLocaleString()} FCFA</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <h3 className="font-display text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                <Smartphone className="h-5 w-5" style={{ color: "#1DC3F2" }} /> Payer avec Wave
              </h3>
              <p className="text-sm text-muted-foreground mb-6">Paiement rapide et sécurisé via votre compte Wave</p>

              <div className="rounded-xl p-4 mb-6" style={{ background: "hsl(195, 80%, 97%)" }}>
                <div className="flex justify-center mb-3">
                  <img src={waveQr} alt="QR Code Wave" className="w-48 h-48 rounded-xl object-cover shadow-md" />
                </div>
                <p className="text-xs text-center text-muted-foreground">Scannez ce QR code avec l'application Wave</p>
              </div>

              <Button onClick={handleWavePayment} className="w-full h-14 text-lg font-bold gap-3 rounded-xl"
                style={{ background: "linear-gradient(135deg, #1DC3F2, #0EA5E9)" }} disabled={loading} size="lg">
                {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Traitement...</> : <><Smartphone className="h-5 w-5" /> Payer {displayPrice.toLocaleString()} FCFA</>}
              </Button>

              {status === "failed" && <p className="text-sm text-destructive mt-3 text-center">Le paiement a échoué. Veuillez réessayer.</p>}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"><Shield className="h-3 w-3" /> Paiement sécurisé et crypté</div>
            </div>
            <div className="text-center mt-4">
              <Link to="/#tarifs" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Retour aux tarifs</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

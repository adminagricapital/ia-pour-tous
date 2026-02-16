import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!paymentId) { setLoading(false); return; }

      const { data: payment } = await supabase
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .single();

      if (payment) {
        setPlan(payment.plan);

        // Activate plan if not already done by webhook
        if (payment.status === "pending") {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("payments").update({ status: "completed" as const }).eq("id", paymentId);
            await supabase.from("profiles").update({
              plan: payment.plan as any,
              plan_active: true,
            }).eq("user_id", user.id);
          }
        }
      }
      setLoading(false);
    };
    verify();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <img src={logo} alt="" className="h-10 w-10" />
          <span className="font-display text-xl font-bold text-foreground">IA Pour Tous</span>
        </Link>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
        >
          <Check className="h-12 w-12 text-green-600" />
        </motion.div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-3">
          Paiement réussi ! 🎉
        </h1>
        <p className="text-muted-foreground mb-2">
          Votre forfait <span className="font-semibold text-primary capitalize">{plan || "Premium"}</span> est maintenant actif.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Vous avez désormais accès à tous les contenus de votre forfait.
        </p>

        <div className="space-y-3">
          <Link to="/dashboard">
            <Button className="w-full gradient-primary border-0 text-primary-foreground gap-2" size="lg">
              <Sparkles className="h-5 w-5" /> Accéder à mon espace
            </Button>
          </Link>
          <Link to="/catalogue">
            <Button variant="outline" className="w-full gap-2" size="lg">
              Explorer les cours <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;

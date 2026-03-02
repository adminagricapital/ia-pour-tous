import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface CourseAccessGateProps {
  courseLevel: string | null;
  userPlan: string | null;
  userPlanActive: boolean;
}

const planHierarchy: Record<string, number> = {
  decouverte: 0,
  essentiel: 1,
  avance: 2,
  premium: 3,
};

const levelToPlan: Record<string, string> = {
  debutant: "essentiel",
  intermediaire: "avance",
  avance: "premium",
};

const planLabels: Record<string, string> = {
  essentiel: "Essentiel (500 FCFA/sem)",
  avance: "Avancé (1 500 FCFA/sem)",
  premium: "Premium (2 500 FCFA/sem)",
};

export const canAccessCourse = (courseLevel: string | null, userPlan: string | null, planActive: boolean): boolean => {
  if (!courseLevel) return true;
  if (courseLevel === "debutant") return true; // Free courses accessible to all
  
  if (!planActive || !userPlan) return false;
  
  const requiredPlan = levelToPlan[courseLevel] || "essentiel";
  return (planHierarchy[userPlan] || 0) >= (planHierarchy[requiredPlan] || 0);
};

const CourseAccessGate = ({ courseLevel, userPlan, userPlanActive }: CourseAccessGateProps) => {
  const requiredPlan = levelToPlan[courseLevel || "debutant"] || "essentiel";
  const requiredLabel = planLabels[requiredPlan] || "Essentiel";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex items-center justify-center bg-background px-4"
    >
      <div className="max-w-md text-center">
        <div className="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "hsl(36, 95%, 94%)" }}>
          <Lock className="h-10 w-10" style={{ color: "hsl(36, 95%, 48%)" }} />
        </div>
        
        <h1 className="font-display text-2xl font-bold text-foreground mb-3">
          Contenu réservé
        </h1>
        <p className="text-muted-foreground mb-6">
          Ce cours nécessite un abonnement <strong>{requiredLabel}</strong> ou supérieur.
          Passez à un forfait supérieur pour débloquer tout le contenu.
        </p>

        <div className="rounded-xl border border-border bg-card p-4 mb-6">
          <div className="flex items-center gap-3 justify-center">
            <Crown className="h-5 w-5" style={{ color: "hsl(36, 95%, 48%)" }} />
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">
                Votre plan actuel : <span className="capitalize">{userPlan || "Découverte"}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Plan requis : <span className="capitalize">{requiredPlan}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/payment?plan=${requiredPlan}`}>
            <Button className="gradient-primary border-0 text-primary-foreground gap-2">
              <Crown className="h-4 w-4" /> Passer au plan {requiredPlan}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Retour au tableau de bord</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseAccessGate;

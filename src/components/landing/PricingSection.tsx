import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Crown, Shield, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Découverte",
    price: "Gratuit",
    priceNum: "0",
    period: "",
    plan: "decouverte",
    icon: Zap,
    description: "Testez sans engagement",
    color: "hsl(220, 20%, 30%)",
    features: [
      "Accès à 2 modules d'initiation",
      "Quiz d'évaluation",
      "Forum communautaire",
      "Support par email",
    ],
    popular: false,
    cta: "Commencer gratuitement",
  },
  {
    name: "Essentiel",
    price: "500",
    priceNum: "500",
    period: "/semaine",
    plan: "essentiel",
    icon: Shield,
    description: "Pour bien démarrer",
    color: "hsl(217, 90%, 42%)",
    features: [
      "Accès aux modules de base",
      "Vidéos de formation",
      "Quiz + évaluation",
      "Certificat numérique",
      "Support par email",
      "Accès au forum abonnés",
    ],
    popular: false,
    cta: "Choisir Essentiel",
  },
  {
    name: "Avancé",
    price: "1 500",
    priceNum: "1500",
    period: "/semaine",
    plan: "avance",
    icon: Rocket,
    description: "Pour progresser vite",
    color: "hsl(217, 90%, 42%)",
    features: [
      "Tout le plan Essentiel",
      "Modules avancés inclus",
      "Alertes personnalisées",
      "Support prioritaire",
      "Webinaires mensuels",
      "Replays des formations",
    ],
    popular: true,
    cta: "Choisir Avancé",
  },
  {
    name: "Premium",
    price: "2 500",
    priceNum: "2500",
    period: "/semaine",
    plan: "premium",
    icon: Crown,
    description: "L'expérience complète",
    color: "hsl(36, 95%, 48%)",
    features: [
      "Tout le plan Avancé",
      "TOUS les modules & secteurs",
      "Support VIP dédié",
      "Webinaires illimités + Replays",
      "Certificats officiels avec cachet",
      "Sessions coaching individuel",
      "Bonus : session stratégique",
    ],
    popular: false,
    cta: "Choisir Premium",
  },
];

const PricingSection = () => (
  <section id="tarifs" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-4"
          style={{ background: "hsl(217, 90%, 95%)", color: "hsl(217, 90%, 42%)" }}>
          Nos Forfaits
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-foreground">
          Des prix <span className="gradient-text">accessibles à tous</span>
        </h2>
        <p className="text-base max-w-xl mx-auto text-muted-foreground">
          À partir de <strong>500 FCFA par semaine</strong>. Paiement simple via Wave, Orange Money, MTN Money.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative rounded-2xl border flex flex-col ${
              plan.popular
                ? "shadow-xl border-2 border-primary"
                : "border-border bg-card shadow-sm"
            }`}
            style={{ background: plan.popular ? "hsl(217, 90%, 98%)" : "hsl(0, 0%, 100%)" }}
          >
            {plan.popular && (
              <div
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1 rounded-full text-xs font-bold"
                style={{ background: "hsl(217, 90%, 42%)", color: "white" }}
              >
                <Star className="h-3 w-3" /> Le plus populaire
              </div>
            )}

            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${plan.color}18` }}
                >
                  <plan.icon className="h-5 w-5" style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6 pb-5 border-b border-border">
                {plan.priceNum === "0" ? (
                  <span className="font-display text-3xl font-bold text-foreground">
                    Gratuit
                  </span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-bold" style={{ color: plan.color }}>
                      {plan.price}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">FCFA{plan.period}</span>
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                    <div
                      className="h-4 w-4 rounded-full flex items-center justify-center mt-0.5 shrink-0"
                      style={{ background: `${plan.color}20` }}
                    >
                      <Check className="h-2.5 w-2.5" style={{ color: plan.color }} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to={plan.priceNum === "0" ? "/auth?tab=signup" : `/payment?plan=${plan.plan}`}>
                <Button
                  className="w-full font-semibold"
                  variant={plan.popular ? "default" : "outline"}
                  style={
                    plan.popular
                      ? { background: "hsl(217, 90%, 42%)", color: "white", borderColor: "hsl(217, 90%, 42%)" }
                      : plan.priceNum === "0" ? {}
                      : { borderColor: plan.color, color: plan.color }
                  }
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center mt-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-sm text-muted-foreground">
          💳 Paiement accepté : <span className="font-semibold">Wave</span> · Orange Money · MTN Money · Moov Money
        </p>
      </motion.div>
    </div>
  </section>
);

export default PricingSection;

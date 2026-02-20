import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Crown, Shield, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Découverte",
    price: "Gratuit",
    priceNum: "0",
    plan: "decouverte",
    icon: Zap,
    description: "Pour débuter votre parcours IA",
    color: "hsl(220, 20%, 30%)",
    features: [
      "Accès à 2 modules d'initiation",
      "Quiz d'évaluation",
      "Forum communautaire",
      "Support par email",
    ],
    limitations: ["Certificats non inclus", "Modules avancés non inclus"],
    popular: false,
    cta: "Commencer gratuitement",
  },
  {
    name: "Essentiel",
    price: "5 000",
    priceNum: "5000",
    plan: "essentiel",
    icon: Shield,
    description: "L'entrée dans le monde IA",
    color: "hsl(217, 90%, 42%)",
    features: [
      "Accès illimité aux modules de base",
      "Vidéos de formation",
      "Quiz + évaluation finale",
      "Certificat de réussite numérique",
      "Support par email",
      "Accès au forum abonnés",
    ],
    limitations: [],
    popular: false,
    cta: "Choisir Essentiel",
  },
  {
    name: "Avancé",
    price: "12 500",
    priceNum: "12500",
    plan: "avance",
    icon: Rocket,
    description: "Pour progresser rapidement",
    color: "hsl(217, 90%, 42%)",
    features: [
      "Tout le plan Essentiel",
      "Accès aux modules avancés",
      "Alertes personnalisées prioritaires",
      "Support prioritaire",
      "Accès au forum abonnés",
      "Webinaires mensuels",
    ],
    limitations: [],
    popular: true,
    cta: "Choisir Avancé",
  },
  {
    name: "Premium",
    price: "20 000",
    priceNum: "20000",
    plan: "premium",
    icon: Crown,
    description: "L'expérience complète",
    color: "hsl(36, 95%, 48%)",
    features: [
      "Tout le plan Avancé",
      "Accès à TOUS les modules & secteurs",
      "Alertes stratégiques prioritaires",
      "Support VIP",
      "Webinaires mensuels + Replays",
      "Certificats officiels avec cachet",
      "Sessions coaching individuel",
    ],
    limitations: [],
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
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4" style={{ color: "hsl(220, 20%, 10%)" }}>
          Des prix <span className="gradient-text">accessibles à tous</span>
        </h2>
        <p className="text-base max-w-xl mx-auto" style={{ color: "hsl(220, 10%, 40%)" }}>
          Paiement simple et sécurisé via Wave, Orange Money, MTN Money. Commencez gratuitement, évoluez selon vos besoins.
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
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${plan.color}18` }}
                >
                  <plan.icon className="h-5 w-5" style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold" style={{ color: "hsl(220, 20%, 10%)" }}>
                    {plan.name}
                  </h3>
                  <p className="text-xs" style={{ color: "hsl(220, 10%, 50%)" }}>{plan.description}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 pb-5 border-b border-border">
                {plan.priceNum === "0" ? (
                  <span className="font-display text-3xl font-bold" style={{ color: "hsl(220, 20%, 10%)" }}>
                    Gratuit
                  </span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-bold" style={{ color: plan.color }}>
                      {plan.price}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "hsl(220, 10%, 50%)" }}>FCFA/mois</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm" style={{ color: "hsl(220, 20%, 20%)" }}>
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

              {/* CTA */}
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

      {/* Wave payment note */}
      <motion.div
        className="text-center mt-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-sm" style={{ color: "hsl(220, 10%, 50%)" }}>
          💳 Paiement accepté : <span className="font-semibold">Wave</span> · Orange Money · MTN Money · Moov Money
        </p>
      </motion.div>
    </div>
  </section>
);

export default PricingSection;

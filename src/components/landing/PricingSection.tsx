import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Découverte",
    price: "2 500",
    description: "Idéal pour s'initier",
    features: ["1 module au choix", "Support PDF téléchargeable", "Quiz d'évaluation", "Accès forum communautaire"],
    popular: false,
  },
  {
    name: "Essentiel",
    price: "5 000",
    description: "Le plus populaire",
    features: ["3 modules au choix", "Vidéos + PDF complets", "Quiz + évaluation finale", "Certificat de réussite", "Support par email"],
    popular: true,
  },
  {
    name: "Premium",
    price: "10 000",
    description: "L'expérience complète",
    features: ["Accès à tous les modules", "Tous les formats (vidéo, PDF, live)", "Certificat officiel", "Session physique possible", "Support prioritaire", "Accès aux replays illimité"],
    popular: false,
  },
];

const PricingSection = () => (
  <section id="tarifs" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-14">
        <span className="text-sm font-semibold text-accent uppercase tracking-wider">Tarifs</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Des prix <span className="gradient-text">accessibles à tous</span>
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Paiement simple et sécurisé via Mobile Money (Orange, MTN, Moov, Wave).
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-6 flex flex-col ${
              plan.popular
                ? "border-primary shadow-xl shadow-primary/10 scale-105"
                : "border-border bg-card"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full gradient-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                <Star className="h-3 w-3" /> Le plus choisi
              </div>
            )}

            <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

            <div className="mb-6">
              <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
              <span className="text-muted-foreground ml-1">FCFA</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${plan.popular ? "gradient-primary border-0 text-primary-foreground" : ""}`}
              variant={plan.popular ? "default" : "outline"}
            >
              Choisir ce forfait
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;

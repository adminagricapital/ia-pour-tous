import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Crown, Shield, Rocket, Sparkles, Code, Video, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Découverte", price: "Gratuit", priceNum: "0", period: "", plan: "decouverte", icon: Zap,
    description: "Testez sans engagement", color: "hsl(220, 20%, 30%)",
    features: ["Accès à 2 modules d'initiation", "Quiz d'évaluation", "Forum communautaire", "Support par email"],
    popular: false, cta: "Commencer gratuitement",
  },
  {
    name: "Essentiel", price: "500", priceNum: "500", period: "/semaine", plan: "essentiel", icon: Shield,
    description: "Pour bien démarrer", color: "hsl(217, 90%, 42%)",
    features: ["Accès aux modules de base", "Vidéos de formation", "Quiz + évaluation", "Certificat numérique", "Support par email", "Accès au forum abonnés"],
    popular: false, cta: "Choisir Essentiel",
  },
  {
    name: "Avancé", price: "1 500", priceNum: "1500", period: "/semaine", plan: "avance", icon: Rocket,
    description: "Pour progresser vite", color: "hsl(262, 70%, 45%)",
    features: ["Tout le plan Essentiel", "Modules avancés inclus", "Alertes personnalisées", "Support prioritaire", "Webinaires mensuels", "Replays des formations"],
    popular: true, cta: "Choisir Avancé",
  },
  {
    name: "Premium", price: "2 500", priceNum: "2500", period: "/semaine", plan: "premium", icon: Crown,
    description: "L'expérience complète", color: "hsl(36, 95%, 48%)",
    features: ["Tout le plan Avancé", "TOUS les modules & secteurs", "Support VIP dédié", "Webinaires illimités + Replays", "Certificats officiels avec cachet", "Sessions coaching individuel", "Bonus : session stratégique"],
    popular: false, cta: "Choisir Premium",
  },
];

const specialCourses = [
  {
    title: "Développement Web Front-End Professionnel",
    subtitle: "Sites vitrines, landing pages & applications modernes",
    originalPrice: 75000, discount: 25, promoEnd: "31 mars 2026", icon: Code,
    features: ["Formation complète développement Front-End", "Technologies modernes & Cloud", "Projet réel livré en production", "Certificat de formation professionnelle"],
    color: "hsl(217, 90%, 42%)", paymentType: "frontend",
  },
  {
    title: "Développement Fullstack — Front-End + Back-End",
    subtitle: "Applications complètes avec base de données & authentification",
    originalPrice: 150000, discount: 25, promoEnd: "31 mars 2026", icon: Sparkles,
    features: ["Front-End + Back-End complet", "Base de données & Authentification", "API & logique métier", "Projet professionnel livré", "Mentorat individuel", "Certificat professionnel"],
    color: "hsl(36, 95%, 48%)", paymentType: "fullstack",
  },
];

const videoCourses = [
  {
    title: "Création de Vidéos Pro avec IA — Formation Live",
    subtitle: "Formation complète avec accompagnement en direct",
    price: 25000, discount: 10, promoEnd: "31 mars 2026", icon: Video,
    features: ["Formation live interactive", "Création vidéo de A à Z avec IA", "Montage professionnel automatisé", "Assistance personnalisée — 1 mois", "Accès aux outils premium", "Projet vidéo finalisé"],
    color: "hsl(0, 72%, 51%)", paymentType: "video_live",
  },
  {
    title: "Création de Vidéos Pro avec IA — Replay",
    subtitle: "Accès aux vidéos de formation enregistrées",
    price: 15000, discount: 10, promoEnd: "31 mars 2026", icon: Camera,
    features: ["Vidéos de formation complètes", "Replay illimité à vie", "Techniques de création vidéo IA", "Montage & post-production IA", "Ressources & templates inclus"],
    color: "hsl(262, 70%, 45%)", paymentType: "video_replay",
  },
];

const PricingSection = () => (
  <section id="tarifs" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-4" style={{ background: "hsl(217, 90%, 95%)", color: "hsl(217, 90%, 42%)" }}>
          Nos Forfaits
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-foreground">
          Des prix <span className="gradient-text">accessibles à tous</span>
        </h2>
        <p className="text-base max-w-xl mx-auto text-muted-foreground">
          À partir de <strong>500 FCFA par semaine</strong>. Paiement simple via Wave, Orange Money, MTN Money.
        </p>
      </motion.div>

      {/* Subscription plans */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative rounded-2xl border flex flex-col ${plan.popular ? "shadow-xl border-2 border-primary" : "border-border bg-card shadow-sm"}`}
            style={{ background: plan.popular ? "hsl(262, 70%, 98%)" : "hsl(0, 0%, 100%)" }}>
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1 rounded-full text-xs font-bold" style={{ background: "hsl(262, 70%, 45%)", color: "white" }}>
                <Star className="h-3 w-3" /> Le plus populaire
              </div>
            )}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${plan.color}18` }}>
                  <plan.icon className="h-5 w-5" style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </div>
              <div className="mb-6 pb-5 border-b border-border">
                {plan.priceNum === "0" ? (
                  <span className="font-display text-3xl font-bold text-foreground">Gratuit</span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-bold" style={{ color: plan.color }}>{plan.price}</span>
                    <span className="text-sm font-semibold text-muted-foreground">FCFA{plan.period}</span>
                  </div>
                )}
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                    <div className="h-4 w-4 rounded-full flex items-center justify-center mt-0.5 shrink-0" style={{ background: `${plan.color}20` }}>
                      <Check className="h-2.5 w-2.5" style={{ color: plan.color }} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={plan.priceNum === "0" ? "/auth?tab=signup" : `/payment?plan=${plan.plan}`}>
                <Button className="w-full font-semibold" variant={plan.popular ? "default" : "outline"}
                  style={plan.popular ? { background: plan.color, color: "white" } : plan.priceNum === "0" ? {} : { borderColor: plan.color, color: plan.color }}>
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Special web dev courses */}
      <motion.div className="mt-16 max-w-5xl mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="text-center mb-8">
          <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-3" style={{ background: "hsl(36, 95%, 93%)", color: "hsl(36, 95%, 40%)" }}>
            🔥 Formations Spéciales — Développement Web
          </span>
          <h3 className="font-display text-2xl font-bold text-foreground">
            Apprenez à créer des <span className="gradient-text">sites web professionnels</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-2">Avec projet concret inclus • <strong className="text-destructive">-25% jusqu'au 31 mars 2026</strong></p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {specialCourses.map((course, i) => {
            const discountedPrice = course.originalPrice * (1 - course.discount / 100);
            return (
              <motion.div key={course.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="rounded-2xl border-2 border-border bg-card p-6 relative overflow-hidden hover:shadow-xl transition-shadow">
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "hsl(0, 72%, 51%)", color: "white" }}>
                  -{course.discount}% jusqu'au {course.promoEnd}
                </div>
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${course.color}15` }}>
                  <course.icon className="h-6 w-6" style={{ color: course.color }} />
                </div>
                <h4 className="font-display font-bold text-foreground mb-1">{course.title}</h4>
                <p className="text-xs text-muted-foreground mb-3">{course.subtitle}</p>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-display text-2xl font-bold" style={{ color: course.color }}>
                    {discountedPrice.toLocaleString()} FCFA
                  </span>
                  <span className="text-sm text-muted-foreground line-through">{course.originalPrice.toLocaleString()} FCFA</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {course.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-3.5 w-3.5 shrink-0" style={{ color: course.color }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link to={`/payment?type=special&course=${course.paymentType}&amount=${discountedPrice}`}>
                  <Button className="w-full font-semibold" style={{ background: course.color, color: "white" }}>
                    S'inscrire maintenant
                  </Button>
                </Link>
                <p className="text-[10px] text-muted-foreground text-center mt-3">Par Innocent KOFFI — Innovation & Consulting</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Video creation courses */}
      <motion.div className="mt-16 max-w-5xl mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="text-center mb-8">
          <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-3" style={{ background: "hsl(0, 72%, 95%)", color: "hsl(0, 72%, 45%)" }}>
            🎬 Formations Spéciales — Création Vidéo IA
          </span>
          <h3 className="font-display text-2xl font-bold text-foreground">
            Créez des <span className="gradient-text">vidéos professionnelles</span> avec l'IA
          </h3>
          <p className="text-sm text-muted-foreground mt-2">Photos → Vidéos dynamiques • Montage automatique • <strong className="text-destructive">-10% jusqu'au 31 mars 2026</strong></p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {videoCourses.map((course, i) => {
            const discountedPrice = course.price * (1 - course.discount / 100);
            return (
              <motion.div key={course.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="rounded-2xl border-2 border-border bg-card p-6 relative overflow-hidden hover:shadow-xl transition-shadow">
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "hsl(0, 72%, 51%)", color: "white" }}>
                  -{course.discount}% jusqu'au {course.promoEnd}
                </div>
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${course.color}15` }}>
                  <course.icon className="h-6 w-6" style={{ color: course.color }} />
                </div>
                <h4 className="font-display font-bold text-foreground mb-1">{course.title}</h4>
                <p className="text-xs text-muted-foreground mb-3">{course.subtitle}</p>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-display text-2xl font-bold" style={{ color: course.color }}>
                    {discountedPrice.toLocaleString()} FCFA
                  </span>
                  <span className="text-sm text-muted-foreground line-through">{course.price.toLocaleString()} FCFA</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {course.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-3.5 w-3.5 shrink-0" style={{ color: course.color }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link to={`/payment?type=special&course=${course.paymentType}&amount=${discountedPrice}`}>
                  <Button className="w-full font-semibold" style={{ background: course.color, color: "white" }}>
                    S'inscrire maintenant
                  </Button>
                </Link>
                <p className="text-[10px] text-muted-foreground text-center mt-3">Par Innocent KOFFI — Innovation & Consulting</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div className="text-center mt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <p className="text-sm text-muted-foreground">
          💳 Paiement accepté : <span className="font-semibold">Wave</span> · Orange Money · MTN Money · Moov Money
        </p>
      </motion.div>
    </div>
  </section>
);

export default PricingSection;

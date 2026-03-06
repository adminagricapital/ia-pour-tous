import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock, Send, MessageCircle, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const WHATSAPP_NUMBER = "2250759566087";

const Appointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    preferred_date: "",
    preferred_time: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
        if (profile) {
          setForm(prev => ({
            ...prev,
            full_name: profile.full_name || "",
            email: user.email || "",
            phone: profile.phone || "",
          }));
        }
      }
    };
    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent, sendToWhatsApp = false) => {
    e.preventDefault();
    if (!form.full_name || !form.preferred_date || !form.subject) {
      toast({ title: "Champs requis", description: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        await supabase.from("appointments").insert({
          user_id: currentUser.id,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          preferred_date: new Date(form.preferred_date).toISOString(),
          preferred_time: form.preferred_time,
          subject: form.subject,
          message: form.message,
        } as any);
      }

      if (sendToWhatsApp) {
        const whatsappMessage = encodeURIComponent(
          `📅 *DEMANDE DE RENDEZ-VOUS*\n\n` +
          `👤 *Nom :* ${form.full_name}\n` +
          `📧 *Email :* ${form.email}\n` +
          `📱 *Téléphone :* ${form.phone}\n` +
          `📅 *Date souhaitée :* ${new Date(form.preferred_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}\n` +
          `🕐 *Heure :* ${form.preferred_time || "À convenir"}\n` +
          `📋 *Objet :* ${form.subject}\n` +
          `💬 *Message :* ${form.message || "Aucun message complémentaire"}\n\n` +
          `_Envoyé depuis la plateforme IA Pour Tous_`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, "_blank");
      }

      setSubmitted(true);
      toast({ title: "✅ Demande envoyée", description: "Votre demande de rendez-vous a été enregistrée." });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
            <div className="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "hsl(142, 70%, 92%)" }}>
              <Check className="h-10 w-10" style={{ color: "hsl(142, 70%, 38%)" }} />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">Demande enregistrée ! 🎉</h1>
            <p className="text-muted-foreground mb-6">
              Votre demande de rendez-vous a été envoyée avec succès. Notre équipe vous contactera dans les plus brefs délais.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard">
                <Button className="gradient-primary border-0 text-primary-foreground">Mon espace</Button>
              </Link>
              <Link to="/">
                <Button variant="outline">Retour à l'accueil</Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="text-4xl mb-4 block">📅</span>
            <h1 className="font-display text-3xl font-bold text-foreground">Prendre rendez-vous</h1>
            <p className="text-muted-foreground mt-2">Planifiez un échange avec notre équipe d'experts en IA</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={(e) => handleSubmit(e, false)}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Nom complet *</Label>
                <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="Votre nom" required />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Email</Label>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Téléphone</Label>
              <Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+225 07 XX XX XX XX" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" /> Date souhaitée *
                </Label>
                <Input type="date" value={form.preferred_date} onChange={e => setForm({ ...form, preferred_date: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" /> Heure souhaitée
                </Label>
                <Input type="time" value={form.preferred_time} onChange={e => setForm({ ...form, preferred_time: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Objet du rendez-vous *</Label>
              <select
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                required
              >
                <option value="">Sélectionnez un motif</option>
                <option value="Formation individuelle">Formation individuelle</option>
                <option value="Formation entreprise">Formation pour mon entreprise</option>
                <option value="Conseil en IA">Conseil et accompagnement IA</option>
                <option value="Partenariat">Proposition de partenariat</option>
                <option value="Autre">Autre demande</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Message complémentaire</Label>
              <Textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Décrivez votre besoin..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="submit" disabled={loading} className="flex-1 gradient-primary border-0 text-primary-foreground gap-2 h-12">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Envoyer la demande
              </Button>
              <Button
                type="button"
                disabled={loading}
                onClick={(e) => handleSubmit(e as any, true)}
                className="flex-1 gap-2 h-12 font-semibold"
                style={{ background: "#25D366", color: "white" }}
              >
                <MessageCircle className="h-4 w-4" />
                Envoyer via WhatsApp
              </Button>
            </div>

            {!user && (
              <p className="text-xs text-center text-muted-foreground">
                <Link to="/auth" className="text-primary hover:underline">Connectez-vous</Link> pour sauvegarder votre demande dans votre espace.
              </p>
            )}
          </motion.form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Appointment;

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Calendar, Check, X, Clock, MessageCircle,
  User, Mail, Phone, Send, Loader2, AlertCircle
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "hsl(36, 95%, 94%)", text: "hsl(36, 95%, 35%)", label: "⏳ En attente" },
  confirmed: { bg: "hsl(142, 70%, 92%)", text: "hsl(142, 70%, 30%)", label: "✅ Confirmé" },
  rejected: { bg: "hsl(0, 72%, 94%)", text: "hsl(0, 72%, 35%)", label: "❌ Rejeté" },
  rescheduled: { bg: "hsl(217, 90%, 94%)", text: "hsl(217, 90%, 35%)", label: "📅 Reprogrammé" },
};

const AdminAppointments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [responseText, setResponseText] = useState("");
  const [suggestedDate, setSuggestedDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (!roles?.some(r => r.role === "admin")) { navigate("/dashboard"); return; }

      const { data } = await supabase.from("appointments").select("*").order("created_at", { ascending: false });
      setAppointments(data || []);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const updateStatus = async (id: string, status: string) => {
    setSaving(true);
    try {
      const updateData: any = { status };
      if (responseText) updateData.admin_response = responseText;
      if (suggestedDate) updateData.admin_suggested_date = new Date(suggestedDate).toISOString();

      await supabase.from("appointments").update(updateData).eq("id", id);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updateData } : a));
      toast({ title: "✅ Mis à jour" });
      setSelected(null);
      setResponseText("");
      setSuggestedDate("");
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <h1 className="font-display text-lg font-bold text-foreground">📅 Demandes de rendez-vous</h1>
          </div>
          <span className="text-sm text-muted-foreground">{appointments.length} demande(s)</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {appointments.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune demande de rendez-vous</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => {
              const statusInfo = statusColors[apt.status] || statusColors.pending;
              return (
                <div
                  key={apt.id}
                  className="rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => setSelected(apt)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                          style={{ background: statusInfo.bg, color: statusInfo.text }}
                        >
                          {statusInfo.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(apt.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-foreground">{apt.full_name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{apt.subject}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(apt.preferred_date).toLocaleDateString("fr-FR")}</span>
                        {apt.preferred_time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {apt.preferred_time}</span>}
                        {apt.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {apt.phone}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Demande de {selected?.full_name}</DialogTitle>
            <DialogDescription>{selected?.subject}</DialogDescription>
          </DialogHeader>
          
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> {selected.full_name}</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {selected.email || "—"}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {selected.phone || "—"}</div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> {new Date(selected.preferred_date).toLocaleDateString("fr-FR")}</div>
              </div>

              {selected.message && (
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Message</p>
                  <p className="text-sm text-foreground">{selected.message}</p>
                </div>
              )}

              <div className="space-y-3 border-t border-border pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Réponse / Motif</label>
                  <Textarea
                    value={responseText}
                    onChange={e => setResponseText(e.target.value)}
                    placeholder="Votre réponse au demandeur..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Proposer une autre date</label>
                  <Input type="datetime-local" value={suggestedDate} onChange={e => setSuggestedDate(e.target.value)} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => updateStatus(selected.id, "confirmed")} disabled={saving}
                  className="gap-1" style={{ background: "hsl(142, 70%, 38%)", color: "white" }}>
                  <Check className="h-3 w-3" /> Confirmer
                </Button>
                <Button size="sm" onClick={() => updateStatus(selected.id, "rescheduled")} disabled={saving}
                  className="gap-1" style={{ background: "hsl(217, 90%, 42%)", color: "white" }}>
                  <Calendar className="h-3 w-3" /> Reprogrammer
                </Button>
                <Button size="sm" variant="destructive" onClick={() => updateStatus(selected.id, "rejected")} disabled={saving}
                  className="gap-1">
                  <X className="h-3 w-3" /> Rejeter
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAppointments;

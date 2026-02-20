import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, Loader2, BookOpen, Plus, CheckCircle, Eye,
  Wand2, Brain, Image as ImageIcon, Zap, Target, ChevronRight,
  Settings, Layers, HelpCircle, Rocket
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const sectorOptions = [
  { value: "education", label: "🎓 Éducation & Enseignants" },
  { value: "commerce", label: "🛒 Commerce & Vente" },
  { value: "sante", label: "🏥 Santé & Médical" },
  { value: "artisanat", label: "🎨 Artisanat & Métiers" },
  { value: "eglise", label: "⛪ Églises & Religion" },
  { value: "association", label: "🤝 Associations" },
  { value: "entreprise", label: "🏢 Entreprises" },
  { value: "freelance", label: "💼 Freelances" },
  { value: "agriculture", label: "🌾 Agriculture" },
  { value: "cyber_imprimerie", label: "💻 Cyber & Imprimerie" },
  { value: "etudiant", label: "📚 Étudiants" },
];

const levelOptions = [
  { value: "debutant", label: "Débutant" },
  { value: "intermediaire", label: "Intermédiaire" },
  { value: "avance", label: "Avancé" },
];

interface AdminCourseGeneratorProps {
  onCoursePublished: () => void;
}

const AdminCourseGenerator = ({ onCoursePublished }: AdminCourseGeneratorProps) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [sector, setSector] = useState("education");
  const [level, setLevel] = useState("debutant");
  const [generateImages, setGenerateImages] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [previewModule, setPreviewModule] = useState<any>(null);
  const [publishing, setPublishing] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishConfig, setPublishConfig] = useState({ targetPlan: "decouverte", isPublished: true });

  const getSuggestions = async () => {
    setSuggesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-course", {
        body: { mode: "suggest", sector },
      });
      if (error) throw error;
      if (data?.suggestions) {
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      }
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSuggesting(false);
    }
  };

  const generateCourse = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setGeneratedCourse(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-course", {
        body: { prompt, sector, level, generateImages, mode: "generate" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.data) {
        setGeneratedCourse(data.data);
        toast({ title: "✅ Cours généré avec succès !", description: `${data.data.modules?.length || 0} modules créés` });
      }
    } catch (err: any) {
      toast({ title: "Erreur de génération", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const publishCourse = async () => {
    if (!generatedCourse) return;
    setPublishing(true);
    try {
      // Insert course
      const { data: courseRow, error: courseErr } = await supabase.from("courses").insert({
        title: generatedCourse.course.title,
        description: generatedCourse.course.description,
        sector: generatedCourse.course.sector as any,
        level: generatedCourse.course.level as any,
        duration_minutes: generatedCourse.course.duration_minutes || 120,
        format: "video" as any,
        is_published: publishConfig.isPublished,
        sort_order: Date.now(),
      } as any).select().single();

      if (courseErr) throw courseErr;

      // Insert modules and quizzes
      for (const mod of generatedCourse.modules || []) {
        const { data: moduleRow, error: modErr } = await supabase.from("modules").insert({
          course_id: courseRow.id,
          title: mod.title,
          content: mod.content,
          duration_minutes: mod.duration_minutes || 20,
          sort_order: mod.sort_order || 1,
          video_url: null,
          pdf_url: null,
        } as any).select().single();

        if (modErr) { console.error("Module insert error:", modErr); continue; }

        // Insert quiz if exists
        if (mod.quiz && mod.quiz.questions?.length) {
          const { data: quizRow, error: quizErr } = await supabase.from("quizzes").insert({
            module_id: moduleRow.id,
            title: mod.quiz.title,
            passing_score: mod.quiz.passing_score || 70,
          } as any).select().single();

          if (!quizErr && quizRow) {
            for (const q of mod.quiz.questions) {
              await supabase.from("quiz_questions").insert({
                quiz_id: quizRow.id,
                question: q.question,
                question_type: q.question_type || "qcm" as any,
                options: q.options as any,
                correct_answer: q.correct_answer,
                sort_order: q.sort_order || 1,
              } as any);
            }
          }
        }
      }

      toast({ title: "🎉 Cours publié !", description: `"${generatedCourse.course.title}" est maintenant en ligne.` });
      setGeneratedCourse(null);
      setPrompt("");
      setShowPublishDialog(false);
      onCoursePublished();
    } catch (err: any) {
      toast({ title: "Erreur de publication", description: err.message, variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-2 border-primary/20 bg-secondary/30 p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              Directeur des Études <span className="text-primary">IA</span>
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary">Assisté par IA</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Décrivez un sujet, une idée ou un simple mot. L'IA analyse, structure et génère un cours complet avec modules, quiz et illustrations.
            </p>
          </div>
        </div>
      </div>

      {/* Generation Form */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" /> Générer un nouveau cours
        </h3>

        {/* IA Suggest button */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20">
          <Zap className="h-5 w-5 text-accent shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">IA Tendances — Propositions automatiques</p>
            <p className="text-xs text-muted-foreground">L'IA analyse les tendances et propose des cours adaptés au marché africain</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={getSuggestions}
            disabled={suggesting}
            className="shrink-0 border-accent text-accent hover:bg-accent/10"
          >
            {suggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {suggesting ? "Analyse..." : "Suggestions IA"}
          </Button>
        </div>

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Propositions du Directeur des Études IA :</p>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setPrompt(s.title);
                  setSector(s.sector);
                  setLevel(s.level);
                  setShowSuggestions(false);
                }}
                className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                    <p className="text-xs text-accent mt-1">💡 {s.why}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">
              Décrivez le cours <span className="text-muted-foreground font-normal">(un mot, une phrase, ou un sujet)</span>
            </label>
            <Textarea
              placeholder="Ex: L'IA pour gérer mon commerce, ChatGPT pour les enseignants, Agriculture intelligente avec l'IA..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="min-h-[100px] text-sm resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Secteur cible</label>
              <select
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={sector}
                onChange={e => setSector(e.target.value)}
              >
                {sectorOptions.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Niveau</label>
              <select
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={level}
                onChange={e => setLevel(e.target.value)}
              >
                {levelOptions.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="checkbox"
              checked={generateImages}
              onChange={e => setGenerateImages(e.target.checked)}
              className="h-4 w-4"
            />
            <div>
              <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-primary" /> Générer des images IA pour les modules
              </p>
              <p className="text-xs text-muted-foreground">Illustrations professionnelles et cohérentes avec le contexte africain</p>
            </div>
          </label>

          <Button
            onClick={generateCourse}
            disabled={!prompt.trim() || generating}
            className="w-full gradient-primary border-0 text-primary-foreground font-semibold h-12 text-base gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Génération en cours... (peut prendre 30-60s)
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5" />
                Générer le cours complet
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generated Course Preview */}
      {generatedCourse && (
        <div className="rounded-2xl border-2 border-primary/30 bg-card overflow-hidden">
          {/* Course Header */}
          <div className="p-6 border-b border-border gradient-primary text-primary-foreground">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-2 block">Cours généré — Aperçu</span>
                <h3 className="font-display text-xl font-bold">{generatedCourse.course?.title}</h3>
                <p className="text-sm opacity-90 mt-1">{generatedCourse.course?.description}</p>
                <div className="flex items-center gap-3 mt-3 text-xs opacity-80">
                  <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {generatedCourse.course?.level}</span>
                  <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> {generatedCourse.modules?.length} modules</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {generatedCourse.course?.duration_minutes} min</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGeneratedCourse(null)}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Recréer
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowPublishDialog(true)}
                  className="bg-white text-primary hover:bg-white/90 font-semibold gap-1"
                >
                  <CheckCircle className="h-4 w-4" /> Publier
                </Button>
              </div>
            </div>
          </div>

          {/* Modules list */}
          <div className="p-6 space-y-3">
            <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" /> Modules générés ({generatedCourse.modules?.length})
            </h4>
            {generatedCourse.modules?.map((mod: any, i: number) => (
              <div key={i} className="rounded-xl border border-border p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{mod.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {mod.duration_minutes}min • {mod.quiz?.questions?.length || 0} questions quiz
                      {mod.image_url && " • 🖼️ Image générée"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewModule(mod)}
                    className="gap-1 text-primary shrink-0"
                  >
                    <Eye className="h-4 w-4" /> Voir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Module preview dialog */}
      <Dialog open={!!previewModule} onOpenChange={() => setPreviewModule(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">{previewModule?.title}</DialogTitle>
            <DialogDescription>Aperçu du contenu du module</DialogDescription>
          </DialogHeader>
          {previewModule?.image_url && (
            <img src={previewModule.image_url} alt={previewModule.title} className="w-full h-48 object-cover rounded-lg" />
          )}
          <div className="course-content">
            <MarkdownRenderer content={previewModule?.content || ""} />
          </div>
          {previewModule?.quiz && (
            <div className="border-t border-border pt-4 mt-4">
              <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" /> Quiz : {previewModule.quiz.title}
              </h4>
              <div className="space-y-3">
                {previewModule.quiz.questions?.map((q: any, qi: number) => (
                  <div key={qi} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium text-foreground mb-2">{qi + 1}. {q.question}</p>
                    <div className="flex flex-wrap gap-2">
                      {q.options?.map((opt: string, oi: number) => (
                        <span
                          key={oi}
                          className={`text-xs px-2 py-1 rounded-md ${opt === q.correct_answer ? "bg-green-100 text-green-700 font-semibold" : "bg-muted text-muted-foreground"}`}
                        >
                          {opt === q.correct_answer && "✓ "}{opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Publish config dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" /> Configuration de publication
            </DialogTitle>
            <DialogDescription>
              Configurez les paramètres de publication. L'IA peut tout remplir automatiquement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Plan requis pour accéder</label>
              <select
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={publishConfig.targetPlan}
                onChange={e => setPublishConfig({ ...publishConfig, targetPlan: e.target.value })}
              >
                <option value="decouverte">Découverte (Gratuit)</option>
                <option value="essentiel">Essentiel (5 000 FCFA)</option>
                <option value="avance">Avancé (12 500 FCFA)</option>
                <option value="premium">Premium (20 000 FCFA)</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={publishConfig.isPublished}
                onChange={e => setPublishConfig({ ...publishConfig, isPublished: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-foreground">Publier immédiatement (visible dans le catalogue)</span>
            </label>
            <Button
              onClick={publishCourse}
              disabled={publishing}
              className="w-full gradient-primary border-0 text-primary-foreground font-semibold h-11 gap-2"
            >
              {publishing ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
              {publishing ? "Publication en cours..." : "Confirmer la publication"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourseGenerator;

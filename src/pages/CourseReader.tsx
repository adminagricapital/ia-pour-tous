import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, BookOpen, CheckCircle, ChevronRight, Award,
  Bookmark, WifiOff, ChevronDown, ChevronUp, Target, Clock,
  PlayCircle, HelpCircle, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import HonorBoard from "@/components/HonorBoard";

const CourseReader = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [activeModule, setActiveModule] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savedOffline, setSavedOffline] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showHonorBoard, setShowHonorBoard] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      const [courseRes, modulesRes, enrollRes, profileRes] = await Promise.all([
        supabase.from("courses").select("*").eq("id", courseId!).single(),
        supabase.from("modules").select("*").eq("course_id", courseId!).order("sort_order"),
        supabase.from("enrollments").select("*").eq("course_id", courseId!).eq("user_id", user.id).maybeSingle(),
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      ]);

      setCourse(courseRes.data);
      setModules(modulesRes.data || []);
      setEnrollment(enrollRes.data);
      setProfile(profileRes.data);

      if (!enrollRes.data) {
        await supabase.from("enrollments").insert({ course_id: courseId!, user_id: user.id });
      }

      if (modulesRes.data?.length) setActiveModule(modulesRes.data[0]);
      setLoading(false);
    };
    init();
  }, [courseId, navigate]);

  const saveForOffline = async () => {
    if (!("caches" in window)) {
      toast({ title: "Non supporté", description: "Votre navigateur ne supporte pas le cache hors ligne.", variant: "destructive" });
      return;
    }
    try {
      const cache = await caches.open("course-content-v1");
      const contentToCache = JSON.stringify({ course, modules });
      const response = new Response(contentToCache, { headers: { "Content-Type": "application/json" } });
      await cache.put(`/offline/course/${courseId}`, response);
      setSavedOffline(true);
      toast({ title: "Sauvegardé 📱", description: "Ce cours est disponible hors ligne. Aucun fichier téléchargé sur votre appareil." });
    } catch {
      toast({ title: "Erreur", description: "Impossible de sauvegarder hors ligne.", variant: "destructive" });
    }
  };

  const loadQuiz = async (moduleId: string) => {
    const { data: quizData } = await supabase.from("quizzes").select("*").eq("module_id", moduleId).maybeSingle();
    if (quizData) {
      setQuiz(quizData);
      const { data: questions } = await supabase.from("quiz_questions").select("*").eq("quiz_id", quizData.id).order("sort_order");
      setQuizQuestions(questions || []);
      setAnswers({});
      setQuizResult(null);
      setShowHonorBoard(false);
    } else {
      setQuiz(null);
      setQuizQuestions([]);
    }
  };

  const selectModule = (mod: any) => {
    setActiveModule(mod);
    setQuiz(null);
    setQuizQuestions([]);
    setQuizResult(null);
    setAnswers({});
    setShowHonorBoard(false);
    setSidebarOpen(false);
  };

  const submitQuiz = async () => {
    if (!quiz) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let correct = 0;
    quizQuestions.forEach(q => {
      if (answers[q.id] === q.correct_answer) correct++;
    });
    const score = Math.round((correct / quizQuestions.length) * 100);
    const passed = score >= (quiz.passing_score || 70);

    await supabase.from("quiz_attempts").insert({
      quiz_id: quiz.id,
      user_id: user.id,
      score,
      passed,
      answers: answers as any,
    });

    setQuizResult({ score, passed, correct, total: quizQuestions.length });

    if (passed) {
      setShowHonorBoard(true);
      const moduleIndex = modules.findIndex(m => m.id === activeModule.id);
      const newProgress = Math.round(((moduleIndex + 1) / modules.length) * 100);
      await supabase.from("enrollments").update({
        progress_percent: newProgress,
        completed: newProgress >= 100,
        completed_at: newProgress >= 100 ? new Date().toISOString() : null,
      }).eq("course_id", courseId!).eq("user_id", user.id);
    }
  };

  const moduleIndex = modules.findIndex(m => m.id === activeModule?.id);
  const progress = modules.length > 0 ? Math.round(((moduleIndex + 1) / modules.length) * 100) : 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="text-sm text-muted-foreground">Chargement du cours...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-foreground text-sm truncate">{course?.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex-1 max-w-32 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={saveForOffline}
            className={`gap-1 text-xs shrink-0 ${savedOffline ? "border-green-400 text-green-600" : ""}`}
          >
            {savedOffline ? <WifiOff className="h-3 w-3" /> : <Bookmark className="h-3 w-3" />}
            <span className="hidden sm:block">{savedOffline ? "Disponible hors ligne" : "Lire hors ligne"}</span>
          </Button>

          {/* Mobile sidebar toggle */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden gap-1 text-xs"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <BookOpen className="h-4 w-4" />
            {sidebarOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-57px)]">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || true) && (
            <aside
              className={`${sidebarOpen ? "block" : "hidden"} lg:block w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-border bg-card lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] overflow-y-auto shrink-0`}
            >
              <div className="p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Plan du cours — {modules.length} modules
                </p>
                <div className="space-y-1">
                  {modules.map((mod, i) => {
                    const isActive = activeModule?.id === mod.id;
                    const isDone = i < moduleIndex;
                    return (
                      <button
                        key={mod.id}
                        onClick={() => selectModule(mod)}
                        className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                          isActive
                            ? "bg-primary/10 border border-primary/30 shadow-sm"
                            : isDone
                            ? "bg-green-50 border border-green-200/50 hover:bg-green-50"
                            : "hover:bg-muted border border-transparent"
                        }`}
                      >
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isActive
                            ? "gradient-primary text-primary-foreground"
                            : isDone
                            ? "bg-green-100 text-green-600"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {isDone ? <Check className="h-3 w-3" /> : i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : isDone ? "text-green-700" : "text-foreground"}`}>
                            {mod.title}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-2.5 w-2.5" />
                            {mod.duration_minutes} min
                          </p>
                        </div>
                        {isActive && <ChevronRight className="h-4 w-4 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            {activeModule && (
              <motion.div
                key={activeModule.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                {/* Module Header */}
                <div className="rounded-2xl overflow-hidden border border-border">
                  {activeModule.image_url && (
                    <img
                      src={activeModule.image_url}
                      alt={activeModule.title}
                      className="w-full h-52 object-cover"
                    />
                  )}
                  {!activeModule.image_url && (
                    <div className="h-28 gradient-primary flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-primary-foreground/30" />
                    </div>
                  )}
                  <div className="p-5 bg-card">
                    <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" /> Module {moduleIndex + 1}/{modules.length}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {activeModule.duration_minutes} min
                      </span>
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                      {activeModule.title}
                    </h2>
                  </div>
                </div>

                {/* Video */}
                {activeModule.video_url && (
                  <div className="rounded-2xl overflow-hidden border border-border bg-black aspect-video shadow-md">
                    <iframe
                      src={activeModule.video_url}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={activeModule.title}
                    />
                  </div>
                )}

                {/* Module Content */}
                {activeModule.content && (
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8 course-content">
                      <MarkdownRenderer content={activeModule.content} />
                    </div>
                  </div>
                )}

                {/* Quiz Section */}
                {!quiz && (
                  <div
                    className="rounded-2xl border-2 border-dashed border-primary/30 p-6 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all"
                    onClick={() => loadQuiz(activeModule.id)}
                  >
                    <HelpCircle className="h-10 w-10 text-primary/40 mx-auto mb-3" />
                    <h3 className="font-display font-bold text-foreground mb-1">Valider vos acquis</h3>
                    <p className="text-sm text-muted-foreground mb-4">Passez le quiz pour débloquer le module suivant et recevoir votre attestation</p>
                    <Button className="gradient-primary border-0 text-primary-foreground gap-2 shadow-sm">
                      <Award className="h-4 w-4" /> Commencer le quiz
                    </Button>
                  </div>
                )}

                {/* Honor Board */}
                {showHonorBoard && quizResult?.passed && (
                  <HonorBoard
                    userName={profile?.full_name || "Apprenant"}
                    courseName={course?.title || ""}
                    moduleName={activeModule.title}
                    score={quizResult.score}
                    date={new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  />
                )}

                {/* Quiz UI */}
                {quiz && quizQuestions.length > 0 && !showHonorBoard && (
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-border" style={{ background: "hsl(217, 90%, 97%)" }}>
                      <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" /> {quiz.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Score requis : <span className="font-semibold text-primary">{quiz.passing_score}%</span> · {quizQuestions.length} questions
                      </p>
                    </div>

                    <div className="p-6 space-y-6">
                      {quizQuestions.map((q, qi) => (
                        <div key={q.id} className="space-y-3">
                          <p className="font-semibold text-foreground text-sm leading-relaxed">
                            <span
                              className="inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold mr-2 shrink-0"
                              style={{ background: "hsl(217, 90%, 42%)", color: "white" }}
                            >
                              {qi + 1}
                            </span>
                            {q.question}
                          </p>
                          {q.question_type === "vrai_faux" ? (
                            <div className="flex gap-3">
                              {["Vrai", "Faux"].map(opt => (
                                <button
                                  key={opt}
                                  onClick={() => !quizResult && setAnswers({ ...answers, [q.id]: opt })}
                                  disabled={!!quizResult}
                                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                    quizResult
                                      ? opt === q.correct_answer
                                        ? "border-green-400 bg-green-50 text-green-700"
                                        : answers[q.id] === opt
                                        ? "border-red-400 bg-red-50 text-red-700"
                                        : "border-border bg-muted text-muted-foreground"
                                      : answers[q.id] === opt
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-border hover:border-primary/50 bg-background text-foreground"
                                  }`}
                                >
                                  {quizResult && opt === q.correct_answer && <Check className="h-4 w-4 inline mr-1" />}
                                  {opt}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {(q.options as string[])?.map((opt: string) => (
                                <button
                                  key={opt}
                                  onClick={() => !quizResult && setAnswers({ ...answers, [q.id]: opt })}
                                  disabled={!!quizResult}
                                  className={`w-full text-left p-3.5 rounded-xl border-2 text-sm transition-all ${
                                    quizResult
                                      ? opt === q.correct_answer
                                        ? "border-green-400 bg-green-50 text-green-700 font-semibold"
                                        : answers[q.id] === opt && opt !== q.correct_answer
                                        ? "border-red-400 bg-red-50 text-red-700"
                                        : "border-border bg-muted/50 text-muted-foreground"
                                      : answers[q.id] === opt
                                      ? "border-primary bg-primary/10 text-primary font-semibold"
                                      : "border-border hover:border-primary/40 bg-background text-foreground"
                                  }`}
                                >
                                  {quizResult && opt === q.correct_answer && "✓ "}{opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {quizResult ? (
                        <div className={`rounded-xl p-5 border-2 ${quizResult.passed ? "border-green-300 bg-green-50" : "border-red-200 bg-red-50"}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className={`h-6 w-6 ${quizResult.passed ? "text-green-600" : "text-red-500"}`} />
                            <span className={`font-display text-lg font-bold ${quizResult.passed ? "text-green-700" : "text-red-700"}`}>
                              {quizResult.passed ? "Excellent ! Module validé 🎉" : "Continuez à apprendre !"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Votre score : <strong>{quizResult.score}%</strong> ({quizResult.correct}/{quizResult.total} bonnes réponses)
                          </p>
                          {quizResult.passed && moduleIndex < modules.length - 1 && (
                            <Button
                              onClick={() => selectModule(modules[moduleIndex + 1])}
                              className="mt-4 gradient-primary border-0 text-primary-foreground gap-2"
                              size="sm"
                            >
                              Module suivant <ChevronRight className="h-4 w-4" />
                            </Button>
                          )}
                          {!quizResult.passed && (
                            <Button
                              onClick={() => { setQuizResult(null); setAnswers({}); }}
                              variant="outline"
                              className="mt-4"
                              size="sm"
                            >
                              Réessayer
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button
                          onClick={submitQuiz}
                          className="gradient-primary border-0 text-primary-foreground font-semibold h-11 gap-2 shadow-sm"
                          disabled={Object.keys(answers).length < quizQuestions.length}
                        >
                          <PlayCircle className="h-5 w-5" />
                          Soumettre mes réponses
                          {Object.keys(answers).length < quizQuestions.length && (
                            <span className="ml-1 text-xs opacity-75">
                              ({Object.keys(answers).length}/{quizQuestions.length})
                            </span>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  {moduleIndex > 0 ? (
                    <Button
                      variant="outline"
                      onClick={() => selectModule(modules[moduleIndex - 1])}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" /> Précédent
                    </Button>
                  ) : <div />}
                  {moduleIndex < modules.length - 1 && (
                    <Button
                      onClick={() => selectModule(modules[moduleIndex + 1])}
                      className="gradient-primary border-0 text-primary-foreground gap-2 shadow-sm"
                    >
                      Module suivant <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseReader;

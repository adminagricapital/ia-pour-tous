import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, BookOpen, FileText, Play, CheckCircle, ChevronRight, Award, Download } from "lucide-react";
import { motion } from "framer-motion";
import MarkdownRenderer from "@/components/MarkdownRenderer";

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

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      const [courseRes, modulesRes, enrollRes] = await Promise.all([
        supabase.from("courses").select("*").eq("id", courseId!).single(),
        supabase.from("modules").select("*").eq("course_id", courseId!).order("sort_order"),
        supabase.from("enrollments").select("*").eq("course_id", courseId!).eq("user_id", user.id).maybeSingle(),
      ]);

      setCourse(courseRes.data);
      setModules(modulesRes.data || []);
      setEnrollment(enrollRes.data);

      if (!enrollRes.data) {
        // Auto-enroll
        await supabase.from("enrollments").insert({ course_id: courseId!, user_id: user.id });
      }

      if (modulesRes.data?.length) setActiveModule(modulesRes.data[0]);
      setLoading(false);
    };
    init();
  }, [courseId, navigate]);

  const loadQuiz = async (moduleId: string) => {
    const { data: quizData } = await supabase.from("quizzes").select("*").eq("module_id", moduleId).maybeSingle();
    if (quizData) {
      setQuiz(quizData);
      const { data: questions } = await supabase.from("quiz_questions").select("*").eq("quiz_id", quizData.id).order("sort_order");
      setQuizQuestions(questions || []);
      setAnswers({});
      setQuizResult(null);
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
      // Update progress
      const moduleIndex = modules.findIndex(m => m.id === activeModule.id);
      const newProgress = Math.round(((moduleIndex + 1) / modules.length) * 100);
      await supabase.from("enrollments").update({
        progress_percent: newProgress,
        completed: newProgress >= 100,
        completed_at: newProgress >= 100 ? new Date().toISOString() : null,
      }).eq("course_id", courseId!).eq("user_id", user.id);

      toast({ title: "Quiz réussi ! 🎉", description: `Score : ${score}%` });
    } else {
      toast({ title: "Quiz non réussi", description: `Score : ${score}%. Il faut ${quiz.passing_score}% pour valider.`, variant: "destructive" });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-foreground text-sm truncate">{course?.title}</h1>
            <p className="text-xs text-muted-foreground">{modules.length} modules</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Module list */}
        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-card lg:min-h-[calc(100vh-57px)] overflow-y-auto">
          <div className="p-4">
            <h2 className="font-display font-semibold text-foreground text-sm mb-3">Modules</h2>
            <div className="space-y-1">
              {modules.map((mod, i) => (
                <button
                  key={mod.id}
                  onClick={() => selectModule(mod)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                    activeModule?.id === mod.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"
                  }`}
                >
                  <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    activeModule?.id === mod.id ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{mod.title}</p>
                    <p className="text-xs text-muted-foreground">{mod.duration_minutes} min</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl">
          {activeModule && (
            <motion.div key={activeModule.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-4">{activeModule.title}</h2>

              {/* Video player */}
              {activeModule.video_url && (
                <div className="mb-6 rounded-xl overflow-hidden border border-border bg-black aspect-video">
                  <iframe
                    src={activeModule.video_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={activeModule.title}
                  />
                </div>
              )}

              {/* PDF viewer */}
              {activeModule.pdf_url && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground flex items-center gap-2"><FileText className="h-4 w-4" /> Document PDF</span>
                    <a href={activeModule.pdf_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-1"><Download className="h-3 w-3" /> Télécharger</Button>
                    </a>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-border" style={{ height: "600px" }}>
                    <iframe src={activeModule.pdf_url} className="w-full h-full" title="PDF" />
                  </div>
                </div>
              )}

              {/* Module content */}
              {activeModule.content && (
                <div className="mb-6 rounded-xl border border-border bg-card p-6">
                  <MarkdownRenderer content={activeModule.content} />
                </div>
              )}

              {/* Quiz button */}
              {!quiz && (
                <Button onClick={() => loadQuiz(activeModule.id)} variant="outline" className="gap-2 mb-6">
                  <Award className="h-4 w-4" /> Passer le quiz de ce module
                </Button>
              )}

              {/* Quiz */}
              {quiz && quizQuestions.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" /> {quiz.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">Score minimum : {quiz.passing_score}%</p>

                  <div className="space-y-6">
                    {quizQuestions.map((q, qi) => (
                      <div key={q.id} className="border-b border-border pb-4 last:border-0">
                        <p className="font-medium text-foreground mb-3">{qi + 1}. {q.question}</p>
                        {q.question_type === "vrai_faux" ? (
                          <div className="flex gap-3">
                            {["Vrai", "Faux"].map(opt => (
                              <button
                                key={opt}
                                onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                  answers[q.id] === opt ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/30"
                                } ${quizResult ? (opt === q.correct_answer ? "border-green-500 bg-green-50 text-green-700" : answers[q.id] === opt ? "border-red-500 bg-red-50 text-red-700" : "") : ""}`}
                                disabled={!!quizResult}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {(q.options as string[])?.map((opt: string) => (
                              <button
                                key={opt}
                                onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                                className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                                  answers[q.id] === opt ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/30"
                                } ${quizResult ? (opt === q.correct_answer ? "border-green-500 bg-green-50 text-green-700" : answers[q.id] === opt && opt !== q.correct_answer ? "border-red-500 bg-red-50 text-red-700" : "") : ""}`}
                                disabled={!!quizResult}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {quizResult ? (
                    <div className={`mt-6 p-4 rounded-lg ${quizResult.passed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className={`h-5 w-5 ${quizResult.passed ? "text-green-600" : "text-red-600"}`} />
                        <span className={`font-bold ${quizResult.passed ? "text-green-700" : "text-red-700"}`}>
                          {quizResult.passed ? "Félicitations !" : "Essayez encore"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Score : {quizResult.score}% ({quizResult.correct}/{quizResult.total} bonnes réponses)
                      </p>
                      {quizResult.passed && modules.indexOf(activeModule) < modules.length - 1 && (
                        <Button
                          onClick={() => selectModule(modules[modules.indexOf(activeModule) + 1])}
                          className="mt-3 gradient-primary border-0 text-primary-foreground gap-2"
                          size="sm"
                        >
                          Module suivant <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={submitQuiz}
                      className="mt-6 gradient-primary border-0 text-primary-foreground"
                      disabled={Object.keys(answers).length < quizQuestions.length}
                    >
                      Valider le quiz
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseReader;

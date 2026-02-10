import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { MessageSquare, Plus, Send, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Forum = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    const { data } = await supabase.from("forum_topics").select("*").order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
    setTopics(data || []);
    setLoading(false);
  };

  const openTopic = async (topic: any) => {
    setSelectedTopic(topic);
    const { data } = await supabase.from("forum_replies").select("*").eq("topic_id", topic.id).order("created_at");
    setReplies(data || []);
  };

  const createTopic = async () => {
    if (!user) { toast({ title: "Connectez-vous d'abord", variant: "destructive" }); return; }
    if (!newTitle.trim()) return;
    await supabase.from("forum_topics").insert({ title: newTitle, content: newContent, author_id: user.id } as any);
    setNewTitle(""); setNewContent(""); setShowForm(false);
    fetchTopics();
    toast({ title: "Sujet créé !" });
  };

  const sendReply = async () => {
    if (!user) { toast({ title: "Connectez-vous d'abord", variant: "destructive" }); return; }
    if (!replyContent.trim()) return;
    await supabase.from("forum_replies").insert({ topic_id: selectedTopic.id, content: replyContent, author_id: user.id } as any);
    setReplyContent("");
    const { data } = await supabase.from("forum_replies").select("*").eq("topic_id", selectedTopic.id).order("created_at");
    setReplies(data || []);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              <span className="gradient-text">Forum</span> Communautaire
            </h1>
            <p className="text-muted-foreground mt-2">Échangez, posez vos questions et partagez vos expériences</p>
          </motion.div>

          {!selectedTopic ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-muted-foreground">{topics.length} sujets</span>
                <Button onClick={() => setShowForm(!showForm)} className="gradient-primary border-0 text-primary-foreground gap-2" size="sm">
                  <Plus className="h-4 w-4" /> Nouveau sujet
                </Button>
              </div>

              {showForm && (
                <div className="rounded-xl border border-border bg-card p-6 mb-6 space-y-4">
                  <Input placeholder="Titre du sujet" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                  <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]" placeholder="Décrivez votre sujet..." value={newContent} onChange={e => setNewContent(e.target.value)} />
                  <Button onClick={createTopic} className="gradient-primary border-0 text-primary-foreground">Publier</Button>
                </div>
              )}

              <div className="space-y-3">
                {topics.map((topic, i) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => openTopic(topic)}
                    className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-foreground text-sm">{topic.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{topic.content}</p>
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {new Date(topic.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                        </span>
                      </div>
                      {topic.is_pinned && <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">Épinglé</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setSelectedTopic(null)} className="mb-4">← Retour aux sujets</Button>
              <div className="rounded-xl border border-border bg-card p-6 mb-6">
                <h2 className="font-display text-xl font-bold text-foreground">{selectedTopic.title}</h2>
                <p className="text-sm text-foreground mt-2">{selectedTopic.content}</p>
                <span className="text-xs text-muted-foreground mt-2 block">{new Date(selectedTopic.created_at).toLocaleDateString("fr-FR")}</span>
              </div>

              <div className="space-y-3 mb-6">
                {replies.map((r: any) => (
                  <div key={r.id} className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-foreground">{r.content}</p>
                    <span className="text-xs text-muted-foreground mt-2 block">{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                ))}
              </div>

              {user && (
                <div className="flex gap-2">
                  <Input placeholder="Votre réponse..." value={replyContent} onChange={e => setReplyContent(e.target.value)} className="flex-1" onKeyDown={e => e.key === "Enter" && sendReply()} />
                  <Button onClick={sendReply} className="gradient-primary border-0 text-primary-foreground"><Send className="h-4 w-4" /></Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Forum;

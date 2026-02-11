import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    supabase.from("blog_posts").select("*").eq("is_published", true).order("created_at", { ascending: false })
      .then(({ data }) => { setPosts(data || []); setLoading(false); });
  }, []);

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <Button variant="ghost" onClick={() => setSelectedPost(null)} className="mb-6 gap-1">
              <ArrowLeft className="h-4 w-4" /> Retour aux articles
            </Button>
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {selectedPost.thumbnail_url && (
                <img src={selectedPost.thumbnail_url} alt="" className="w-full h-64 object-cover rounded-xl mb-6" />
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4" />
                {new Date(selectedPost.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6 uppercase">{selectedPost.title}</h1>
              <MarkdownRenderer content={selectedPost.content || ""} />
            </motion.article>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              <span className="gradient-text">Blog</span> IA Pour Tous
            </h1>
            <p className="text-muted-foreground mt-3">Actualités, tutoriels et conseils sur l'IA</p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">Aucun article pour le moment. Revenez bientôt !</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedPost(post)}
                  className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                >
                  {post.thumbnail_url ? (
                    <img src={post.thumbnail_url} alt="" className="h-40 w-full object-cover" />
                  ) : (
                    <div className="h-40 gradient-primary" />
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <h2 className="font-display font-semibold text-foreground mb-2 uppercase">{post.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.content?.replace(/[#*_>\[\]]/g, "").substring(0, 150)}...</p>
                    <span className="text-sm text-primary font-medium mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Lire la suite <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;

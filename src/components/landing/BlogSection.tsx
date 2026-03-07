import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogSection = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      setPosts(data || []);
    };
    fetchPosts();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span
            className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-4"
            style={{ background: "hsl(217, 90%, 95%)", color: "hsl(217, 90%, 42%)" }}
          >
            <Newspaper className="h-3.5 w-3.5 inline mr-1" />
            Actualités & Blog
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Dernières <span className="gradient-text">actualités IA</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Restez informé sur les dernières tendances de l'Intelligence Artificielle.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {post.thumbnail_url ? (
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="h-44 gradient-primary flex items-center justify-center">
                  <Newspaper className="h-12 w-12 text-primary-foreground/30" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.published_at || post.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <h3 className="font-display font-bold text-foreground text-sm line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {post.content?.replace(/<[^>]*>/g, "").slice(0, 120)}...
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/blog">
            <Button variant="outline" className="gap-2">
              Voir toutes les actualités <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

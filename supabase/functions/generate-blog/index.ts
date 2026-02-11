import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { content, generateImage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Generate article content
    const articleResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Tu es un rédacteur professionnel pour la plateforme "IA Pour Tous", spécialisée en formation à l'Intelligence Artificielle en Afrique.

À partir du texte fourni (même un seul mot), génère un article complet et professionnel.

RÈGLES DE FORMATAGE :
- Le contenu doit être en Markdown propre
- Titres de sections en ## MAJUSCULES ET GRAS
- Phrases d'accroche en *italique*
- Paragraphes bien aérés avec des sauts de ligne
- Utiliser **gras** pour les points clés
- Listes à puces structurées
- Citations avec > si pertinent
- Jamais de balises HTML

RÈGLES DE CONTENU :
- Ton professionnel mais accessible
- Contexte africain et ivoirien
- Exemples concrets et pratiques
- Pas d'exagération marketing
- Conclusion avec appel à l'action vers la plateforme

Réponds UNIQUEMENT avec un JSON valide (pas de markdown autour) :
{
  "title": "TITRE EN MAJUSCULES",
  "slug": "slug-url-convivial",
  "summary": "Phrase d'accroche courte et engageante",
  "content": "Contenu complet en Markdown...",
  "tags": ["tag1", "tag2"]
}`
          },
          { role: "user", content: content || "Intelligence Artificielle en Afrique" }
        ],
      }),
    });

    if (!articleResponse.ok) {
      const status = articleResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes. Réessayez dans quelques instants." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const articleData = await articleResponse.json();
    const rawText = articleData.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response
    let article;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      article = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      article = {
        title: "ARTICLE GÉNÉRÉ",
        slug: "article-genere-" + Date.now(),
        summary: "",
        content: rawText,
        tags: []
      };
    }

    // Generate image if requested
    let imageBase64 = null;
    if (generateImage) {
      try {
        const imgResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [
              {
                role: "user",
                content: `Generate a professional, realistic photograph for a blog article titled "${article.title}". The image should be relevant to AI and technology in Africa. Professional, clean, modern, no text overlay, no watermarks. 16:9 aspect ratio.`
              }
            ],
            modalities: ["image", "text"],
          }),
        });
        
        if (imgResponse.ok) {
          const imgData = await imgResponse.json();
          imageBase64 = imgData.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;
        }
      } catch (imgErr) {
        console.error("Image generation failed:", imgErr);
      }
    }

    return new Response(JSON.stringify({ ...article, image: imageBase64 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-blog error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

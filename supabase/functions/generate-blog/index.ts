import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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
    let imageUrl = null;
    if (generateImage) {
      try {
        console.log("Starting image generation for:", article.title);
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
        
        console.log("Image generation response status:", imgResponse.status);
        
        if (imgResponse.ok) {
          const imgData = await imgResponse.json();
          console.log("Image response keys:", JSON.stringify(Object.keys(imgData)));
          
          // Try multiple possible response formats
          const msg = imgData.choices?.[0]?.message;
          let base64Data = null;
          
          // Format 1: images array
          if (msg?.images?.[0]?.image_url?.url) {
            base64Data = msg.images[0].image_url.url;
            console.log("Found image in images array format");
          }
          // Format 2: content with inline_data parts
          else if (msg?.content && Array.isArray(msg.content)) {
            for (const part of msg.content) {
              if (part.type === "image_url" && part.image_url?.url) {
                base64Data = part.image_url.url;
                console.log("Found image in content array format");
                break;
              }
            }
          }
          // Format 3: direct base64 in a field
          else if (msg?.image) {
            base64Data = msg.image;
            console.log("Found image in direct image field");
          }
          
          console.log("base64Data found:", !!base64Data, base64Data ? `length: ${base64Data.length}` : "null");
          
          // Upload to Supabase Storage if we got base64
          if (base64Data) {
            try {
              // Strip the data URI prefix if present
              const rawBase64 = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;
              
              // Decode base64 to bytes
              const binaryString = atob(rawBase64);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              
              const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
              const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
              const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
              
              const fileName = `blog/ai-${Date.now()}.png`;
              const { error: uploadError } = await supabaseAdmin.storage
                .from("course-content")
                .upload(fileName, bytes, { contentType: "image/png", upsert: true });
              
              if (uploadError) {
                console.error("Storage upload error:", uploadError.message);
              } else {
                const { data: urlData } = supabaseAdmin.storage
                  .from("course-content")
                  .getPublicUrl(fileName);
                imageUrl = urlData.publicUrl;
                console.log("Image uploaded successfully:", imageUrl);
              }
            } catch (uploadErr) {
              console.error("Upload processing error:", uploadErr);
              // Fallback: return base64 directly
              imageUrl = base64Data.startsWith("data:") ? base64Data : `data:image/png;base64,${base64Data}`;
            }
          } else {
            console.log("Full image response message:", JSON.stringify(msg).substring(0, 500));
          }
        } else {
          const errText = await imgResponse.text();
          console.error("Image generation failed:", imgResponse.status, errText);
        }
      } catch (imgErr) {
        console.error("Image generation error:", imgErr);
      }
    }

    return new Response(JSON.stringify({ ...article, image: imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-blog error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

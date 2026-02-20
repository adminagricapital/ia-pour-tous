import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, sector, level, generateImages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Mode: "suggest" = IA propose des cours basés sur tendances
    // Mode: "generate" = IA génère un cours complet
    
    if (mode === "suggest") {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              content: `Tu es le Directeur des Études de la plateforme "IA Pour Tous", une plateforme de formation en Intelligence Artificielle adaptée au contexte africain et ivoirien.

Analyse les tendances actuelles en IA et en formation numérique en Afrique, puis propose 5 idées de cours pertinentes, innovantes et adaptées au marché local.

Réponds UNIQUEMENT avec un JSON valide :
{
  "suggestions": [
    {
      "title": "Titre accrocheur du cours",
      "description": "Description en 2-3 phrases, engageante et claire",
      "sector": "education|commerce|sante|artisanat|eglise|association|entreprise|freelance|agriculture|cyber_imprimerie|etudiant",
      "level": "debutant|intermediaire|avance",
      "duration_minutes": 90,
      "why": "Pourquoi ce cours est pertinent maintenant"
    }
  ]
}`
            },
            { role: "user", content: `Propose des cours innovants pour le contexte africain 2025-2026. Secteur prioritaire: ${sector || "tous"}` }
          ],
        }),
      });

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content || "";
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
      
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GENERATE mode: create a full course with modules
    const systemPrompt = `Tu es le Directeur des Études et expert pédagogique de "IA Pour Tous". Tu dois créer un cours complet, professionnel, inspirant et pédagogiquement excellent, adapté au contexte africain.

RÈGLES OBLIGATOIRES :
- Contenu en Markdown riche et structuré
- Utiliser des tableaux comparatifs quand pertinent
- Inclure des exemples concrets tirés du contexte africain
- Chaque module doit avoir : objectifs, contenu riche, exemples pratiques, étude de cas, résumé
- Quiz de 5-7 questions pertinentes par module
- Ton : professionnel mais accessible à tous
- Pas de jargon technique incompréhensible
- Illustrations textuelles vivantes et captivantes

Réponds UNIQUEMENT avec un JSON valide (AUCUN texte avant ou après) :
{
  "course": {
    "title": "Titre accrocheur et professionnel",
    "description": "Description engageante de 2-3 phrases",
    "sector": "${sector || "education"}",
    "level": "${level || "debutant"}",
    "duration_minutes": 120,
    "thumbnail_description": "Description pour générer une image de couverture"
  },
  "modules": [
    {
      "title": "Titre du module",
      "sort_order": 1,
      "duration_minutes": 25,
      "content": "Contenu complet en Markdown très riche...",
      "image_description": "Description pour image illustrative du module",
      "quiz": {
        "title": "Quiz : [Titre du module]",
        "passing_score": 70,
        "questions": [
          {
            "question": "Question claire et précise ?",
            "question_type": "qcm",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "Option A",
            "sort_order": 1
          }
        ]
      }
    }
  ]
}`;

    const courseResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Crée un cours complet sur : "${prompt}". Secteur: ${sector || "général"}. Niveau: ${level || "débutant"}. Rends-le vraiment inspirant et professionnel.` }
        ],
      }),
    });

    if (!courseResponse.ok) {
      const status = courseResponse.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Trop de requêtes. Réessayez dans quelques instants." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Crédits IA épuisés." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${status}`);
    }

    const courseData = await courseResponse.json();
    const rawText = courseData.choices?.[0]?.message?.content || "";
    
    let courseJson;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      courseJson = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      throw new Error("Impossible de parser la réponse IA");
    }

    // Generate images if requested
    if (generateImages && courseJson.modules?.length) {
      const imagePromises = courseJson.modules.slice(0, 3).map(async (mod: any, idx: number) => {
        try {
          const imgResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image",
              messages: [{ role: "user", content: `Professional educational illustration for: "${mod.image_description || mod.title}". African context, modern, clean, no text overlay, suitable for online course platform. 16:9 ratio.` }],
              modalities: ["image", "text"],
            }),
          });

          if (imgResponse.ok) {
            const imgData = await imgResponse.json();
            const msg = imgData.choices?.[0]?.message;
            let base64Data = msg?.images?.[0]?.image_url?.url;
            
            if (base64Data) {
              const rawBase64 = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;
              const binaryString = atob(rawBase64);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
              
              const fileName = `courses/module-${Date.now()}-${idx}.png`;
              const { error: uploadError } = await supabase.storage.from("course-content").upload(fileName, bytes, { contentType: "image/png", upsert: true });
              
              if (!uploadError) {
                const { data: urlData } = supabase.storage.from("course-content").getPublicUrl(fileName);
                return { idx, url: urlData.publicUrl };
              }
            }
          }
        } catch (e) {
          console.error("Image generation failed for module", idx, e);
        }
        return { idx, url: null };
      });

      const imageResults = await Promise.all(imagePromises);
      imageResults.forEach(({ idx, url }) => {
        if (url && courseJson.modules[idx]) {
          courseJson.modules[idx].image_url = url;
        }
      });
    }

    return new Response(JSON.stringify({ success: true, data: courseJson }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("generate-course error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

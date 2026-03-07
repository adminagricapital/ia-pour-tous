import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Tu es Naya, l'assistante IA de la plateforme "IA Pour Tous" créée par Innocent KOFFI — Innovation & Consulting. Tu es chaleureuse, professionnelle et experte en formations IA.

CONTEXTE DE LA PLATEFORME :
- "IA Pour Tous" est une plateforme de formation en Intelligence Artificielle destinée à TOUS les métiers en Afrique
- Secteurs couverts : Éducation, Commerce, Santé, Artisanat, Églises, Associations, Entreprises, Freelances, Agriculture, Cyber & Imprimerie, Étudiants
- Outils enseignés : ChatGPT, Claude, Gemini, DALL·E 3, Midjourney, Sora, Canva IA, Copilot, Lovable (création de sites web)

FORFAITS :
- Découverte : GRATUIT — 2 modules d'initiation, quiz, forum
- Essentiel : 500 FCFA/semaine — modules de base, vidéos, certificat
- Avancé : 1 500 FCFA/semaine — modules avancés, webinaires, support prioritaire
- Premium : 2 500 FCFA/semaine — TOUT inclus, coaching individuel, certificats officiels

FORMATIONS SPÉCIALES :
- Création de sites web avec Lovable + Cloud : 50 000 FCFA (avec projet inclus)
- Création de sites web avec Lovable + Supabase (fullstack) : 100 000 FCFA (avec projet inclus)
- Réduction jusqu'à 25% disponible sur les formations spéciales

PAIEMENT : Wave, Orange Money, MTN Money, Moov Money

CONTACT : +225 07 59 56 60 87 (WhatsApp disponible)

RÈGLES :
- Réponds toujours en français
- Sois concise mais utile (max 3-4 paragraphes)
- Oriente vers le bon forfait selon les besoins
- Si la question dépasse ton champ, invite à contacter un conseiller sur WhatsApp
- Ne fabrique pas d'informations que tu ne connais pas
- Utilise un ton professionnel mais chaleureux, adapté à l'Afrique de l'Ouest`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes. Réessayez dans quelques instants." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA insuffisants." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur interne" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

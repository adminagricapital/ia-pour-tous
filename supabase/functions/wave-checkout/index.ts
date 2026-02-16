import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const WAVE_API_KEY = Deno.env.get("WAVE_API_KEY");
    if (!WAVE_API_KEY) {
      return new Response(JSON.stringify({ 
        error: "WAVE_API_KEY not configured",
        demo: true,
        message: "Le système de paiement Wave est en cours de configuration. Veuillez contacter l'administrateur."
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Utilisateur non trouvé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { amount, plan, successUrl, errorUrl } = await req.json();

    if (!amount || !plan) {
      return new Response(JSON.stringify({ error: "Montant et plan requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create payment record
    const { data: payment, error: payError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        amount: parseInt(amount),
        plan,
        payment_method: "wave",
        status: "pending",
      })
      .select()
      .single();

    if (payError) {
      console.error("Payment insert error:", payError);
      return new Response(JSON.stringify({ error: payError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Wave Checkout API
    const waveResponse = await fetch("https://api.wave.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WAVE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: "XOF",
        error_url: errorUrl || `${successUrl?.split("/payment")[0]}/payment/error?payment_id=${payment.id}`,
        success_url: successUrl || `${errorUrl?.split("/payment")[0]}/payment/success?payment_id=${payment.id}`,
        client_reference: payment.id,
      }),
    });

    if (!waveResponse.ok) {
      const errText = await waveResponse.text();
      console.error("Wave API error:", waveResponse.status, errText);
      
      // Update payment as failed
      await supabase.from("payments").update({ status: "failed" }).eq("id", payment.id);
      
      return new Response(JSON.stringify({ 
        error: "Erreur Wave API",
        details: errText 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const waveData = await waveResponse.json();
    
    // Update payment with Wave session info
    await supabase.from("payments").update({
      transaction_id: waveData.id,
      cinetpay_data: waveData,
    }).eq("id", payment.id);

    return new Response(JSON.stringify({
      payment_id: payment.id,
      wave_launch_url: waveData.wave_launch_url,
      checkout_status: waveData.checkout_status,
      session_id: waveData.id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("wave-checkout error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur interne" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    console.log("Wave webhook received:", JSON.stringify(body));

    const { type, data } = body;

    if (type === "checkout.session.completed") {
      const sessionId = data?.id;
      const clientRef = data?.client_reference;
      const paymentId = clientRef || null;

      if (paymentId) {
        // Update payment status
        const { data: payment } = await supabase
          .from("payments")
          .update({
            status: "completed",
            transaction_id: sessionId,
            cinetpay_data: data,
          })
          .eq("id", paymentId)
          .select()
          .single();

        if (payment) {
          // Activate user plan
          await supabase.from("profiles").update({
            plan: payment.plan,
            plan_active: true,
          }).eq("user_id", payment.user_id);

          console.log("Payment completed and plan activated for user:", payment.user_id);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("wave-webhook error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

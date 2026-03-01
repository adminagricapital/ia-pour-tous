import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email, password, full_name } = await req.json();
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Create user with admin API (bypasses email confirmation)
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name || "Super Administrateur" },
    });

    if (createError) {
      // If user already exists, get their ID
      if (createError.message.includes("already") || createError.message.includes("exists")) {
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === email);
        
        if (existingUser) {
          // Ensure admin role exists
          const { data: existingRoles } = await supabase.from("user_roles").select("*").eq("user_id", existingUser.id).eq("role", "admin");
          if (!existingRoles?.length) {
            await supabase.from("user_roles").insert({ user_id: existingUser.id, role: "admin" });
          }
          
          // Ensure profile is premium
          await supabase.from("profiles").update({
            plan: "premium",
            plan_active: true,
            full_name: full_name || "Super Administrateur",
          }).eq("user_id", existingUser.id);

          return new Response(JSON.stringify({ success: true, message: "Admin account already exists. Updated to premium admin.", user_id: existingUser.id }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      throw createError;
    }

    if (userData.user) {
      // Create profile
      await supabase.from("profiles").upsert({
        user_id: userData.user.id,
        full_name: full_name || "Super Administrateur",
        plan: "premium",
        plan_active: true,
      }, { onConflict: "user_id" });

      // Add admin role
      await supabase.from("user_roles").insert({
        user_id: userData.user.id,
        role: "admin",
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Admin account created successfully", user_id: userData.user?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("create-admin error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

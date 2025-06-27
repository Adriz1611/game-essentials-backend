// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);

const RESEND_API_KEY    = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL");

async function sendEmail(to, subject, text) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({
      from:  RESEND_FROM_EMAIL,
      to:   [to],
      subject,
      text,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
}


console.log("Hello from Functions!")

Deno.serve(async (req) => {
  
if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const { record: NEW, old_record: OLD } = await req.json();
  const THRESHOLD = 10;
  const wentLow   = NEW.stock_quantity <= THRESHOLD && OLD.stock_quantity  > THRESHOLD;
  const cameBack  = NEW.stock_quantity  > THRESHOLD && OLD.stock_quantity <= THRESHOLD;
  if (!wentLow && !cameBack) return new Response("No threshold crossing", { status: 200 });

  // Fetch product + seller
  const { data: prod } = await supabase.from("products")
    .select("name,seller_id").eq("id", NEW.id).single();
  if (prod) {
    const { name, seller_id } = prod;
    const subject = wentLow
      ? `⚠️ Low stock: ${name}`
      : `✅ Restocked: ${name}`;
    const body = wentLow
      ? `"${name}" is low: only ${NEW.stock_quantity} left.`
      : `"${name}" is back: ${NEW.stock_quantity} available.`;

    // Email seller
    const { data: seller } = await supabase.from("customers")
      .select("email,first_name")
      .eq("id", seller_id).single();
    if (seller) {
      await sendEmail(
        seller.email,
        subject,
        `Hi ${seller.first_name||''},\n\n${body}\n\n– Team`
      );
    }
  }

  // Fetch & email subscribers
  // Only email subscribers when item comes back in stock
  if (cameBack) {
    const { data: subs } = await supabase.from("product_subscriptions")
      .select("user_id").eq("product_id", NEW.id);
    for (const { user_id } of subs || []) {
      const { data: cust } = await supabase.from("customers")
        .select("email,first_name").eq("id", user_id).single();
      if (cust) {
        const subject = `✅ Back in stock: ${prod.name}`;
        const body = `"${prod.name}" is available again (${NEW.stock_quantity} in stock).`;
        await sendEmail(
          cust.email,
          subject,
          `Hi ${cust.first_name || ''},\n\n${body}\n\n– Team`
        );
      }
    }
  }

  return new Response("Emails dispatched", { status: 200 });

})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stock-email' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

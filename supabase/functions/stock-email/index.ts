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

// Ensure email env vars are provided
if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
  console.error("⚠️ Missing RESEND_API_KEY or RESEND_FROM_EMAIL environment variable");
  throw new Error("Missing email configuration");
}

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
  const responseText = await res.text();
  console.log(`Resend API response for ${to}: status=${res.status}, body=${responseText}`);
  if (!res.ok) throw new Error(responseText);
  return responseText;
}


console.log("Hello from Functions!")

Deno.serve(async (req) => {
  
if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const { record: NEW, old_record: OLD } = await req.json();
  console.log('stock-email payload - NEW:', NEW, 'OLD:', OLD);
  const THRESHOLD = 10;
  const fellBelow = NEW.stock_quantity < THRESHOLD && OLD.stock_quantity >= THRESHOLD;
  const cameBack  = NEW.stock_quantity  > THRESHOLD && OLD.stock_quantity <= THRESHOLD;
  console.log('Threshold check', { fellBelow, cameBack, THRESHOLD, newQty: NEW.stock_quantity, oldQty: OLD.stock_quantity });
  if (!fellBelow && !cameBack) {
    console.log('No threshold crossing, exiting');
    return new Response("No threshold crossing", { status: 200 });
  }

  console.log('Event:', fellBelow ? 'fellBelow' : cameBack ? 'cameBack' : 'none');

  // Fetch product + seller
  console.log('Querying product for id:', NEW.id);
  const { data: prod, error: prodError } = await supabase.from("products")
    .select("name").eq("id", NEW.id).single();
  console.log('Product query result:', { prod, prodError });
  if (prod) {
    const { name } = prod;
    if (fellBelow) {
      console.log('Low stock event, notifying all sellers');
      // Notify all sellers of low stock
      const subject = `⚠️ Low stock: ${name}`;
      const body = `"${name}" stock low: only ${NEW.stock_quantity} left.`;
      const { data: sellers, error: sellersError } = await supabase.from("sellers")
        .select("email, first_name");
      console.log('Sellers query result:', { sellers, sellersError });
      for (const { email, first_name } of sellers || []) {
        console.log('Sending low-stock email to seller:', email);
        await sendEmail(
          email,
          subject,
          `Hi ${first_name||''},\n\n${body}\n\n– Team`
        );
      }
    } else if (cameBack) {
      console.log('Restock event, fetching subscribers');
      // Notify subscribed customers of restock
      const subject = `✅ Back in stock: ${name}`;
      const body = `"${name}" is available again: ${NEW.stock_quantity} in stock.`;
      const { data: subs, error: subsError } = await supabase.from("product_subscriptions")
        .select("user_id").eq("product_id", NEW.id);
      console.log('Subscribers query result:', { subs, subsError });
      for (const { user_id } of subs || []) {
        console.log('Notifying subscriber user_id:', user_id);
        const { data: cust, error: custError } = await supabase.from("customers")
          .select("email,first_name").eq("id", user_id).single();
        console.log('Subscriber customer query result:', { cust, custError });
        if (cust) {
          console.log('Sending restock email to customer:', cust.email);
          await sendEmail(
            cust.email,
            subject,
            `Hi ${cust.first_name||''},\n\n${body}\n\n– Team`
          );
        }
      }
    }
  }
  else {
    console.log('No product found, skipping notifications');
  }

  console.log('Completed notification flow');
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

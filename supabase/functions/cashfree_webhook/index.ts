import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log("🚀 Cashfree webhook function loaded");

Deno.serve(async (req) => {

  // if(req.method !== "POST") {
  //   return new Response("Method Not Allowed", { status: 405 })
  // }

  const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const body = await req.json()
  
  if (body.type !== "PAYMENT_SUCCESS_WEBHOOK") {
    return new Response("Invalid webhook type", { status: 200 })
  }

    const { data } = body;
    const orderId: string = data.order.order_id;
    const paymentStatus: string = data.payment.payment_status;       // e.g. "SUCCESS"
    const cfPaymentId: string = data.payment.cf_payment_id;          // Cashfree payment ID

    const newOrderStatus = paymentStatus === "SUCCESS" ? "paid" : "failed";

    const { error: updateErr } = await supabase
      .from("orders")
      .update({
        status: newOrderStatus,
        payment_intent_id: cfPaymentId,
      })
      .eq("id", orderId);

    if (updateErr) {
      console.error("Failed to update order:", updateErr);
      throw updateErr;
    }

  return new Response("OK", { status: 200 });
})


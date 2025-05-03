import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("🚀 Cashfree webhook function loaded");

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const CASHFREE_SECRET = Deno.env.get("CASHFREE_WEBHOOK_SECRET")!;
Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const rawBody = await req.text();

  const timestamp = req.headers.get("x-webhook-timestamp") || "";
  const signature = req.headers.get("x-webhook-signature") || "";

  const hmac = createHmac("sha256", CASHFREE_SECRET)
    .update(timestamp + rawBody)
    .digest("base64");

  if (hmac !== signature) {
    console.warn("❌ Invalid signature:", {
      expected: hmac,
      received: signature,
    });
    return new Response("Invalid signature", { status: 401 });
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (body.type !== "PAYMENT_SUCCESS_WEBHOOK") {
    return new Response("Invalid webhook type", { status: 200 });
  }

  const { data } = body;

  const orderId: string = data.order.order_id;
  const paymentStatus: string = data.payment.payment_status;
  const cfPaymentId: string = data.payment.cf_payment_id;

  console.log("Received webhook data:", orderId, paymentStatus, cfPaymentId);

  const newOrderStatus = paymentStatus === "SUCCESS" ? "paid" : "failed";

  const { error: updateErr } = await supabase
    .from("orders")
    .update({
      status: newOrderStatus,
      payment_intent_id: cfPaymentId,
    })
    .eq("id", orderId);

  console.log("UError", updateErr);

  if (updateErr) {
    console.error("Failed to update order:", updateErr);
    throw updateErr;
  }

  return new Response("OK", { status: 200 });
});

// functions/phonepe_webhook/index.js

// Enable Supabase Functions types
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Node-style crypto for Deno
import { createHash } from "https://deno.land/std@0.167.0/node/crypto.ts";

// Build a service-role client so we can do any DB writes
const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);

// Your PhonePe secret & key index, set in your project’s Env
const SALT_KEY   = Deno.env.get("PHONEPE_SALT_KEY");
const SALT_INDEX = Deno.env.get("PHONEPE_SALT_INDEX");

console.log("🚀 PhonePe webhook function ready");

Deno.serve(async (req) => {
  // Only POST allowed
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let rawBody;
  try {
    rawBody = await req.text();
  } catch {
    return new Response("Invalid body", { status: 400 });
  }

  // Parse JSON; expect { response: "<base64String>" }
  let json;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const payload = json.response;
  if (!payload) {
    return new Response("Missing response payload", { status: 400 });
  }

  // Extract headers
  const xVerify    = req.headers.get("x-verify")    || "";
  const xTimestamp = req.headers.get("x-webhook-timestamp") || "";

  // Compute our own signature: sha256(payload + SALT_KEY) + "###" + SALT_INDEX
  const computed = createHash("sha256")
    .update(payload + SALT_KEY)
    .digest("hex")
    + `###${SALT_INDEX}`;

  // Verify
  if (computed !== xVerify) {
    console.warn("Invalid signature", { computed, received: xVerify });
    return new Response(
      JSON.stringify({
        message: "Hash Mismatched",
        status: "FAILED",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Decode Base64 → UTF8 → JSON
  let decoded;
  try {
    const plain = atob(payload);
    decoded = JSON.parse(plain);
  } catch (err) {
    console.error("Failed to decode payload", err);
    return new Response("Invalid payload encoding", { status: 400 });
  }

  // Convert amount from paise to rupees (if present)
  if (decoded.data?.amount != null) {
    decoded.data.amount = decoded.data.amount / 100;
  }

  console.log("Received webhook data:", decoded);

  const newOrderStatus = decoded.code === "PAYMENT_SUCCESS" ? "paid" : "failed";

     const { error: updateErr } = await supabase
      .from("orders")
      .update({
        status: newOrderStatus,
        payment_intent_id: decoded.data.transactionId,
      })
      .eq("id", decoded.data.merchantTransactionId);

      console.log("UError", updateErr);

    if (updateErr) {
      console.error("Failed to update order:", updateErr);
      throw updateErr;
    }

  // Respond success
  return new Response(
    JSON.stringify({
      message: "Callback Success",
      status: "SUCCESS",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
});

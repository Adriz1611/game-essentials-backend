// Enable Supabase Edge types
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// PDF generation
import { PDFDocument, StandardFonts } from "https://esm.sh/pdf-lib";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { record: NEW, old_record: OLD } = await req.json();

  // Only run when status flips to 'paid'
  if (!(NEW.status === "paid" && OLD.status !== "paid")) {
    return new Response("No-op", { status: 200 });
  }

  const orderId = NEW.id;

  // 1) Fetch all order details
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select(`
      id, created_at, total_amount,
      customers ( first_name, last_name, email ),
      customer_addresses!orders_shipping_address_fkey (
        full_name, street_address1, city, state_province, postal_code, country
      ),
      order_items (
        quantity, unit_price, total_price,
        products ( name )
      )
    `)
    .eq("id", orderId)
    .single();

  if (orderErr || !order) {
    console.error("Order fetch failed:", orderErr);
    return new Response("Order not found", { status: 404 });
  }

  // 2) Build the PDF
  const pdfDoc = await PDFDocument.create();
  const page   = pdfDoc.addPage([600, 800]);
  const font   = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y        = 760;

  // Header
  page.drawText("INVOICE", { x: 50, y, size: 24, font });
  y -= 40;
  page.drawText(`Order ID: ${order.id}`, { x: 50, y, size: 12, font });
  page.drawText(
    `Date: ${new Date(order.created_at).toLocaleDateString()}`,
    { x: 350, y, size: 12, font }
  );

  // Customer
  y -= 40;
  page.drawText("Bill To:", { x: 50, y, size: 12, font });
  const c = order.customers;
  y -= 20;
  page.drawText(`${c.first_name} ${c.last_name}`, { x: 60, y, size: 12, font });
  page.drawText(c.email, { x: 60, y: y - 15, size: 12, font });

  // Address
  y -= 50;
  const a = order.customer_addresses;
  page.drawText("Ship To:", { x: 50, y, size: 12, font });
  y -= 20;
  page.drawText(a.full_name, { x: 60, y, size: 12, font });
  page.drawText(a.street_address1, { x: 60, y: y - 15, size: 12, font });
  page.drawText(
    `${a.city}, ${a.state_province} ${a.postal_code}`,
    { x: 60, y: y - 30, size: 12, font }
  );

  // Items header
  y -= 70;
  page.drawText("Item", { x: 50, y, size: 12, font });
  page.drawText("Qty", { x: 300, y, size: 12, font });
  page.drawText("Unit Price", { x: 350, y, size: 12, font });
  page.drawText("Total", { x: 450, y, size: 12, font });
  y -= 20;

  // Line items
  for (const item of order.order_items) {
    // wrap to next page if needed
    if (y < 100) {
      page = pdfDoc.addPage([600, 800]);
      y = 760;
    }
    page.drawText(item.products.name, { x: 50, y, size: 12, font });
    page.drawText(String(item.quantity), { x: 300, y, size: 12, font });
    page.drawText(`Rs.${item.unit_price.toFixed(2)}`, { x: 350, y, size: 12, font });
    page.drawText(`Rs.${item.total_price.toFixed(2)}`, { x: 450, y, size: 12, font });
    y -= 20;
  }

  // Grand total
  y -= 30;
  page.drawText(`Total: Rs.${order.total_amount.toFixed(2)}`, {
    x: 350,
    y,
    size: 14,
    font,
  });

  const pdfBytes = await pdfDoc.save();

  // 3) Upload to Storage
  const path = `invoices/${orderId}.pdf`;
  const { error: uploadErr } = await supabase.storage
    .from("invoices")
    .upload(path, pdfBytes, {
      contentType: "application/pdf",
      upsert: true
    });

  if (uploadErr) {
    console.error("Upload failed:", uploadErr);
    return new Response("Failed to upload invoice", { status: 500 });
  }

  return new Response(
    JSON.stringify({ stored_at: path }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});

// Enable Supabase Edge types
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// PDF generation
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib";
const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
Deno.serve(async (req)=>{
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405
    });
  }
  const { record: NEW, old_record: OLD } = await req.json();
  // Only run when status flips to 'paid'
  if (!(NEW.status === "paid" && OLD.status !== "paid")) {
    return new Response("No-op", {
      status: 200
    });
  }
  const orderId = NEW.id;
  // 1) Fetch all order details
  const { data: order, error: orderErr } = await supabase.from("orders").select(`
      id, created_at, total_amount,
      customers ( first_name, last_name, email ),
      customer_addresses!orders_shipping_address_fkey (
        full_name, street_address1, city, state_province, postal_code, country
      ),
      order_items (
        quantity, unit_price, total_price,
        products ( name )
      )
    `).eq("id", orderId).single();
  if (orderErr || !order) {
    console.error("Order fetch failed:", orderErr);
    return new Response("Order not found", {
      status: 404
    });
  }
  // 2) Build the modernized PDF (optimized)
  const pdfDoc = await PDFDocument.create();
  // Fetch logo with timeout and smaller processing
  let logoImage = null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(()=>controller.abort(), 2000); // 2 second timeout
    const logoResponse = await fetch("https://gameessentials.in/logo.png", {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (logoResponse.ok) {
      const logoBytes = await logoResponse.arrayBuffer();
      // Only process if reasonable size
      if (logoBytes.byteLength < 500000) {
        logoImage = await pdfDoc.embedPng(logoBytes);
      }
    }
  } catch (error) {
    console.log("Logo fetch failed or timed out, proceeding without logo");
  }
  // 3) Create page and fonts
  const page = pdfDoc.addPage([
    595,
    842
  ]); // A4 size
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  // Define colors
  const primaryColor = rgb(0.13, 0.20, 0.35); // Dark blue-gray
  const accentColor = rgb(0.24, 0.56, 0.95); // Modern blue
  const lightGray = rgb(0.95, 0.95, 0.95);
  const darkGray = rgb(0.4, 0.4, 0.4);
  const textColor = rgb(0.2, 0.2, 0.2);
  let y = 792; // Start from top
  // Header with company branding
  page.drawRectangle({
    x: 0,
    y: y - 80,
    width: 595,
    height: 80,
    color: primaryColor
  });
  // Company logo (if available) - optimized rendering
  if (logoImage) {
    // Simpler scaling calculation
    const maxSize = 50; // Reduced size for faster rendering
    const scale = Math.min(maxSize / logoImage.width, maxSize / logoImage.height);
    page.drawImage(logoImage, {
      x: 40,
      y: y - 65,
      width: logoImage.width * scale,
      height: logoImage.height * scale
    });
    // Company name next to logo
    page.drawText("GAMEESSENTIALS PVT LTD", {
      x: 40 + logoImage.width * scale + 10,
      y: y - 45,
      size: 18,
      font: helveticaBold,
      color: rgb(1, 1, 1)
    });
  } else {
    // Fallback without logo - simplified
    page.drawText("GAMEESSENTIALS PVT LTD", {
      x: 40,
      y: y - 45,
      size: 18,
      font: helveticaBold,
      color: rgb(1, 1, 1)
    });
  }
  // Invoice title
  page.drawText("INVOICE", {
    x: 450,
    y: y - 35,
    size: 24,
    font: helveticaBold,
    color: rgb(1, 1, 1)
  });
  y -= 120;
  // Invoice details section
  page.drawRectangle({
    x: 320,
    y: y - 60,
    width: 235,
    height: 60,
    color: lightGray
  });
  page.drawText("Invoice Details", {
    x: 330,
    y: y - 20,
    size: 11,
    font: helveticaBold,
    color: textColor
  });
  page.drawText(`Invoice #: ${order.id.toString().padStart(6, '0')}`, {
    x: 330,
    y: y - 35,
    size: 10,
    font: helvetica,
    color: textColor
  });
  page.drawText(`Date: ${new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, {
    x: 330,
    y: y - 50,
    size: 10,
    font: helvetica,
    color: textColor
  });
  // Customer information section
  const c = order.customers;
  const a = order.customer_addresses;
  // Bill To section
  page.drawText("BILL TO:", {
    x: 40,
    y: y - 20,
    size: 11,
    font: helveticaBold,
    color: accentColor
  });
  page.drawText(`${c.first_name} ${c.last_name}`, {
    x: 40,
    y: y - 40,
    size: 12,
    font: helvetica,
    color: textColor
  });
  page.drawText(c.email, {
    x: 40,
    y: y - 55,
    size: 10,
    font: helvetica,
    color: darkGray
  });
  y -= 100;
  // Ship To section
  page.drawText("SHIP TO:", {
    x: 40,
    y: y,
    size: 11,
    font: helveticaBold,
    color: accentColor
  });
  page.drawText(a.full_name, {
    x: 40,
    y: y - 20,
    size: 11,
    font: helvetica,
    color: textColor
  });
  page.drawText(a.street_address1, {
    x: 40,
    y: y - 35,
    size: 10,
    font: helvetica,
    color: textColor
  });
  page.drawText(`${a.city}, ${a.state_province} ${a.postal_code}`, {
    x: 40,
    y: y - 50,
    size: 10,
    font: helvetica,
    color: textColor
  });
  page.drawText(a.country, {
    x: 40,
    y: y - 65,
    size: 10,
    font: helvetica,
    color: textColor
  });
  y -= 120;
  // Items table header
  page.drawRectangle({
    x: 40,
    y: y - 30,
    width: 515,
    height: 30,
    color: primaryColor
  });
  page.drawText("ITEM DESCRIPTION", {
    x: 50,
    y: y - 20,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1)
  });
  page.drawText("QTY", {
    x: 350,
    y: y - 20,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1)
  });
  page.drawText("UNIT PRICE", {
    x: 400,
    y: y - 20,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1)
  });
  page.drawText("TOTAL", {
    x: 490,
    y: y - 20,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1)
  });
  y -= 30;
  // Table rows - optimized rendering
  for (const [index, item] of order.order_items.entries()){
    // Check if we need a new page
    if (y < 150) {
      const newPage = pdfDoc.addPage([
        595,
        842
      ]);
      y = 792;
    }
    // Simplified alternating background (every other row)
    if (index % 2 === 1) {
      page.drawRectangle({
        x: 40,
        y: y - 25,
        width: 515,
        height: 25,
        color: rgb(0.98, 0.98, 0.98)
      });
    }
    // Truncate long product names to prevent overflow
    const productName = item.products.name.length > 45 ? item.products.name.substring(0, 42) + "..." : item.products.name;
    page.drawText(productName, {
      x: 50,
      y: y - 18,
      size: 10,
      font: helvetica,
      color: textColor
    });
    page.drawText(String(item.quantity), {
      x: 360,
      y: y - 18,
      size: 10,
      font: helvetica,
      color: textColor
    });
    page.drawText(`Rs.${item.unit_price.toFixed(2)}`, {
      x: 410,
      y: y - 18,
      size: 10,
      font: helvetica,
      color: textColor
    });
    page.drawText(`Rs.${item.total_price.toFixed(2)}`, {
      x: 495,
      y: y - 18,
      size: 10,
      font: helvetica,
      color: textColor
    });
    y -= 25;
  }
  // Total section
  y -= 20;
  page.drawRectangle({
    x: 400,
    y: y - 40,
    width: 155,
    height: 40,
    color: lightGray
  });
  page.drawText("TOTAL AMOUNT", {
    x: 410,
    y: y - 20,
    size: 11,
    font: helveticaBold,
    color: textColor
  });
  page.drawText(`Rs.${order.total_amount.toFixed(2)}`, {
    x: 495,
    y: y - 35,
    size: 14,
    font: helveticaBold,
    color: primaryColor
  });
  // Footer
  y -= 80;
  page.drawText("Thank you for your business!", {
    x: 40,
    y: y,
    size: 12,
    font: helvetica,
    color: accentColor
  });
  // Horizontal line
  page.drawLine({
    start: {
      x: 40,
      y: y - 20
    },
    end: {
      x: 555,
      y: y - 20
    },
    thickness: 1,
    color: lightGray
  });
  page.drawText("GameEssentials Pvt Ltd | Contact: support@gameessentials.com", {
    x: 40,
    y: y - 40,
    size: 9,
    font: helvetica,
    color: darkGray
  });
  // Page number
  page.drawText("Page 1 of 1", {
    x: 500,
    y: 30,
    size: 8,
    font: helvetica,
    color: darkGray
  });
  const pdfBytes = await pdfDoc.save();
  // 3) Upload to Storage
  const path = `invoices/${orderId}.pdf`;
  const { error: uploadErr } = await supabase.storage.from("invoices").upload(path, pdfBytes, {
    contentType: "application/pdf",
    upsert: true
  });
  if (uploadErr) {
    console.error("Upload failed:", uploadErr);
    return new Response("Failed to upload invoice", {
      status: 500
    });
  }
  return new Response(JSON.stringify({
    stored_at: path
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
});

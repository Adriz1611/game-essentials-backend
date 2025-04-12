import TestPage from "@/components/test-layout";
import { createClient } from "@/utils/supabase/server";

export default async function CheckoutPage({ params }) {
  const { id } = await params;
  const orderData = await fetchOrders(id);
  const shippingMethods = await fetchShippingMethods();


  return (
    <main>
      <TestPage data={orderData} shippingMethods={shippingMethods} />
    </main>
  );
}

async function fetchOrders(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("id", id);
  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return data;
}

async function fetchShippingMethods() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("shipping").select("*");
  if (error) {
    console.error("Error fetching shipping methods:", error);
    return [];
  }
  return data;
}

import OrderDetailsPage from "@/components/dashboard/order-info";
import { createClient } from "@/utils/supabase/server";

export default async function OrdersList({ params }) {
  const { id } = await params;

  const data = await fetchOrders(id);
  console.log("Orders data:", data[0]);
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Orders List</h1>
        <p className="text-muted-foreground">
          Manage your orders and their information here.
        </p>
      </div>
      <OrderDetailsPage order={data[0]} />
    </div>
  );
}

async function fetchOrders(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `*, shipping_address(*), order_items(*, products(*)), user_id(*), shipping_id(*)`
    )
    .eq("id", id);
  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return data;
}

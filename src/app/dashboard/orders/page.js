import OrdersPage from "@/components/dashboard/orders-page";
import { createClient } from "@/utils/supabase/server";

export default async function OrdersList() {
  const data = await fetchOrders();
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Orders List</h1>
        <p className="text-muted-foreground">
          Manage your orders and their information here.
        </p>
      </div>
      <OrdersPage ordersData={data} />
    </div>
  );
}

async function fetchOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`*, shipping_address(*), order_items(*, products(*)), user_id(*), shipping_id(*)`);
  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return data;
}

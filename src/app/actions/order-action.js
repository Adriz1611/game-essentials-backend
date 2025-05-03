"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId, status) {
  const supabase = await createClient();

  console.log("Updating order status:", orderId, status);
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    return null;
  }

  revalidatePath("/dashboard/orders");
  return data;
}

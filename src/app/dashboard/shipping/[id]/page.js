import ShippingMethodForm from "@/components/dashboard/shipping-method-form";
import { createClient } from "@/utils/supabase/server";

export default async function  EditShippingMethodPage({ params }) {
  const { id } = await params;
  const data = await fetchShippingMethods(id);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit Shipping Method</h2>
      <ShippingMethodForm shipping_data={data[0]}/>
    </div>
  );
}

async function fetchShippingMethods(id) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("shipping")
  .select("*")
  .eq("id", id);
  if (error) {
    console.error("Error fetching shipping methods:", error);
    return [];
  }
  return data;
}
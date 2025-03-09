import ShippingMethodList from "@/components/dashboard/shipping-method-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
export default async function ShippingPage() {
  const data = await fetchShippingMethods();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Shipping Methods</h2>
          <p className="text-muted-foreground">
            Manage your store&apos;s shipping methods and delivery options.
          </p>
        </div>
        <Link href="/dashboard/shipping/add">
          <Button>Add Shipping Method</Button>
        </Link>
      </div>
      <ShippingMethodList shipping_data={data}/>
    </div>
  );
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

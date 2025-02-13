import DiscountList from "@/components/dashboard/discount-list";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProductsPage() {
  const data = await fetchDiscounts()
  return (
    <div className="w-full">
      <div className="w-full flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-4">Manage Discount</h2>
        <Link href={`/dashboard/promotions/discounts/add`}>
          <Button>Create Discount</Button>
        </Link>
      </div>
      <DiscountList discounts_data={data} />
    </div>
  );
}


async function fetchDiscounts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("discounts").select("*");
  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return data;
}
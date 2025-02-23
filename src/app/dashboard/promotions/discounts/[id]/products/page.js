import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import DiscountProductManager from "@/components/dashboard/discount-product-form";
export default async function ProductDiscountList({ params }) {
  const { id } = await params;
  const products = await fetchProductDiscount(id);
  const discount = await fetchDiscount(id);
  return (
    <div className="w-full">
      <div className="w-full flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-4">
          Products: {discount[0].name}
        </h2>
      </div>
      <DiscountProductManager
        discountId={discount[0].id}
        discountType={discount[0].discount_type}
        discountValue={discount[0].discount_value}
        initialProducts={products}
      />
    </div>
  );
}

async function fetchDiscount(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("discounts")
    .select("*")
    .eq("id", id);
  if (error) {
    console.error("Error fetching discount:", error);
    return [];
  }
  return data;
}

async function fetchProductDiscount(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select()
    .eq("discount_id", id).select(`
    id, name, price, categories (
      id,
      name
    )
  `);
  if (error) {
    console.error("Error fetching product discount:", error);
    return [];
  }
  return data;
}

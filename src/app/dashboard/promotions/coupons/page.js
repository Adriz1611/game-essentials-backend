import CouponList from "@/components/dashboard/coupon-list";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function CouponsPage() {
  const data = await fetchCoupons();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Coupon Codes</h2>
        <Link href="/dashboard/promotions/coupons/add">
          <Button>Add New Coupon</Button>
        </Link>
      </div>
      <CouponList coupons_data={data}/>
    </div>
  );
}

async function fetchCoupons() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("coupons").select("*");
  if (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }

  return data;
}

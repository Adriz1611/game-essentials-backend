import CouponList from "@/components/coupon-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Coupon Codes</h2>
        <Link href="/dashboard/promotions/coupons/add">
          <Button>Add New Coupon</Button>
        </Link>
      </div>
      <CouponList />
    </div>
  );
}

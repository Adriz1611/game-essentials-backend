import DiscountList from "@/components/dashboard/discount-list";
import ProductList from "@/components/dashboard/list-product";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProductsPage() {
  return (
    <div className="w-full">
      <div className="w-full flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-4">Manage Discount</h2>
        <Link href={`/dashboard/promotions/discounts/add`}>
          <Button>Create Discount</Button>
        </Link>
      </div>
      <DiscountList />
    </div>
  );
}

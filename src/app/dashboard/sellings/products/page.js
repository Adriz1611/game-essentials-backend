import SellingProductsList from "@/components/dashboard/selling-products-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SellingProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Selling Products</h2>
          <p className="text-muted-foreground">
            Manage products listed for sale by sellers.
          </p>
        </div>
        <Link href="/admin/selling-products/add">
          <Button>Add Selling Product</Button>
        </Link>
      </div>
      <SellingProductsList />
    </div>
  );
}

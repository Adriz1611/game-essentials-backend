import ShippingMethodList from "@/components/dashboard/shipping-method-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ShippingPage() {
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
      <ShippingMethodList />
    </div>
  );
}


import ShippingMethodForm from "@/components/dashboard/shipping-method-form";

export default async function AddShippingMethodPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add Shipping Method</h2>
      <ShippingMethodForm />
    </div>
  );
}

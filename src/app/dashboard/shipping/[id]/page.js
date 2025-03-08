import ShippingMethodForm from "@/components/dashboard/shipping-method-form";


export default async function  EditShippingMethodPage({ params }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit Shipping Method</h2>
      <ShippingMethodForm />
    </div>
  );
}

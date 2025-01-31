import AddProductForm from "@/components/pages/add-product-form"

export default function ProductsPage() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <AddProductForm />
    </div>
  )
}
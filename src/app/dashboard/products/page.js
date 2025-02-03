import ProductList from "@/components/pages/list-product";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";


export default function ProductsPage() {
  return (
    <div className="w-full">
         <div className="w-full flex flex-row justify-between">
            <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
        <Link href={`/dashboard/products/add`}>
        <Button>Add Product</Button>
        </Link>
         </div>
        <ProductList />
    </div>
  )
}

async function fetchProducts() {
const supabase = await createClient()
const { data: products, error } = await supabase
  .from("products")
  .select("*, categories ( name )");

if (error) {
  console.error("Error fetching products:", error);
  return [];
}

return products;

  
}

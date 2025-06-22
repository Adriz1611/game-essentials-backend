import ProductList from "@/components/dashboard/list-product";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function ProductsPage() {
  const data = await fetchProducts();
  const tagsData = await fetchTags();
  const productTags = await fetchProductTags();
  return (
    <div className="w-full">
      <div className="w-full flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
        <Link href={`/dashboard/products/add`}>
          <Button>Add Product</Button>
        </Link>
      </div>
      <ProductList data={data} tagsData={tagsData} productTags={productTags} />
    </div>
  );
}

async function fetchProducts() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*, categories ( name )");

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return products;
}

async function fetchTags() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select("*");
  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return data;
}

async function fetchProductTags() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_tags")
    .select("product_id, tags_id");
  if (error) {
    console.error("Error fetching product-tags:", error);
    return [];
  }
  return data;
}

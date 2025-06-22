import AddProductForm from "@/components/dashboard/product-form";
import { createClient } from "@/utils/supabase/server";
export default async function EditProductPage({ params }) {
  const { id } = await params;

  const product = await fetchProduct(id);
  const categories = await fetchCategories();
  const tags = await fetchTags();
  const selectedTagIds = await fetchProductTags(id);
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <AddProductForm
        product_data={product[0]}
        categories_data={categories}
        tags_data={tags}
        selectedTagIds={selectedTagIds}
      />
    </div>
  );
}

async function fetchProduct(id) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select().eq("id", id)
    .select(`
    *,
    categories (
      id,
      name
    )
  `);
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}

async function fetchCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("id, name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
}

async function fetchTags() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select("id, name");
  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
  return data;
}

async function fetchProductTags(productId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_tags")
    .select("tags (id)")
    .eq("product_id", productId);
  if (error) {
    console.error("Error fetching product tags:", error);
    return [];
  }
  return data.map((item) => item.tags.id);
}

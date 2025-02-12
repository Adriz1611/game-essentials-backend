import AddCategoryForm from "@/components/dashboard/category-form";
import { createClient } from "@/utils/supabase/server";
export default async function ProductsPage() {
  const data = await fetchCategories();
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <AddCategoryForm categories_data={data} />
    </div>
  );
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

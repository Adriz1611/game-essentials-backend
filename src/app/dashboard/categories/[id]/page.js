import AddCategoryForm from "@/components/dashboard/category-form";
import { createClient } from "@/utils/supabase/server";
export default async function EditProductPage({ params }) {
  const { id } = await params;

  console.log(id);

  const category_id = await fetchCategoryId(id);
  const categories = await fetchCategories();
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <AddCategoryForm
        categories_data={categories}
        category_id={category_id[0]}
      />
    </div>
  );
}

async function fetchCategoryId(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select()
    .eq("id", id);
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

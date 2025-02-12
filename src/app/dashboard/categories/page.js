import CategoryList from "@/components/dashboard/category-list";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function CategoriesPage() {
  const data = await fetchCategories();
  return (
    <div className="w-full">
      <div className="w-full flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
        <Link href={`/dashboard/categories/add`}>
          <Button>Add Category</Button>
        </Link>
      </div>
      <CategoryList data={data} />
    </div>
  );
}

async function fetchCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
}

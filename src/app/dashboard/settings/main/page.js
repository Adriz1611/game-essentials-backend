import { SettingsForm } from "@/components/dashboard/setting-form";
import { createClient } from "@/utils/supabase/server";
export default async function MainSettingsPage() {
  const data = await fetchCategories();
  return <SettingsForm siteType="main" categories_data={data} />;
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

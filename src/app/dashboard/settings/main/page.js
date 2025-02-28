import { SettingsForm } from "@/components/dashboard/setting-form";
import { createClient } from "@/utils/supabase/server";
export default async function MainSettingsPage() {
  const data = await fetchCategories();
  const settings_data = await fetchSettings();

  return (
    <SettingsForm
      siteType="main"
      categories_data={data}
      settings_data={settings_data[0]}
    />
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

async function fetchSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("storefront_settings")
    .select("*")
    .eq("site_type", "main");
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
}

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const configureSettings = async (value) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("storefront_settings")
    .upsert({
      site_type: value.site_type,
      hero_image_url: value.heroImage,
      hero_redirect_url: value.heroLink,
      sub_navigation_categories: value.categories,
    })
    .select();

  if (error) {
    return {
      error: {
        message: "Database error: " + error.message,
      },
      success: false,
    };
  }

  revalidatePath("/dashboard/settings/" + value.site_type);

  return {
    data,
    success: true,
  };
};

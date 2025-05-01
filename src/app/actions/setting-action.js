"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const configureSettings = async (value) => {
  const supabase = await createClient();

  // Build payload: include id if settings_id is provided
  const payload = {
    site_type: value.site_type,
    hero_image_url: value.heroImage,
    hero_redirect_url: value.heroLink,
    sub_navigation_categories: value.categories,
  };

  if (value.settings_id) {
    payload.id = value.settings_id;
  }

  const { data, error } = await supabase
    .from("storefront_settings")
    .upsert(payload)
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

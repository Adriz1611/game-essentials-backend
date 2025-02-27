"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const configureSettings = async (value) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .upsert({
      site_type: value.site_type,
      hero_image_url: value.hero_image,
      hero_redirect_url: value.hero_link,
      sub_navigation_categories: value.categories,
    })
    .select();
  console.log({ data, error });

  if (error) {
    return {
      error: {
        message: "Database error: " + error.message,
      },
      success: false,
    };
  }

  revalidatePath("/settings/" + value.site_type);

  return {
    data,
    success: true,
  };
};

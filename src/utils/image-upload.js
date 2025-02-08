import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export async function uploadProductImages(files, productId) {
  try {
    if (!files || files.length === 0) return { imageUrls: [], error: null };

    const uploadPromises = files.map(async (file) => {
      if (typeof file === "string") {
        return file;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${productId}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from("product-images") 
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(filePath);

      return publicUrl;
    });

    const imageUrls = await Promise.all(uploadPromises);

    return { imageUrls, error: null };
  } catch (error) {
    console.error("Error uploading images:", error);
    return { imageUrls: [], error };
  }
}

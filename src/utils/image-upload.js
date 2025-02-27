import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export async function uploadProductImages(files, productId) {
  try {
    if (!files || files.length === 0) return { imageUrls: [], error: null };

    const uploadPromises = files.map(async (file) => {
      if (typeof file === "string") {
        // If the file is already a URL, return it as is
        return file;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${productId}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from("product-images") // Your bucket name
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(filePath);

      return publicUrl;
    });

    // Wait for all uploads to complete and return as an array
    const imageUrls = await Promise.all(uploadPromises);

    return { imageUrls, error: null };
  } catch (error) {
    console.error("Error uploading images:", error);
    return { imageUrls: [], error };
  }
}

export async function uploadHeroImage(file, type) {
  try {
    if (!file) return { imageUrl: null, error: null };

    const fileExt = file.name.split(".").pop();
    const fileName = `${type}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `hero/${fileName}`;

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from("hero-images") // Your bucket name
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("hero-images").getPublicUrl(filePath);

    console.log("Public URL:", publicUrl, " Error ", error);

    return { imageUrl: publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { imageUrl: null, error };
  }
}

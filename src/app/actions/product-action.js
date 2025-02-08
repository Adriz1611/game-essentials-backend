"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const addCategory = async (formData) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert([
      {
        name: formData.name,
        description: formData.description,
        parent_id:
          formData.parent_category_id === undefined
            ? null
            : formData.parent_category_id,
      },
    ])
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

  revalidatePath("/categories");

  return {
    data,
    success: true,
  };
};

export const updateCategory = async (id, formData) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: formData.name,
      description: formData.description,
      parent_id:
        formData.parent_category_id === undefined ||
        formData.parent_category_id === "0"
          ? null
          : formData.parent_category_id,
    })
    .eq("id", id)
    .select();

  if (error) {
    return {
      error: {
        message: "Database error: " + error.message,
      },
      success: false,
    };
  }

  revalidatePath("/categories");

  return {
    data,
    success: true,
  };
};

export const addProduct = async (formData) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        currency: formData.currency,
        stock_quantity: formData.stockQuantity,
        category_id: formData.category,
        specifications: formData.specifications,
        images: formData.images,
        is_digital: formData.isActive,
        is_active: formData.isDigital,
      },
    ])
    .select();
  if (error) {
    return {
      error: {
        message: "Database error: " + error.message,
      },
      success: false,
    };
  }

  revalidatePath("/products");

  return {
    data,
    success: true,
  };
};

export const updateProduct = async (id, productData) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .update({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      currency: productData.currency,
      stock_quantity: productData.stockQuantity,
      category_id: productData.category,
      specifications: productData.specifications,
      images: productData.images,
      is_digital: productData.isActive,
      is_active: productData.isDigital,
    })
    .eq("id", id)
    .select();

  if (error) {
    return {
      error: {
        message: "Database error: " + error.message,
      },
      success: false,
    };
  }

  revalidatePath("/products");

  return {
    data,
    success: true,
  };
};

export const addTag = async (formData) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .insert([
      {
        name: formData.name,
        description: formData.description,
        is_active: formData.isActive,
      },
    ])
    .select();

  if (error) {
    return {
      error: {
        message: "Database error: " + error.message,
      },
      success: false,
    };
  }

  revalidatePath("/tags");

  return {
    data,
    success: true,
  };
};

export const addProductToTag = async (formData) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products_tags")
    .upsert([
      {
        product_id: formData.product_id,
        tags_id: formData.tags_id,
      },
    ])
    .select();

  if (error) {
    return {
      error: {
        message: "Database error: " + error.message,
      },
      success: false,
    };
  }

  revalidatePath("/products_tags");

  return {
    data,
    success: true,
  };
};

export const searchProductByName = async (productName) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name")
    .textSearch("name", productName);

  if (error) {
    return {
      error: {
        message: "Database error: " + error.message,
      },
      success: false,
    };
  }

  return {
    data,
    success: true,
  };
};

export const linkProductTag = async ({ tagId, productId }) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_tags")
    .insert([
      {
        product_id: productId,
        tags_id: tagId,
      },
    ])
    .select();

  if (error) {
    return {
      error: {
        message: "Database error: " + error.message,
      },
      success: false,
    };
  }

  revalidatePath("/dashboard/tags/" + tagId + "/link");

  return {
    data,
    success: true,
  };
};

export const deleteTaggedProduct = async (productId, tagId) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_tags")
    .delete()
    .eq("product_id", productId)
    .eq("tags_id", tagId);

  if (error) {
    return {
      error: {
        message: "Database error: " + error.message,
      },
      success: false,
    };
  }

  revalidatePath("/dashboard/tags/" + tagId + "/link");

  return {
    data,
    success: true,
  };
};

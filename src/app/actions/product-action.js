"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from 'next/cache'
import { redirect } from "next/navigation";
export const addCategory = async (formData) => {

    const supabase = await createClient()
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
      is_digital: formData.isActive,
      is_active: formData.isDigital,
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

  revalidatePath("/products");
  redirect("/products")

  return {
    data,
    success: true,
  };
};

"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
export const updateShippingMethod = async (value) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ shipping_id: value.shipping_id })
    .eq("id", value.id)
    .select();
  if (error) {
    return {
      error: {
        message: "Database error: " + error.message,
      },
      success: false,
    };
  }
  revalidatePath("/test/order-page/" + value.id);
  return {
    data,
    success: true,
  };
};

export const applyCouponCode = async (value) => {
  
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: couponData, error: couponError } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", value.couponCode)
    .single();
  if (couponError) {
    return {
      error: {
        message: "Database error: " + couponError.message,
      },
      success: false,
    };
  }
  if (!couponData) {
    return {
      error: {
        message: "Coupon not found",
      },
      success: false,
    };
  }

  const { data, error } = await supabase.from("coupon_redemptions").insert({
    coupon_id: couponData.id,
    order_id: value.orderId,
    customer_id: user.id,
  });
  if (error) {
    return {
      error: {
        message: "Database error: " + error.message,
      },
      success: false,
    };
  }
  revalidatePath("/test/order-page/" + value.orderId);
  return {
    data,
    success: true,
  };
};

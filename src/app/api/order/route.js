import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  const supabase = await createClient();
  const { shipping_address } = await req.json();
  console.log(shipping_address);
  let subtotal = 0;
  // check user login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select("id, product_id, quantity")
    .eq("user_id", user.id);

  if (cartError) {
    return new Response(JSON.stringify({ error: cartError.message }), {
      status: 500,
    });
  }

  if (!cartItems || cartItems.length === 0) {
    return new Response(JSON.stringify({ error: "Cart is empty" }), {
      status: 400,
    });
  }

  const orderItems = [];

  for (const item of cartItems) {
    const { data: product, error: prodError } = await supabase
      .from("products")
      .select("*")
      .eq("id", item.product_id)
      .single();

    if (prodError || !product) {
      return new Response(JSON.stringify({ error: prodError.message }), {
        status: 500,
      });
    }

    if (product.stock_quantity < item.quantity) {
      return new Response(
        JSON.stringify({ error: "Not enough stock for product" }),
        {
          status: 400,
        }
      );
    }

    let finalUnitPrice = parseFloat(product.price);

    // Discount
    if (product.discount_id) {
      const { data: discount, error: discError } = await supabase
        .from("discounts")
        .select("*")
        .eq("id", product.discount_id)
        .single();

      const now = new Date();
      if (!discError && discount && discount.is_active) {
        const start = new Date(discount.start_date);
        const end = new Date(discount.end_date);
        if (now >= start && now <= end) {
          if (discount.discount_type === "percentage") {
            finalUnitPrice =
              finalUnitPrice * (1 - parseFloat(discount.discount_value) / 100);
          } else if (discount.discount_type === "fixed") {
            finalUnitPrice = Math.max(
              finalUnitPrice - parseFloat(discount.discount_value),
              0
            );
          }
        }
      }
    }

    const lineTotal = finalUnitPrice * item.quantity;
    subtotal += lineTotal;

    orderItems.push({
      product_id: product.id,
      quantity: item.quantity,
      unit_price: finalUnitPrice,
      total_price: subtotal,
    });
  }

  const { data: defaultShipping, error: shipError } = await supabase
    .from("shipping")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .single();
  if (shipError || !defaultShipping) {
    return new Response(
      JSON.stringify({ error: "Shipping method not found" }),
      {
        status: 400,
      }
    );
  }
  const shippingCost = parseFloat(defaultShipping.cost);

  const totalAmount = subtotal + shippingCost;

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: totalAmount,
      status: "pending",
      shipping_id: defaultShipping.id,
      shipping_address: shipping_address,
    })
    .select("*")
    .single();
  if (orderError) {
    return new Response(JSON.stringify({ error: orderError.message }), {
      status: 500,
    });
  }

  for (const items of orderItems) {
    items.order_id = orderData.id;

    const { error: orderItemError } = await supabase
      .from("order_items")
      .insert(items);
    if (orderItemError) {
      return new Response(
        JSON.stringify({ error: "Order item creation failed" }),
        {
          status: 500,
        }
      );
    }
  }

  // Deduct Stock
  for (const item of cartItems) {
    const { error: stockError } = await supabase
      .from("products")
      .update({
        stock_quantity: parseInt(item.quantity) - item.quantity,
      })
      .eq("id", item.product_id);

    if (stockError) {
      return new Response(JSON.stringify({ error: "Stock deduction failed" }), {
        status: 500,
      });
    }
  }

  // Clear Cart
  const { error: clearCartError } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (clearCartError) {
    return new Response(JSON.stringify({ error: "Cart clearing failed" }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({
      message: "Order created successfully",
      order: orderData,
      subtotal,
      shipping: defaultShipping,
      shipping_cost: shippingCost,
      total_amount: totalAmount,
      order_items: orderItems,
    }),
    {
      status: 201,
    }
  );
}

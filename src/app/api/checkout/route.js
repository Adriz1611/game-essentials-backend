export async function POST(req) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // check if the user has a order pending as per the oder id passed in the req body the order must in "pending" state
  const { orderId } = await req.json();

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("id", orderId)
    .single();

  if (orderError) {
    return new Response(JSON.stringify({ error: orderError.message }), {
      status: 500,
    });
  }
  if (!orderData) {
    return new Response(JSON.stringify({ error: "Order not found" }), {
      status: 404,
    });
  }
  if (orderData.user_id !== user.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  if (orderData.status !== "pending") {
    return new Response(JSON.stringify({ error: "Order already paid" }), {
      status: 400,
    });
  }

  // check the "paymentMethod" in req body

  const { paymentMethod } = await req.json();
    if (!paymentMethod) {
        return new Response(JSON.stringify({ error: "Payment method not found" }), {
        status: 400,
        });
    }

    // check if payment method is phonepe 
    if (paymentMethod === "phonepe") {
        
    }
}

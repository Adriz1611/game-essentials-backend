"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Test() {
  const address_id = "85e9d1b3-fe0f-42c8-a779-485580b1e254";
  const router = useRouter();

  // send the api request to /api/order
  // with the address_id
  const handleOrder = async () => {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shipping_address: address_id,
      }),
    });

    const data = await res.json();
    console.log(data.order.id);
    // redirect to /[id]/checkout
    router.push(`/test/order-page/${data.order.id}`);
  };

  return (
    <div>
      <Button onClick={handleOrder}>Order Now</Button>
    </div>
  );
}

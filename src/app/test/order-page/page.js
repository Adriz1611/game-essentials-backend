"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Test() {
  const address_id = "0380f7bf-60e9-497f-be9a-4b7612529bd9";
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

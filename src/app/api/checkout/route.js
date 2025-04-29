import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Authentication error", details: authError.message },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: No user found" },
        { status: 401 }
      );
    }

    const { orderId, paymentMethod } = await req.json();

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*, customers (*), shipping_address (*)")
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

    if (!paymentMethod) {
      return new Response(
        JSON.stringify({ error: "Payment method not found" }),
        {
          status: 400,
        }
      );
    }

    if (paymentMethod === "phonepe") {
      let salt_key = "96434309-7796-489d-8924-ab56988a6076";
      let merchant_id = "PGTESTPAYUAT86";

      const data = {
        merchantId: merchant_id,
        merchantTransactionId: orderData.id,
        name:
          orderData.customers?.first_name ||
          "First" + " " + orderData.customers?.last_name ||
          "Last",
        amount: orderData.total_amount * 100,
        redirectUrl: `http://${req.headers.get("host")}/success`,
        callbackUrl: `http://${req.headers.get("host")}/success`,
        redirectMode: "POST",
        mobileNumber:
          orderData.customers?.phone || orderData.shipping_address?.phone,
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      };

      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString("base64");
      const keyIndex = 1;
      const string = payloadMain + "/pg/v1/pay" + salt_key;
      const sha256 = crypto.createHash("sha256").update(string).digest("hex");
      const checksum = `${sha256}###${keyIndex}`;

      const prod_URL =
        "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

      const options = {
        method: "POST",
        url: prod_URL,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
        data: {
          request: payloadMain,
        },
      };

      const response = await axios(options);

      if (response.data.data.instrumentResponse.redirectInfo.url) {
        return NextResponse.json({
          redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
        });
      } else {
        return NextResponse.json(
          { error: "Payment initiation failed" },
          { status: 500 }
        );
      }
    } else if (paymentMethod == "cashfree") {
      const request = {
        order_amount: orderData.total_amount,
        order_currency: "INR",
        customer_details: {
          customer_id: orderData.customers?.id,
          customer_name:
            orderData.customers?.first_name ||
            "First" + " " + orderData.customers?.last_name ||
            "Last",
          customer_email: orderData.customers?.email,
          customer_phone:
            orderData.customers?.phone || orderData.shipping_address?.phone,
        },
        order_meta: {
          return_url: `http://${req.headers.get("host")}/success`,
          notify_url:
            "https://webhook.site/9671b80e-0541-4c86-bbe2-da0802984699",
          order_id: orderData.id,
        },
        order_note: orderData.id,
      };

      const options = {
        method: "POST",
        url: "https://sandbox.cashfree.com/pg/orders",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": "TEST1053325906729e357b9ade9df73595233501",
          "x-client-secret":
            "cfsk_ma_test_25098d514fc79227bf4531f3aaff5685_a477329e",
          "x-api-version": "2023-08-01",
        },
        data: JSON.stringify(request),
      };

      const res = await axios(options);
      return NextResponse.json({
        session_id: res.data.payment_session_id,
      });
    }
  } catch (error) {
    console.error("Error in checkout route:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

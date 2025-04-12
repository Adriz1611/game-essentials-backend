"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  updateShippingMethod,
  applyCouponCode,
} from "@/app/actions/test-action";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function TestPage({ data, shippingMethods }) {
  const [couponCode, setCouponCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState(data[0].shipping_id);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cashfree");

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPaymentModal(true);
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    const res = await applyCouponCode({ couponCode, orderId: data[0].id });
    if (res.success) {
      alert("Coupon applied successfully!");
    } else {
      alert(res.error?.message);
    }
  };

  const handleChangeShippingMethod = (value) => {
    setShippingMethod(value);
    const selectedMethod = shippingMethods.find(
      (method) => method.id === value
    );
    if (selectedMethod) {
      updateShippingMethod({ id: data[0].id, shipping_id: selectedMethod.id });
    }
  };

  const handlePaymentSubmit = async () => {
    setShowPaymentModal(false);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: data[0].id,
        paymentMethod: selectedPayment,
      }),
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Order Details</h2>
        <p className="text-lg">Order ID: {data[0].id}</p>
        <p className="text-lg">Total Amount: {data[0].total_amount}</p>
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Products</h3>
          {data[0].order_items.map((item) => (
            <div key={item.id} className="border p-4 mb-2">
              <p className="font-medium">Product Name: {item.products.name}</p>
              <p>Price: {item.unit_price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      <Card className="max-w-md mx-auto mb-4">
        <CardHeader>
          <CardTitle>Apply Coupon Code</CardTitle>
          <CardDescription>Update your coupon</CardDescription>
        </CardHeader>
        <form onSubmit={handleCouponSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="coupon">Coupon Code</Label>
              <Input
                id="coupon"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Apply Coupon
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="max-w-md mx-auto mb-4">
        <CardHeader>
          <CardTitle>Shipping Method</CardTitle>
          <CardDescription>Select your shipping method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Shipping Method</Label>
            <RadioGroup
              value={shippingMethod}
              onValueChange={(value) => {
                handleChangeShippingMethod(value);
              }}
              className="space-y-2"
            >
              {shippingMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={method.id}
                    id={`shipping-method-${method.id}`}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`shipping-method-${method.id}`}>
                    {method.name} -{" "}
                    {method.cost === 0 ? "Free" : `${method.cost}`}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-md mx-auto">
        <Button onClick={handleSubmit} className="w-full">
          Continue to Payment
        </Button>
      </div>

      {showPaymentModal && (
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Payment Method</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 my-4">
              <RadioGroup
                value={selectedPayment}
                onValueChange={setSelectedPayment}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="phonepe"
                    id="phonepe"
                    className="h-4 w-4"
                  />
                  <Label htmlFor="payment-phonepe" className="cursor-pointer">
                    Phonepe
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="cashfree"
                    id="cashfree"
                    className="h-4 w-4"
                  />
                  <Label htmlFor="payment-cashfree" className="cursor-pointer">
                    Cashfree (Recommended)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="razorpay"
                    id="razorpay"
                    className="h-4 w-4"
                  />
                  <Label htmlFor="payment-razorpay" className="cursor-pointer">
                    Razorpay
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  onClick={() => handlePaymentSubmit()}
                  className="w-full"
                >
                  Pay Now
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

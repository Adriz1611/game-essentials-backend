"use client";
import { useState } from "react";
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

export default function TestPage({ data, shippingMethods }) {
  const [couponCode, setCouponCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Coupon Code:", couponCode);
    console.log("Shipping Method:", shippingMethod);
    // Add your checkout logic here
  };

const handleCouponSubmit = (e) => {
    e.preventDefault();
    console.log("Coupon Code:", couponCode);
    // Call your coupon server action here to update the coupon in the database
};

const handleShippingSubmit = (e) => {
    e.preventDefault();
    console.log("Shipping Method:", shippingMethod);
    // Call your shipping server action here to update the shipping method in the database
};

return (
    <div className="container mx-auto py-10">
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Order Details</h2>
            <p className="text-lg">Order ID: {data[0].id}</p>
            <p className="text-lg">Total Amount: ${data[0].total_amount}</p>
            <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Products</h3>
                {data[0].order_items.map((item) => (
                    <div key={item.id} className="border p-4 mb-2">
                        <p className="font-medium">Product Name: {item.products.name}</p>
                        <p>Price: ${item.unit_price}</p>
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
                            setShippingMethod(value);
                            console.log("Shipping Method:", value);
                            // Call your shipping server action here to update the shipping method in the database
                        }}
                        className="space-y-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standard" id="standard" />
                            <Label htmlFor="standard" className="cursor-pointer">
                                Standard Shipping (3-5 business days)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="express" id="express" />
                            <Label htmlFor="express" className="cursor-pointer">
                                Express Shipping (1-2 business days)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="overnight" id="overnight" />
                            <Label htmlFor="overnight" className="cursor-pointer">
                                Overnight Shipping (24 hours)
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </CardContent>
        </Card>

        <div className="max-w-md mx-auto">
            <Button onClick={handleSubmit} className="w-full">
                Continue to Payment
            </Button>
        </div>
    </div>
);
}

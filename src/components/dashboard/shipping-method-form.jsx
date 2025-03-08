"use client";


import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Shipping method name must be at least 2 characters.",
  }),
  cost: z.coerce.number().min(0, {
    message: "Cost must be a non-negative number.",
  }),
  estimatedDelivery: z.string().min(2, {
    message: "Estimated delivery information is required.",
  }),
  isActive: z.boolean().default(true),
});

export default function ShippingMethodForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cost: 0,
      estimatedDelivery: "",
      isActive: true,
    },
  });

  async function onSubmit(values) {
    setIsPending(true);
    console.log(values);

    console.error("Failed to create shipping method:", error);
    alert("Failed to create shipping method. Please try again.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Method Details</CardTitle>
        <CardDescription>
          Add a new shipping method for your store.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Standard Shipping" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the shipping method as it will appear to
                    customers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <div className="relative">

                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-7"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The cost of this shipping method. Enter 0 for free shipping.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedDelivery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Delivery</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 3-5 business days" {...field} />
                  </FormControl>
                  <FormDescription>
                    The estimated delivery time for this shipping method.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Enable or disable this shipping method for customers.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/shipping")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Shipping Method"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

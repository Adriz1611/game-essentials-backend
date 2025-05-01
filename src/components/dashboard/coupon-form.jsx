"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { createCoupon } from "@/app/actions/product-action";

const formSchema = z.object({
  code: z.string().min(3, {
    message: "Coupon code must be at least 3 characters.",
  }),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.string().min(1, {
    message: "Discount value is required.",
  }),
  startDate: z.date(),
  endDate: z.date(),
  userUsage: z.string().optional(),
  totalUsageLimit: z.string().optional(),
  isActive: z.boolean().default(true),
});

export default function CouponForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      discountType: "percentage",
      discountValue: "",
      startDate: new Date(),
      endDate: new Date(),
      userUsage: "",
      totalUsageLimit: "",
      isActive: true,
    },
  });

  async function onSubmit(values) {
    setIsPending(true);

    const couponData = {
      ...values,
      discountValue: Number.parseInt(values.discountValue),
      userUsage: values.userUsage ? Number.parseInt(values.userUsage) : null,
      totalUsageLimit: values.totalUsageLimit
        ? Number.parseInt(values.totalUsageLimit)
        : null,
    };
    const res = await createCoupon(couponData);
   
    if (res.success) {
      form.reset();
      setIsPending(false);
      alert("Coupon created successfully!");
    } else {
      alert(res?.error?.message || "Failed to create Coupon");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter coupon code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Value</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter discount value"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {form.watch("discountType") === "percentage"
                  ? "Enter percentage value (e.g., 10 for 10% off)"
                  : "Enter fixed amount value"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date > form.getValues("endDate")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < form.getValues("startDate")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userUsage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Usage Limit (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter user usage limit"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>
                Leave blank for unlimited user usage
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalUsageLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Usage Limit (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter total usage limit"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>
                Leave blank for unlimited total usage
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
                <FormLabel className="text-base">Active</FormLabel>
                <FormDescription>
                  Set the coupon as active or inactive
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
            onClick={() => router.push("/dashboard/promotions/coupons")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Coupon"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

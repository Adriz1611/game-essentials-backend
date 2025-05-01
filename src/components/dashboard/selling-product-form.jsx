"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const mockProducts = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    seller_id: "123e4567-e89b-12d3-a456-426614174001",
    seller_name: "John's Vintage Shop",
    name: "Vintage Camera",
    original_mrp: 399.99,
    selling_price: 299.99,
    stock: 5,
    weight: 1.2,
    description: "A beautiful vintage camera in excellent condition",
    selling_type: "list_on_site",
    quality: "like_new",
    created_at: "2024-03-15T10:30:00Z",
    updated_at: "2024-03-15T10:30:00Z",
  },
  {
    id: "223e4567-e89b-12d3-a456-426614174000",
    seller_id: "223e4567-e89b-12d3-a456-426614174001",
    seller_name: "Antique Treasures",
    name: "Antique Pocket Watch",
    original_mrp: 799.99,
    selling_price: 599.99,
    stock: 2,
    weight: 0.3,
    description: "Gold-plated pocket watch from the 1920s",
    selling_type: "sell_to_us",
    quality: "good",
    created_at: "2024-03-14T14:20:00Z",
    updated_at: "2024-03-15T09:15:00Z",
  },
  // Other mock products...
]

// Mock data for sellers
const mockSellers = [
  { id: "123e4567-e89b-12d3-a456-426614174001", name: "John's Vintage Shop" },
  { id: "223e4567-e89b-12d3-a456-426614174001", name: "Antique Treasures" },
  { id: "323e4567-e89b-12d3-a456-426614174001", name: "Tech Refurb Center" },
  { id: "423e4567-e89b-12d3-a456-426614174001", name: "Handmade Crafts" },
  { id: "523e4567-e89b-12d3-a456-426614174001", name: "Digital Downloads" },
]

const formSchema = z.object({
  seller_id: z.string({
    required_error: "Please select a seller",
  }),
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters",
  }),
  original_mrp: z.coerce.number().positive({
    message: "MRP must be a positive number",
  }),
  selling_price: z.coerce.number().positive({
    message: "Selling price must be a positive number",
  }),
  stock: z.coerce.number().int().nonnegative({
    message: "Stock must be a non-negative integer",
  }),
  weight: z.coerce
    .number()
    .positive({
      message: "Weight must be a positive number",
    })
    .nullable()
    .optional(),
  description: z.string().nullable().optional(),
  selling_type: z.enum(["list_on_site", "sell_to_us"], {
    required_error: "Please select a selling type",
  }),
  quality: z.enum(["new_with_tag", "like_new", "good", "used", "digital"], {
    required_error: "Please select a product quality",
  }),
})



export default function SellingProductForm({ productId }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  const isEditMode = !!productId

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      seller_id: "",
      name: "",
      original_mrp: 0,
      selling_price: 0,
      stock: 0,
      weight: null,
      description: null,
      selling_type: "list_on_site",
      quality: "new_with_tag",
    },
  })

  useEffect(() => {
    if (isEditMode) {
      // Find the product in our mock data
      const product = mockProducts.find((p) => p.id === productId)
      if (product) {
        // Set form values from the product
        form.reset({
          seller_id: product.seller_id,
          name: product.name,
          original_mrp: product.original_mrp,
          selling_price: product.selling_price,
          stock: product.stock,
          weight: product.weight,
          description: product.description,
          selling_type: product.selling_type,
          quality: product.quality,
        })
      }
    }
  }, [productId, isEditMode, form])

  async function onSubmit(values) {
    setIsPending(true)
    try {
      // Here you would typically send the data to your backend
      console.log(values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate back to product list
      router.push("/dashboard/sellings/products");
      router.refresh()
    } catch (error) {
      console.error("Failed to save product:", error)
      alert("Failed to save product. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Selling Product" : "Add New Selling Product"}</CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update the details of an existing product"
            : "Enter the details of the product you want to list for sale"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="seller_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seller</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a seller" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSellers.map((seller) => (
                        <SelectItem key={seller.id} value={seller.id}>
                          {seller.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the seller who is listing this product</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormDescription>The name of the product as it will appear to customers</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="original_mrp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original MRP</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input type="number" step="0.01" min="0" placeholder="0.00" className="pl-7" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>The original manufacturer's retail price</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selling_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input type="number" step="0.01" min="0" placeholder="0.00" className="pl-7" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>The price at which the product is being sold</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>The number of units available for sale</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : Number.parseFloat(e.target.value)
                            field.onChange(value)
                          }}
                        />
                        <span className="absolute right-3 top-2.5 text-muted-foreground">kg</span>
                      </div>
                    </FormControl>
                    <FormDescription>The weight of the product in kilograms</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="selling_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select selling type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="list_on_site">List on Site</SelectItem>
                        <SelectItem value="sell_to_us">Sell to Us</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose whether the product is listed for sale on the site or being sold directly to us
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Quality</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product quality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new_with_tag">New with Tag</SelectItem>
                        <SelectItem value="like_new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                        <SelectItem value="digital">Digital</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The quality condition of the product</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="min-h-[120px]"
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed description of the product including features, condition, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/selling-products")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : isEditMode ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


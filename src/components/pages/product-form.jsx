"use client";
import { X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { addProduct, updateProduct } from "@/app/actions/product-action";
import { uploadProductImages } from "@/utils/image-upload";
import { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.number().positive({
    message: "Price must be a positive number.",
  }),
  currency: z.string().min(1, {
    message: "Please select a currency.",
  }),
  stockQuantity: z.number().int().nonnegative({
    message: "Stock quantity must be a non-negative integer.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  specifications: z.array(
    z.object({
      key: z.string().min(1, { message: "Key is required" }),
      value: z.string().min(1, { message: "Value is required" }),
    })
  ),
  isActive: z.boolean(),
  isDigital: z.boolean(),
});

export default function ProductForm({ product_data, categories_data }) {
  const isEditMode = !!product_data;
  const [uploadedImages, setUploadedImages] = useState(
    product_data?.images || []
  );
  const [categories, setCategories] = useState(categories_data);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product_data?.name || "",
      description: product_data?.description || "",
      price: product_data?.price || 0,
      currency: product_data?.currency || "",
      stockQuantity: product_data?.stock_quantity || 0,
      category: product_data?.category_id || "",
      specifications: product_data?.specifications || [{ key: "", value: "" }],
      isActive: product_data?.is_active ?? false,
      isDigital: product_data?.is_digital ?? false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "specifications",
  });

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedImages((prevImages) => [...prevImages, ...acceptedFiles]);
  }, []);

  const removeImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: true,
  });

  async function onSubmit(values) {
    try {
      // First, upload the images and get array of URLs
      const { imageUrls, error: uploadError } = await uploadProductImages(
        uploadedImages,
        crypto.randomUUID()
      );

      if (uploadError) {
        alert("Error uploading images: " + uploadError.message);
        return;
      }

      // Add the image URLs array to the product data
      const productData = {
        ...values,
        images: imageUrls,
      };

      const res = isEditMode
        ? await updateProduct(product_data.id, productData)
        : await addProduct(productData);

      if (!res.success) {
        alert(res.error?.message);
      } else {
        alert(`Product ${isEditMode ? "updated" : "added"} successfully!`);
      }
    } catch (error) {
      alert(
        `Error ${isEditMode ? "updating" : "adding"} product: ` + error.message
      );
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Product" : "Add New Product"}</CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update the details for the product."
            : "Enter the details for the new product."}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? ""
                              : Number.parseFloat(e.target.value)
                          )
                        }
                        value={field.value === 0 ? "" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="INR">INR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? 0
                            : Number.parseInt(e.target.value)
                        )
                      }
                      value={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label>Specifications</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mt-2">
                  <Input
                    {...form.register(`specifications.${index}.key`)}
                    placeholder="Key"
                  />
                  <Input
                    {...form.register(`specifications.${index}.value`)}
                    placeholder="Value"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ key: "", value: "" })}
                className="mt-2"
              >
                Add Specification
              </Button>
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Set the product as active or inactive
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

              <FormField
                control={form.control}
                name="isDigital"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Digital Product
                      </FormLabel>
                      <FormDescription>
                        Is this a digital product?
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
            </div>
            <div>
              <Label>Product Images</Label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-md p-4 mt-2 cursor-pointer"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag 'n' drop some files here, or click to select files</p>
                )}
              </div>
              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={isEditMode ? file : URL.createObjectURL(file)}
                        alt={`Uploaded image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit">
              {isEditMode ? "Update Product" : "Add Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

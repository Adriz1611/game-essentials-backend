"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { addCategory, updateCategory } from "@/app/actions/product-action";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .optional(),
  parent_category_id: z.string().optional(),
});

export default function AddCategoryForm({ categories_data, category_id }) {
  const [categories] = useState(categories_data);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category_id ? category_id.name : "",
      description: category_id ? category_id.description : "",
      parent_category_id: category_id ? category_id.parent_id : undefined,
    },
  });

  const onSubmit = async (values) => {
    if (category_id) {
      const result = await updateCategory(category_id.id, values);
      if (result.success) {
        alert("Category updated successfully!");
      } else {
        alert(result.error?.message);
      }
    } else {
      const result = await addCategory(values);
      if (result.success) {
        form.reset();
        alert("Category added successfully!");
      } else {
        alert(result.error?.message);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {category_id ? "Edit Category" : "Add New Category"}
        </CardTitle>
        <CardDescription>
          {category_id
            ? "Edit the details of the category."
            : "Create a new product category."}
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
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
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
                      placeholder="Enter category description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parent_category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a parent category if this is a subcategory.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              {category_id ? "Update Category" : "Add Category"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

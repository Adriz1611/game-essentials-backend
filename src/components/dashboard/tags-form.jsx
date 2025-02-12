"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { addTag, updateTag } from "@/app/actions/product-action";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tag name must be at least 2 characters.",
  }),
  description: z
    .string()
    .min(4, {
      message: "Description must be at least 4 characters.",
    })
    .optional(),
  isActive: z.boolean(),
});

export default function TagForm({ tags_data }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tags_data?.name || "",
      description: tags_data?.description || "",
      isActive: tags_data?.isActive ?? true,
    },
  });

  async function onSubmit(values) {
    let res;
    if (tags_data) {
      // Editing existing tag
      res = await updateTag(values, tags_data.id );
    } else {
      // Adding a new tag
      res = await addTag(values);
    }
    if (res.success) {
      alert(tags_data ? "Tag updated successfully!" : "Tag added successfully!");
    } else {
      alert(res.error?.message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tags_data ? "Edit Tag" : "Add New Tag"}</CardTitle>
        <CardDescription>
          {tags_data ? "Edit an existing product tag." : "Create a new product tag."}
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
                  <FormLabel>Tag Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tag name" {...field} />
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
                    <Textarea placeholder="Enter tag description" {...field} />
                  </FormControl>
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
                      Set the tag as active or inactive
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

            <Button type="submit">{tags_data ? "Update Tag" : "Add Tag"}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

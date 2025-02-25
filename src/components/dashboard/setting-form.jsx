"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";

const formSchema = z.object({
  heroImage: z.string().url().min(1, { message: "Hero image URL is required" }),
  heroLink: z.string().url().min(1, { message: "Hero link URL is required" }),
  categories: z
    .array(z.string())
    .min(1, { message: "At least one category must be selected" }),
});

const categories = [
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  { label: "Books", value: "books" },
  { label: "Home & Garden", value: "home-garden" },
  { label: "Toys", value: "toys" },
];

export function SettingsForm({ siteType }) {
  const [isUploading, setIsUploading] = useState(false);

  const form =
    useForm (
      {
        resolver: zodResolver(formSchema),
        defaultValues: {
          heroImage: "",
          heroLink: "",
          categories: [],
        },
      });

  async function onSubmit(values) {
    console.log(values);
    // Here you would typically send the data to your backend
    alert(`Settings for ${siteType} site updated successfully!`);
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulating file upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // In a real application, you would upload the file to your server or a cloud storage service
      // and get back the URL of the uploaded image
      const fakeUploadedUrl = URL.createObjectURL(file);
      form.setValue("heroImage", fakeUploadedUrl);
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="heroImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Image</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input
                        {...field}
                        placeholder="Enter image URL or upload"
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full max-w-xs"
                        disabled={isUploading}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter a URL or upload an image for the hero section.
                    Recommended size: 1920x1080px.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heroLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Link</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter hero link URL" />
                  </FormControl>
                  <FormDescription>
                    Enter the URL where the hero image should link to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={categories}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select categories"
                    />
                  </FormControl>
                  <FormDescription>
                    Select the categories to display in the sub-navbar.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Save Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

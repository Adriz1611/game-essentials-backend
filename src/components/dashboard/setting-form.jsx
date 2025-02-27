"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import { uploadHeroImage } from "@/utils/image-upload";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { configureSettings } from "@/app/actions/setting-action";

const formSchema = z.object({
  heroImage: z.string().optional(),
  heroLink: z.string().url().min(1, { message: "Hero link URL is required" }),
  categories: z
    .array(z.string())
    .min(1, { message: "At least one category must be selected" }),
});

export function SettingsForm({ siteType, categories_data }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heroImage: "",
      heroLink: "",
      categories: [],
    },
  });

  async function onSubmit(values) {
    let finalImageUrl = values.heroImage;
    if (uploadedFile) {
      setIsUploading(true);
      const { imageUrl, error } = await uploadHeroImage(uploadedFile, siteType);
      if (error) {
        console.error("Error uploading hero image:", error);
        setIsUploading(false);
        return;
      }
      finalImageUrl = imageUrl;
    }
    if (!finalImageUrl) {
      alert("Hero image URL is required");
      setIsUploading(false);
      return;
    }
    const updatedValues = {
      ...values,
      heroImage: finalImageUrl,
      site_type: siteType,
    };
    const res = await configureSettings(updatedValues);
    if (!res.success) {
      alert(res?.error?.message);
      setIsUploading(false);
      return;
    }
    alert(`Settings for ${siteType} site updated successfully!`);
    setIsUploading(false);
  }

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setUploadedFileName(file.name);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const addCategory = (category) => {
    const currentCategories = form.getValues("categories");
    if (!currentCategories.includes(category)) {
      form.setValue("categories", [...currentCategories, category]);
    }
  };

  const removeCategory = (category) => {
    const currentCategories = form.getValues("categories");
    form.setValue(
      "categories",
      currentCategories.filter((c) => c !== category)
    );
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
                    <div
                      {...getRootProps()}
                      className="border-2 border-dashed rounded-md p-4 cursor-pointer flex items-center space-x-2"
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p>Drop the image here ...</p>
                      ) : (
                        <p>Drag & drop an image here, or click to select</p>
                      )}
                      {uploadedFileName && (
                        <span className="text-sm text-muted-foreground">
                          {uploadedFileName}
                        </span>
                      )}
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
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((category) => (
                          <Badge key={category} variant="success">
                            {
                              categories_data.find((c) => c.id === category)
                                ?.name
                            }
                            <button
                              type="button"
                              onClick={() => removeCategory(category)}
                              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Select onValueChange={addCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories_data.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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

"use client"


import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Upload } from "lucide-react"

// Mock categories data
const mockCategories = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Clothing" },
  { id: "3", name: "Books" },
  { id: "4", name: "Home & Garden" },
  { id: "5", name: "Sports" },
  { id: "6", name: "Toys" },
]

const formSchema = z.object({
  heroImage: z.string().min(1, "Hero image is required"),
  heroRedirectUrl: z.string().url("Please enter a valid URL"),
  subNavCategories: z.array(z.string()).min(1, "Please select at least one category"),
})


export default function StorefrontSettings() {
  const [activeTab, setActiveTab] = useState("main")
  const [selectedCategories, setSelectedCategories] = useState({
    main: [],
    digital: [],
    resell: [],
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heroImage: "",
      heroRedirectUrl: "",
      subNavCategories: [],
    },
  })

  const onSubmit = (values) => {
    console.log(values)
    // Here you would typically send the data to your backend
    alert("Settings saved successfully!")
  }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].includes(categoryId)
        ? prev[activeTab].filter((id) => id !== categoryId)
        : [...prev[activeTab], categoryId],
    }))
    form.setValue("subNavCategories", selectedCategories[activeTab])
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Here you would typically handle the file upload
      // For now, we'll just set the filename
      form.setValue("heroImage", file.name)
    }
  }

  return (
    <Tabs defaultValue="main" className="space-y-6" onValueChange={(value) => setActiveTab(value)}>
      <TabsList>
        <TabsTrigger value="main">Main Site</TabsTrigger>
        <TabsTrigger value="digital">Digital Site</TabsTrigger>
        <TabsTrigger value="resell">Resell Site</TabsTrigger>
      </TabsList>

      {["main", "digital", "resell"].map((site) => (
        <TabsContent key={site} value={site}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>Configure the hero section of your storefront.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="heroImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Image</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id={`hero-image-${site}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById(`hero-image-${site}`)?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Image
                            </Button>
                            {field.value && <span className="text-sm text-muted-foreground">{field.value}</span>}
                          </div>
                        </FormControl>
                        <FormDescription>Recommended size: 1920x1080px. Max file size: 5MB.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="heroRedirectUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Redirect URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/landing-page" {...field} />
                        </FormControl>
                        <FormDescription>
                          The URL where users will be redirected when clicking the hero section.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Navigation</CardTitle>
                  <CardDescription>Select categories to display in the sub-navigation bar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="subNavCategories"
                    render={() => (
                      <FormItem>
                        <FormLabel>Sub-Navigation Categories</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {selectedCategories[activeTab].map((categoryId) => {
                                const category = mockCategories.find((c) => c.id === categoryId)
                                return (
                                  <Badge key={categoryId} variant="secondary">
                                    {category?.name}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="ml-1 h-4 w-4 p-0"
                                      onClick={() => handleCategorySelect(categoryId)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                )
                              })}
                            </div>
                            <Select onValueChange={handleCategorySelect} value="">
                              <SelectTrigger>
                                <SelectValue placeholder="Select categories" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockCategories
                                  .filter(
                                    (category) => !selectedCategories[activeTab].includes(category.id),
                                  )
                                  .map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Select the categories you want to display in the sub-navigation bar.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      ))}
    </Tabs>
  )
}


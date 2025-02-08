"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link";
// Sample products data
const sampleProducts = [
  { id: 1, name: "Smartphone X" },
  { id: 2, name: "Laptop Pro" },
  { id: 3, name: "Wireless Earbuds" },
  { id: 4, name: "4K Smart TV" },
  { id: 5, name: "Gaming Console" },
  { id: 6, name: "Fitness Tracker" },
  { id: 7, name: "Digital Camera" },
  { id: 8, name: "Bluetooth Speaker" },
  { id: 9, name: "Tablet Ultra" },
  { id: 10, name: "Smartwatch" },
]

const formSchema = z.object({
  search: z.string().min(1, "Product name is required"),
})

export default function TagProductAssociation({ tagId, tagName }) {
  const [products, setProducts] = useState(sampleProducts)
  const [taggedProducts, setTaggedProducts] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  })

  const onSubmit = (values) => {
    const results = products.filter((p) => p.name.toLowerCase().includes(values.search.toLowerCase())).slice(0, 5)
    setSearchResults(results)
  }

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const addProductsToTag = () => {
    setTaggedProducts((prev) => [...new Set([...prev, ...selectedProducts])])
    setSelectedProducts([])
    setSearchResults([])
    form.reset()
  }

  const removeProductFromTag = (productId) => {
    setTaggedProducts((prev) => prev.filter((id) => id !== productId))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Associate Products with Tag: {tagName}</CardTitle>
        <CardDescription>Search for products and add them to this tag.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Search Products</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-8">
                Search
              </Button>
            </div>
          </form>
        </Form>

        {searchResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Search Results</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Product Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button className="mt-4" onClick={addProductsToTag} disabled={selectedProducts.length === 0}>
              Add Selected Products to {tagName}
            </Button>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Products Tagged with {tagName}</h3>
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taggedProducts.map((productId) => {
                  const product = products.find((p) => p.id === productId)
                  return product ? (
                    <TableRow key={productId}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => removeProductFromTag(productId)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : null
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}


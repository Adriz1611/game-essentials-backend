"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Mock data for products and tags
const mockProducts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  tags: [],
}))

const mockTags = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Tag ${i + 1}`,
}))

const formSchema = z.object({
  search: z.string().optional(),
})

export default function ProductTagAssociation() {
  const [products, setProducts] = useState(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [availableTags, setAvailableTags] = useState(mockTags)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  })

  const onSubmit = (values) => {
    const searchTerm = values.search?.toLowerCase() || ""
    const filtered = products.filter((product) => product.name.toLowerCase().includes(searchTerm))
    setFilteredProducts(filtered)
    setCurrentPage(1)
  }

  useEffect(() => {
    form.watch((value) => onSubmit(value))
  }, [form, onSubmit]) // Added onSubmit to dependencies

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const toggleTag = (productId, tagId) => {
    setProducts(
      products.map((product) => {
        if (product.id === productId) {
          const updatedTags = product.tags.includes(tagId)
            ? product.tags.filter((id) => id !== tagId)
            : [...product.tags, tagId]
          return { ...product, tags: updatedTags }
        }
        return product
      }),
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Associate Products with Tags</CardTitle>
        <CardDescription>Search for products and manage their tags.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search Products</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name..." {...field} />
                  </FormControl>
                  <FormDescription>Search for products by name to manage their tags.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Associated Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.tags.map((tagId) => (
                      <Badge key={tagId} variant="secondary" className="mr-1">
                        {mockTags.find((t) => t.id === tagId)?.name}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product.id)}>
                      Manage Tags
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => paginate(Math.max(1, currentPage - 1))} className="cursor-pointer" />
              </PaginationItem>
              {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => paginate(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => paginate(Math.min(Math.ceil(filteredProducts.length / itemsPerPage), currentPage + 1))}
                  className="cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {selectedProduct && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Manage Tags for {products.find((p) => p.id === selectedProduct)?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72 w-full rounded-md border p-4">
                {availableTags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      checked={products.find((p) => p.id === selectedProduct)?.tags.includes(tag.id)}
                      onChange={() => toggleTag(selectedProduct, tag.id)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <label
                      htmlFor={`tag-${tag.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tag.name}
                    </label>
                  </div>
                ))}
              </ScrollArea>
              <Button className="mt-4" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}


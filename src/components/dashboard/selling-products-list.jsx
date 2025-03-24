"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Search, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"


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
    selling_type: "list_on_site",
    quality: "good",
    created_at: "2024-03-14T14:20:00Z",
    updated_at: "2024-03-15T09:15:00Z",
  },
  {
    id: "323e4567-e89b-12d3-a456-426614174000",
    seller_id: "323e4567-e89b-12d3-a456-426614174001",
    seller_name: "Tech Refurb Center",
    name: "iPhone 12 Pro",
    original_mrp: 999.99,
    selling_price: 649.99,
    stock: 15,
    weight: 0.5,
    description: "Refurbished iPhone 12 Pro with 1-year warranty",
    selling_type: "sell_to_us",
    quality: "used",
    created_at: "2024-03-13T16:45:00Z",
    updated_at: "2024-03-14T11:30:00Z",
  },
  {
    id: "423e4567-e89b-12d3-a456-426614174000",
    seller_id: "423e4567-e89b-12d3-a456-426614174001",
    seller_name: "Handmade Crafts",
    name: "Handcrafted Leather Wallet",
    original_mrp: 89.99,
    selling_price: 69.99,
    stock: 20,
    weight: 0.2,
    description: "Handmade genuine leather wallet",
    selling_type: "list_on_site",
    quality: "new_with_tag",
    created_at: "2024-03-12T09:10:00Z",
    updated_at: "2024-03-12T14:25:00Z",
  },
  {
    id: "523e4567-e89b-12d3-a456-426614174000",
    seller_id: "523e4567-e89b-12d3-a456-426614174001",
    seller_name: "Digital Downloads",
    name: "Premium Photo Collection",
    original_mrp: 199.99,
    selling_price: 149.99,
    stock: 999,
    weight: null,
    description: "Collection of 100 premium stock photos",
    selling_type: "list_on_site",
    quality: "digital",
    created_at: "2024-03-10T13:20:00Z",
    updated_at: "2024-03-11T16:40:00Z",
  },
]

export default function SellingProductsList() {
  const [products, setProducts] = useState(mockProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [qualityFilter, setQualityFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState(null)

  const sortProducts = (key) => {
    let direction = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })

    setProducts(
      [...products].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === "asc" ? -1 : 1
        }
        if (a[key] > b[key]) {
          return direction === "asc" ? 1 : -1
        }
        return 0
      }),
    )
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = typeFilter === "all" || product.selling_type === typeFilter
    const matchesQuality = qualityFilter === "all" || product.quality === qualityFilter

    return matchesSearch && matchesType && matchesQuality
  })

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`
  }

  const getSellingTypeBadge = (type) => {
    switch (type) {
      case "list_on_site":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            List on Site
          </Badge>
        )
      case "sell_to_us":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Sell to Us
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getQualityBadge = (quality) => {
    switch (quality) {
      case "new_with_tag":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            New with Tag
          </Badge>
        )
      case "like_new":
        return (
          <Badge variant="outline" className="bg-teal-100 text-teal-800">
            Like New
          </Badge>
        )
      case "good":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Good
          </Badge>
        )
      case "used":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Used
          </Badge>
        )
      case "digital":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Digital
          </Badge>
        )
      default:
        return <Badge variant="outline">{quality}</Badge>
    }
  }

  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="list_on_site">List on Site</SelectItem>
              <SelectItem value="sell_to_us">Sell to Us</SelectItem>
            </SelectContent>
          </Select>
          <Select value={qualityFilter} onValueChange={setQualityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Qualities</SelectItem>
              <SelectItem value="new_with_tag">New with Tag</SelectItem>
              <SelectItem value="like_new">Like New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="used">Used</SelectItem>
              <SelectItem value="digital">Digital</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => sortProducts("name")} className="flex items-center">
                  Product Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortProducts("seller_name")} className="flex items-center">
                  Seller <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortProducts("original_mrp")} className="flex items-center">
                  MRP <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortProducts("selling_price")} className="flex items-center">
                  Selling Price <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortProducts("stock")} className="flex items-center">
                  Stock <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quality</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.seller_name}</TableCell>
                  <TableCell>{formatCurrency(product.original_mrp)}</TableCell>
                  <TableCell>{formatCurrency(product.selling_price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getSellingTypeBadge(product.selling_type)}</TableCell>
                  <TableCell>{getQualityBadge(product.quality)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/selling-products/${product.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                      <Link href={`/admin/selling-products/edit/${product.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

// This is a mock data structure. In a real application, you'd fetch this from an API.
const mockCategories = [
  { id: 1, name: "Electronics", description: "Electronic devices and accessories", parent_category_id: null },
  { id: 2, name: "Books", description: "Physical and digital books", parent_category_id: null },
  { id: 3, name: "Clothing", description: "Apparel and accessories", parent_category_id: null },
  { id: 4, name: "Smartphones", description: "Mobile phones and accessories", parent_category_id: 1 },
  { id: 5, name: "Laptops", description: "Portable computers", parent_category_id: 1 },
]

export default function CategoryList() {
  const [categories, setCategories] = useState(mockCategories)
  const [sortConfig, setSortConfig] = useState(null)

  const sortCategories = (key) => {
    let direction = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })

    setCategories(
      [...categories].sort((a, b) => {
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

  const getParentCategoryName = (parentId) => {
    if (parentId === null) return "None"
    const parentCategory = categories.find((cat) => cat.id === parentId)
    return parentCategory ? parentCategory.name : "Unknown"
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Existing Categories</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => sortCategories("name")}>
                Name <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{getParentCategoryName(category.parent_category_id)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(category.id.toString())}>
                      Copy category ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Edit category</DropdownMenuItem>
                    <DropdownMenuItem>Delete category</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
const mockTags = [
  { id: 1, name: "New Arrival", description: "Products that have just been added to our inventory", isActive: true },
  { id: 2, name: "Best Seller", description: "Top selling products", isActive: true },
  { id: 3, name: "Sale", description: "Products currently on sale", isActive: true },
  { id: 4, name: "Clearance", description: "Products being cleared from inventory", isActive: false },
  { id: 5, name: "Limited Edition", description: "Products with limited availability", isActive: true },
]

export default function TagList() {
  const [tags, setTags] = useState(mockTags)
  const [sortConfig, setSortConfig] = useState(null)

  const sortTags = (key) => {
    let direction= "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })

    setTags(
      [...tags].sort((a, b) => {
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

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Existing Tags</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => sortTags("name")}>
                Name <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell className="font-medium">{tag.id}</TableCell>
              <TableCell>{tag.name}</TableCell>
              <TableCell>{tag.description}</TableCell>
              <TableCell>
                <Badge variant={tag.isActive ? "success" : "secondary"}>{tag.isActive ? "Active" : "Inactive"}</Badge>
              </TableCell>
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
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(tag.id.toString())}>
                      Copy tag ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Edit tag</DropdownMenuItem>
                    <DropdownMenuItem>Delete tag</DropdownMenuItem>
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


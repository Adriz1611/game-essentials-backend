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

// Mock data for discounts
const mockDiscounts = [
  {
    id: 1,
    name: "Summer Sale",
    description: "20% off on summer collection",
    discountType: "percentage",
    discountValue: 20,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    isActive: true,
    products: [
      { id: 1, name: "T-shirt", originalPrice: 29.99 },
      { id: 2, name: "Shorts", originalPrice: 39.99 },
    ],
  },
  {
    id: 2,
    name: "Clearance",
    description: "$10 off on clearance items",
    discountType: "fixed",
    discountValue: 10,
    startDate: "2024-05-01",
    endDate: "2024-05-31",
    isActive: true,
    products: [
      { id: 3, name: "Sneakers", originalPrice: 79.99 },
      { id: 4, name: "Backpack", originalPrice: 49.99 },
    ],
  },
]

export default function DiscountList() {
  const [discounts, setDiscounts] = useState(mockDiscounts)
  const [sortConfig, setSortConfig] = useState(null)

  const sortDiscounts = (key) => {
    let direction = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })

    setDiscounts(
      [...discounts].sort((a, b) => {
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

  const formatPrice = (price) => `$${price.toFixed(2)}`

  const calculateDiscountedPrice = (originalPrice, discountType, discountValue) => {
    if (discountType === "percentage") {
      return originalPrice * (1 - discountValue / 100)
    } else {
      return Math.max(0, originalPrice - discountValue)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => sortDiscounts("name")}>
              Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Date Range</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Products</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {discounts.map((discount) => (
          <TableRow key={discount.id}>
            <TableCell className="font-medium">{discount.id}</TableCell>
            <TableCell>{discount.name}</TableCell>
            <TableCell>{discount.description}</TableCell>
            <TableCell>
              {discount.discountType === "percentage"
                ? `${discount.discountValue}%`
                : formatPrice(discount.discountValue)}
            </TableCell>
            <TableCell>{`${discount.startDate} - ${discount.endDate}`}</TableCell>
            <TableCell>
              <Badge variant={discount.isActive ? "success" : "secondary"}>
                {discount.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <ul>
                {discount.products.map((product) => (
                  <li key={product.id}>
                    {product.name}: {formatPrice(product.originalPrice)} →{" "}
                    {formatPrice(
                      calculateDiscountedPrice(
                        product.originalPrice,
                        discount.discountType,
                        discount.discountValue
                      )
                    )}
                  </li>
                ))}
              </ul>
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
                  <DropdownMenuItem
                    onClick={() =>
                      navigator.clipboard.writeText(discount.id.toString())
                    }
                  >
                    Copy discount ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View discount details</DropdownMenuItem>
                  <DropdownMenuItem>Edit discount</DropdownMenuItem>
                  <DropdownMenuItem>Delete discount</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


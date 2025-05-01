"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown, Pencil, Trash, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductList({ data }) {
  const [products, setProducts] = useState(data);
  const [sortConfig, setSortConfig] = useState(null);

  const sortProducts = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    setProducts(
      [...products].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === "asc" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      })
    );
  };

  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Sl No</TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => sortProducts("name")}>
              Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => sortProducts("price")}>
              Price <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => sortProducts("category")}>
              Category <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{`${product.price} ${product.currency}`}</TableCell>
            <TableCell>
              {product.categories?.name == null
                ? "No Category"
                : product.categories?.name}
            </TableCell>
            <TableCell>{product.stock_quantity}</TableCell>
            <TableCell>
              <Badge variant={product.is_active ? "success" : "destructive"}>
                {product.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={product.is_digital ? "secondary" : "default"}>
                {product.is_digital ? "Digital" : "Physical"}
              </Badge>
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
                    className="cursor-pointer"
                    onClick={() =>
                      navigator.clipboard.writeText(product.id.toString())
                    }
                  >
                    {" "}
                    <Copy />
                    Copy product ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link href={"/dashboard/products/" + product.id.toString()}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Pencil /> Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="cursor-pointer">
                    <Trash /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

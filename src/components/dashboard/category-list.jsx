"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown, Pencil, Trash, Copy } from "lucide-react";
import Link from "next/link";
import { deleteCategory } from "@/app/actions/product-action";

export default function CategoryList({ data }) {
  const [categories, setCategories] = useState(data);
  const [sortConfig, setSortConfig] = useState(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const sortCategories = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    setCategories(
      [...categories].sort((a, b) => {
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

  const handleDelete = (id) => {
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast({
          title: "Cannot delete category",
          description:
            "This category is linked to other records. Please remove child categories or products first.",
        });
      }
    });
  };

  const getParentCategoryName = (parentId) => {
    if (parentId === null) return "None";
    const parentCategory = categories.find((cat) => cat.id === parentId);
    return parentCategory ? parentCategory.name : "Unknown";
  };

  return (
    <div>
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
          {categories.map((category, index) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{getParentCategoryName(category.parent_id)}</TableCell>
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
                        navigator.clipboard.writeText(category.id.toString())
                      }
                    >
                      {" "}
                      <Copy />
                      Copy category ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Link
                      href={"/dashboard/categories/" + category.id.toString()}
                    >
                      <DropdownMenuItem className="cursor-pointer">
                        <Pencil /> Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

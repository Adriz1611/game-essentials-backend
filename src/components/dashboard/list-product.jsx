"use client";

import { useState, useTransition, useMemo, useRef } from "react";
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
import Link from "next/link";
import {
  deleteProduct,
  linkProductTag,
  deleteTaggedProduct,
} from "@/app/actions/product-action";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductList({ data, tagsData = [], productTags = [] }) {
  const [products, setProducts] = useState(data);
  const [availableTags] = useState(tagsData);
  const initialMap = useMemo(() => {
    const map = {};
    productTags.forEach(({ product_id, tags_id }) => {
      if (!map[product_id]) map[product_id] = [];
      map[product_id].push(tags_id);
    });
    return map;
  }, [productTags]);
  const initialTagsMapRef = useRef(initialMap);
  const [selectedTagsMap, setSelectedTagsMap] = useState(initialMap);
  const [sortConfig, setSortConfig] = useState(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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

  const handleDelete = (id) => {
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    });
  };

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
              <div className="flex items-center justify-end space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      {availableTags.map((tag) => (
                        <div key={tag.id} className="flex items-center">
                          <Checkbox
                            checked={
                              selectedTagsMap[product.id]?.includes(tag.id) ||
                              false
                            }
                            onCheckedChange={(checked) =>
                              setSelectedTagsMap((prev) => ({
                                ...prev,
                                [product.id]: checked
                                  ? [...(prev[product.id] || []), tag.id]
                                  : (prev[product.id] || []).filter(
                                      (id) => id !== tag.id
                                    ),
                              }))
                            }
                            id={`${product.id}-tag-${tag.id}`}
                          />
                          <label
                            htmlFor={`${product.id}-tag-${tag.id}`}
                            className="ml-2"
                          >
                            {tag.name}
                          </label>
                        </div>
                      ))}
                      <Button
                        className="mt-2 w-full"
                        onClick={async () => {
                          const productId = product.id;
                          const prev =
                            initialTagsMapRef.current[productId] || [];
                          const curr = selectedTagsMap[productId] || [];
                          const toAdd = curr.filter((id) => !prev.includes(id));
                          const toRemove = prev.filter(
                            (id) => !curr.includes(id)
                          );
                          for (const tagId of toAdd) {
                            await linkProductTag({ tagId, productId });
                          }
                          for (const tagId of toRemove) {
                            await deleteTaggedProduct(productId, tagId);
                          }
                          initialTagsMapRef.current[productId] = [...curr];
                          toast({
                            title: "Tags updated",
                            description: "Product tags updated successfully.",
                          });
                        }}
                      >
                        Update Tags
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
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
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

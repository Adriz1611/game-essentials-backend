"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  searchProductByName,
  removeProductFromDiscount,
  addProductToDiscount,
} from "@/app/actions/product-action";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export default function DiscountProductManager({
  discountId,
  discountValue,
  discountType,
  initialProducts,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const calculateDiscountedPrice = (originalPrice) => {
    if (discountType === "percentage") {
      return originalPrice * (1 - discountValue / 100);
    } else {
      return Math.max(0, originalPrice - discountValue);
    }
  };

  const [selectedProducts, setSelectedProducts] = useState(
    initialProducts.map((product) => ({
      ...product,
      discountedPrice: calculateDiscountedPrice(product.price),
    }))
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      const results = await searchProductByName(searchQuery);
      console.log(results.data);
      setSearchResults(results.data);
    });
  };

  const addProductToTable = async (product) => {
    const newProduct = await addProductToDiscount(discountId, product.id);

    console.log(newProduct.data?.[0]);

    const productWithDiscount = {
      ...newProduct.data?.[0],
      discountedPrice: calculateDiscountedPrice(newProduct.data?.[0].price),
    };
    setSelectedProducts((prev) => [...prev, productWithDiscount]);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleProductSelection = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await removeProductFromDiscount(discountId, productId.toString());
      setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Failed to remove product:", error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          removeProductFromDiscount(discountId, id.toString())
        )
      );
      setSelectedProducts((prev) =>
        prev.filter((p) => !selectedIds.includes(p.id))
      );
      setSelectedIds([]);
    } catch (error) {
      console.error("Failed to remove selected products:", error);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>

      {searchResults.length > 0 && (
        <ul className="mt-2 border rounded-md divide-y">
          {searchResults.map((product) => (
            <li
              key={product.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => addProductToTable(product)}
            >
              {product.name} - ${product.price.toFixed(2)}
            </li>
          ))}
        </ul>
      )}

      {selectedIds.length > 0 && (
        <Button onClick={handleDeleteSelected} variant="destructive">
          Delete Selected Products
        </Button>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Original Price</TableHead>
            <TableHead>Discounted Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(product.id)}
                  onCheckedChange={() => handleProductSelection(product.id)}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>${product.discountedPrice?.toFixed(2)}</TableCell>
              <TableCell>{product.categories?.name}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isPending && <div className="text-center">Loading...</div>}
    </div>
  );
}

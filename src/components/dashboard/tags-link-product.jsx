"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import {
  deleteTaggedProduct,
  linkProductTag,
  searchProductByName,
} from "@/app/actions/product-action";

const formSchema = z.object({
  search: z.string().min(1, "Product name is required"),
});

export default function TagProductAssociation({
  tagId,
  tagName,
  taggedProductsData,
}) {
  const [taggedProducts, setTaggedProducts] = useState([]);
  useEffect(() => {
    if (taggedProductsData?.length) {
      setTaggedProducts(taggedProductsData);
    }
  }, [taggedProductsData]);

  const [searchResults, setSearchResults] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  const onSubmit = async (values) => {
    const res = await searchProductByName(values.search.toLowerCase());
    if (res.success) {
      setSearchResults(res.data);
    } else {
      console.error(res.error);
      setSearchResults([]);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const addProductsToTag = async () => {
    for (const productId of selectedProducts) {
      const res = await linkProductTag({ tagId, productId });
      if (res.success) {
        const product = searchResults.find((p) => p.id === productId);
        if (product) {
          setTaggedProducts((prev) => [...prev, product]);
        }
      } else {
        console.error(`Failed to link product ${productId}:`, res.error);
      }
    }

    setSelectedProducts([]);
    setSearchResults([]);
    form.reset();
  };

  const removeProductFromTag = async (productId) => {
    const res = await deleteTaggedProduct(productId, tagId);
    if (res.success) {
      setTaggedProducts((prev) => prev.filter(product => product.id !== productId));
      alert("Product Tag deleted successfully");
    } else {
      alert("Error occured " + res.error?.message);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Associate Products with Tag: {tagName}</CardTitle>
        <CardDescription>
          Search for products and add them to this tag.
        </CardDescription>
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
                        onCheckedChange={() =>
                          toggleProductSelection(product.id)
                        }
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              className="mt-4"
              onClick={addProductsToTag}
              disabled={selectedProducts.length === 0}
            >
              Add Selected Products to {tagName}
            </Button>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Products Tagged with {tagName}
          </h3>
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taggedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeProductFromTag(product.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

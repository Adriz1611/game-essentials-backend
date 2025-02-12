"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Loader2 } from "lucide-react";
import { searchProductByName } from "@/app/actions/product-action";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  search: z.string().min(1, "Product name is required"),
});

export default function ProductSearch({ selectedProducts, onProductsChange }) {
  const [searchResults, setSearchResults] = useState([]);

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

  const addProduct = (product) => {
    if (!selectedProducts.some((p) => p.id === product.id)) {
      onProductsChange([...selectedProducts, product]);
    }
  };

  const removeProduct = (productId) => {
    onProductsChange(selectedProducts.filter((p) => p.id !== productId));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search and Add Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center space-x-2"
            >
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
            </form>
          </Form>
          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((product) => (
              <Badge key={product.id} variant="secondary">
                {product.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-4 w-4 p-0"
                  onClick={() => removeProduct(product.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <Card>
            <CardContent className="p-2">
              <ul className="max-h-40 overflow-auto">
                {searchResults
                  .filter(
                    (product) =>
                      !selectedProducts.some((p) => p.id === product.id)
                  )
                  .map((product) => (
                    <li
                      key={product.id}
                      className="px-2 py-1 hover:bg-accent cursor-pointer rounded-sm"
                      onClick={() => addProduct(product)}
                    >
                      {product.name}
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

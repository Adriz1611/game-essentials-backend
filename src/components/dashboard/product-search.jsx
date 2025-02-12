"use client"

import { useState, useRef, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Loader2 } from "lucide-react"
import {searchProductByName} from "@/app/actions/product-action";

function SearchButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
    </Button>
  )
}

export default function ProductSearch({ selectedProducts, onProductsChange }) {
  const [searchResults, setSearchResults] = useState([])
  const [isPending, startTransition] = useTransition()
  const formRef = useRef(null)

  const handleSearch = async (formData) => {
    startTransition(async () => {
      const results = await searchProductByName(formData.name);
      setSearchResults(results)
    })
  }

  const addProduct = (product) => {
    if (!selectedProducts.some((p) => p.id === product.id)) {
      onProductsChange([...selectedProducts, product])
    }
  }

  const removeProduct = (productId) => {
    onProductsChange(selectedProducts.filter((p) => p.id !== productId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search and Add Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <form
            ref={formRef}
            action={handleSearch}
            className="flex items-center space-x-2"
          >
            <Input name="name" placeholder="Search products..." />
            <SearchButton />
          </form>
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


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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, ArrowUpDown, Search } from "lucide-react";
import Link from "next/link";

export default function ShippingMethodList({ shipping_data }) {
  const [shippingMethods, setShippingMethods] = useState(shipping_data);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState(null);

  const sortMethods = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    setShippingMethods(
      [...shippingMethods].sort((a, b) => {
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

  const filteredMethods = shippingMethods.filter((method) => {
    const matchesSearch = method.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && method.is_active) ||
      (statusFilter === "inactive" && !method.is_active);
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount) => {
    return amount === 0 ? "Free" : `${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search shipping methods..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  onClick={() => sortMethods("name")}
                  className="flex items-center"
                >
                  Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => sortMethods("cost")}
                  className="flex items-center"
                >
                  Cost <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => sortMethods("estimatedDelivery")}
                  className="flex items-center"
                >
                  Estimated Delivery <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMethods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No shipping methods found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell className="pl-4">{method.name}</TableCell>
                  <TableCell>{formatCurrency(method.cost)}</TableCell>
                  <TableCell>{method.estimated_delivery_days}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={method.is_active ? "success" : "destructive"}
                      >
                        {method.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
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
                            navigator.clipboard.writeText(method.id.toString())
                          }
                        >
                          Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Link
                          href={`/dashboard/shipping/` + method.id.toString()}
                        >
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";



export default function CustomerList({ customers }) {
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const router = useRouter();

  const filteredCustomers =
    Array.isArray(customers) && customers.length > 0
      ? customers.filter((customer) => {
          const fullName =
            customer.first_name || customer.last_name
              ? `${customer.first_name || ""} ${
                  customer.last_name || ""
                }`.trim()
              : "Not set";

          const matchesFilter =
            fullName.toLowerCase().includes(filterText.toLowerCase()) ||
            customer.email.toLowerCase().includes(filterText.toLowerCase());

          const matchesStatus =
            statusFilter === "all" || !statusFilter
              ? true
              : customer.status === statusFilter;

          return matchesFilter && matchesStatus;
        })
      : [];

  console.log(customers);

  const toggleCustomer = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const toggleAll = () => {
    setSelectedCustomers(
      selectedCustomers.length === filteredCustomers.length
        ? []
        : filteredCustomers.map((c) => c.id)
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-500/50";
      case "suspended":
        return "bg-red-500/15 text-red-700 hover:bg-red-500/25 border-red-500/50";
      case "inactive":
        return "bg-gray-500/15 text-gray-700 hover:bg-gray-500/25 border-gray-500/50";
      case "invited":
        return "bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-500/50";
      default:
        return "bg-gray-500/15 text-gray-700 hover:bg-gray-500/25 border-gray-500/50";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Filter customers..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-[300px]"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="p-4 text-center">No Records</div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        selectedCustomers.length === filteredCustomers.length &&
                        filteredCustomers.length > 0
                      }
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={() => toggleCustomer(customer.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {customer.first_name || customer.last_name
                        ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
                        : "Not set"}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone ? customer.phone : "Not set"}</TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(customer.customer_status)}
                        variant="secondary"
                      >
                        {customer.customer_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit customer</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedCustomers.length} of {filteredCustomers.length} row(s)
              selected.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select defaultValue="10">
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page 1 of 1
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="h-8 w-8 p-0" disabled>
                  {"<"}
                </Button>
                <Button variant="outline" className="h-8 w-8 p-0" disabled>
                  {">"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

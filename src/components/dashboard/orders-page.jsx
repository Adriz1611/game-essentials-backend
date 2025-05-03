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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusUpdateModal } from "@/components/dashboard/status-update-modal";
import { MoreHorizontal, Search, Download, Eye, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrdersPage({ ordersData }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders based on search query and status filter
  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.user_id.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.payment_intent_id
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (orderId) => {
    router.push(`/dashboard/orders/${orderId}`);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleDownloadInvoice = (orderId) => {
    // In a real application, this would trigger an API call to generate and download the invoice
    alert(`Downloading invoice for order #${orderId}`);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: { variant: "outline", label: "Pending" },
      Paid: { variant: "secondary", label: "Paid" },
      Processing: { variant: "default", label: "Processing" },
      Shipped: { variant: "secondary", label: "Shipped" },
      "Out for Delivery": { variant: "secondary", label: "Out for Delivery" },
      Delivered: { variant: "success", label: "Delivered" },
      Canceled: { variant: "destructive", label: "Canceled" },
      Refunded: { variant: "destructive", label: "Refunded" },
    };

    const style = statusStyles[status] || { variant: "outline", label: status };

    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

const truncateAddress = (address) => {
    const {
        street_address1,
        street_address2,
        state_province,
        postal_code,
    } = address;

    const fullAddress = [
        street_address1,
        street_address2,
        state_province,
        postal_code,
    ]
        .filter(Boolean)
        .join(", ");

    return fullAddress.length > 30
        ? `${fullAddress.substring(0, 30)}...`
        : fullAddress;
};

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            Manage and track all customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by customer or payment ID..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Out for Delivery">
                    Out for Delivery
                  </SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Payment Intent ID
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created At
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Shipping Method
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Shipping Address
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>
                        {order.user_id.first_name +
                          " " +
                          order.user_id.last_name}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs">
                        {order.payment_intent_id}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {order.shipping_id.name}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {truncateAddress(order.shipping_address)}
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
                              onClick={() => handleViewOrder(order.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View order
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order)}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Update status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDownloadInvoice(order.id)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download invoice
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
        </CardContent>
      </Card>

      {selectedOrder && (
        <StatusUpdateModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          order={selectedOrder}
          onStatusUpdate={(newStatus) => {
            // In a real application, this would update the order status via an API call
            alert(`Order #${selectedOrder.id} status updated to ${newStatus}`);
            setIsStatusModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

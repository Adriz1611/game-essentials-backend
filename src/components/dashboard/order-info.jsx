"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { StatusUpdateModal } from "@/components/dashboard/status-update-modal";
import { useState } from "react";

export default function OrderDetailsPage({ order }) {
  const router = useRouter();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  if (!order) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <h2 className="text-xl font-semibold mb-2">Order not found</h2>
              <p className="text-muted-foreground mb-6">
                The order you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.push("/admin/orders")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const handleUpdateStatus = () => {
    setIsStatusModalOpen(true);
  };

  const handleDownloadInvoice = () => {
    // In a real application, this would trigger an API call to generate and download the invoice
    alert(`Downloading invoice for order #${orderId}`);
  };

  const calculateTotalAmountwithoutShipping = order.order_items.reduce(
    (total, item) => total + item.total_price,
    0
  );


  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/orders")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleUpdateStatus}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Update Status
            </Button>
            <Button variant="outline" onClick={handleDownloadInvoice}>
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <CardTitle>Order #{order.id}</CardTitle>
                <CardDescription>
                  Created on {formatDate(order.createdAt)}
                </CardDescription>
              </div>
              <div className="mt-2 sm:mt-0">{getStatusBadge(order.status)}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.order_items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.productName}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.unit_price)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.total_price)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      {formatCurrency(calculateTotalAmountwithoutShipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatCurrency(order.shipping_id.cost)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Customer Information
                  </h3>
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {order.user_id.first_name} {order.user_id.first_name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {order.user_id.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {order.user_id.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Shipping Address
                  </h3>
                  <div className="space-y-1">
                    {order.shipping_address.company_name && (
                      <p>{order.shipping_address.company_name}</p>
                    )}
                    <p>{order.shipping_address.street_address1}</p>
                    {order.shipping_address.street_address2 && (
                      <p>{order.shipping_address.street_address2}</p>
                    )}
                    <p>
                      {order.shipping_address.city},{" "}
                      {order.shipping_address.state}{" "}
                      {order.shipping_address.pincode}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Payment Information
                  </h3>
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium">Payment ID:</span>{" "}
                      <span className="font-mono text-xs">
                        {order.payment_intent_id}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span>{" "}
                      {order.status === "paid" || order.status === "delivered"
                        ? "Paid"
                        : "Pending"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Shipping Information
                  </h3>
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium">Shipping Method:</span>{" "}
                      {order.shipping_id.name}
                    </p>
                    <p>
                      <span className="font-medium">Tracking Number:</span>{" "}
                      {order.tracking_number || "Not available"}
                    </p>
                    <p>
                      <span className="font-medium">Estimated Delivery:</span>{" "}
                      {order.shipping_id.estimated_delivery_days ||
                        "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        order={order}
        onStatusUpdate={(newStatus) => {
          // In a real application, this would update the order status via an API call
          alert(`Order #${order.id} status updated to ${newStatus}`);
          setIsStatusModalOpen(false);
        }}
      />
    </div>
  );
}

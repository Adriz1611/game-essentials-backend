"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, ArrowUpDown, Search, Eye, MessageCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for selling product queries
const mockQueries = [
  {
    id: 1,
    selling_product_id: 101,
    product_name: "Vintage Camera",
    seller_name: "John Doe",
    initial_price: 299.99,
    negotiation_price: 250.0,
    status: "pending",
    remarks: "Customer is interested but wants a lower price",
    created_at: "2024-03-15T10:30:00Z",
    updated_at: "2024-03-15T10:30:00Z",
  },
  {
    id: 2,
    selling_product_id: 102,
    product_name: "Antique Watch",
    seller_name: "Jane Smith",
    initial_price: 599.99,
    negotiation_price: 550.0,
    status: "accepted",
    remarks: "Agreed on the negotiated price",
    created_at: "2024-03-14T14:20:00Z",
    updated_at: "2024-03-15T09:15:00Z",
  },
  {
    id: 3,
    selling_product_id: 103,
    product_name: "Collectible Coins Set",
    seller_name: "Robert Johnson",
    initial_price: 1299.99,
    negotiation_price: 1100.0,
    status: "negotiating",
    remarks: "Counter-offered at $1150",
    created_at: "2024-03-13T16:45:00Z",
    updated_at: "2024-03-14T11:30:00Z",
  },
  {
    id: 4,
    selling_product_id: 104,
    product_name: "Handmade Leather Bag",
    seller_name: "Emily Wilson",
    initial_price: 199.99,
    negotiation_price: 150.0,
    status: "rejected",
    remarks: "Price too low for handcrafted item",
    created_at: "2024-03-12T09:10:00Z",
    updated_at: "2024-03-12T14:25:00Z",
  },
  {
    id: 5,
    selling_product_id: 105,
    product_name: "Vintage Vinyl Records",
    seller_name: "Michael Brown",
    initial_price: 89.99,
    negotiation_price: 75.0,
    status: "completed",
    remarks: "Transaction completed at negotiated price",
    created_at: "2024-03-10T13:20:00Z",
    updated_at: "2024-03-11T16:40:00Z",
  },
]


export default function SellingQueriesList() {
  const [queries, setQueries] = useState(mockQueries)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState(null)
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isRespondOpen, setIsRespondOpen] = useState(false)
  const [responseRemarks, setResponseRemarks] = useState("")
  const [responseStatus, setResponseStatus] = useState("pending")
  const [responseNegotiationPrice, setResponseNegotiationPrice] = useState(0)

  const sortQueries = (key) => {
    let direction = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })

    setQueries(
      [...queries].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === "asc" ? -1 : 1
        }
        if (a[key] > b[key]) {
          return direction === "asc" ? 1 : -1
        }
        return 0
      }),
    )
  }

  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      query.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      query.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      query.selling_product_id.toString().includes(searchQuery)

    const matchesStatus = statusFilter === "all" || query.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        )
      case "negotiating":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Negotiating
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewDetails = (query) => {
    setSelectedQuery(query)
    setIsDetailsOpen(true)
  }

  const handleRespond = (query) => {
    setSelectedQuery(query)
    setResponseStatus(query.status)
    setResponseRemarks(query.remarks)
    setResponseNegotiationPrice(query.negotiation_price)
    setIsRespondOpen(true)
  }

  const submitResponse = () => {
    if (!selectedQuery) return

    const updatedQueries = queries.map((query) =>
      query.id === selectedQuery.id
        ? {
            ...query,
            status: responseStatus,
            remarks: responseRemarks,
            negotiation_price: responseNegotiationPrice,
            updated_at: new Date().toISOString(),
          }
        : query,
    )

    setQueries(updatedQueries)
    setIsRespondOpen(false)
    setResponseRemarks("")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by product, seller or ID..."
              className="pl-8 w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="negotiating">Negotiating</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => sortQueries("selling_product_id")} className="flex items-center">
                  Product ID <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortQueries("product_name")} className="flex items-center">
                  Product <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortQueries("initial_price")} className="flex items-center">
                  Initial Price <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortQueries("negotiation_price")} className="flex items-center">
                  Negotiation Price <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortQueries("status")} className="flex items-center">
                  Status <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQueries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No selling queries found.
                </TableCell>
              </TableRow>
            ) : (
              filteredQueries.map((query) => (
                <TableRow key={query.id}>
                  <TableCell className="font-medium">{query.selling_product_id}</TableCell>
                  <TableCell>{query.product_name}</TableCell>
                  <TableCell>{formatCurrency(query.initial_price)}</TableCell>
                  <TableCell>{formatCurrency(query.negotiation_price)}</TableCell>
                  <TableCell>{getStatusBadge(query.status)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{query.remarks}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(query)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRespond(query)}>
                        <MessageCircle className="h-4 w-4" />
                        <span className="sr-only">Respond</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(query)}>View details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRespond(query)}>Respond to query</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => window.open(`/admin/products/${query.selling_product_id}`, "_blank")}
                          >
                            View product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Query Details</DialogTitle>
            <DialogDescription>Detailed information about the selling product query.</DialogDescription>
          </DialogHeader>

          {selectedQuery && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product ID:</span>
                    <span className="font-medium">{selectedQuery.selling_product_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product Name:</span>
                    <span className="font-medium">{selectedQuery.product_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seller:</span>
                    <span className="font-medium">{selectedQuery.seller_name}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Price Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Initial Price:</span>
                    <span className="font-medium">{formatCurrency(selectedQuery.initial_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Negotiation Price:</span>
                    <span className="font-medium">{formatCurrency(selectedQuery.negotiation_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedQuery.initial_price - selectedQuery.negotiation_price)}(
                      {(
                        ((selectedQuery.initial_price - selectedQuery.negotiation_price) /
                          selectedQuery.initial_price) *
                        100
                      ).toFixed(2)}
                      %)
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Query Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{getStatusBadge(selectedQuery.status)}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-muted-foreground">Remarks:</span>
                    <p className="p-3 bg-muted rounded-md">{selectedQuery.remarks}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p>{formatDate(selectedQuery.created_at)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Updated:</span>
                      <p>{formatDate(selectedQuery.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsDetailsOpen(false)
                if (selectedQuery) handleRespond(selectedQuery)
              }}
            >
              Respond
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Respond Dialog */}
      <Dialog open={isRespondOpen} onOpenChange={setIsRespondOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Query</DialogTitle>
            <DialogDescription>Update the status and provide remarks for this query.</DialogDescription>
          </DialogHeader>

          {selectedQuery && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Product: {selectedQuery.product_name}</h4>
                <div className="flex justify-between">
                  <span>Initial Price: {formatCurrency(selectedQuery.initial_price)}</span>
                  <span>Negotiation Price: {formatCurrency(selectedQuery.negotiation_price)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Update Status</label>
                <Select value={responseStatus} onValueChange={(value) => setResponseStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accept Offer</SelectItem>
                    <SelectItem value="rejected">Reject Offer</SelectItem>
                    <SelectItem value="negotiating">Counter Offer</SelectItem>
                    <SelectItem value="completed">Mark as Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Negotiation Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-7"
                    value={responseNegotiationPrice}
                    onChange={(e) => setResponseNegotiationPrice(Number(e.target.value))}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {responseStatus === "negotiating"
                    ? "Enter your counter-offer price"
                    : "Adjust the final negotiated price"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Remarks</label>
                <Textarea
                  value={responseRemarks}
                  onChange={(e) => setResponseRemarks(e.target.value)}
                  placeholder="Enter your response or additional notes..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRespondOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitResponse}>Submit Response</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


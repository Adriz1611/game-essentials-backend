"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"


export function StatusUpdateModal({ isOpen, onClose, order, onStatusUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState(order.status)
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    onStatusUpdate(selectedStatus)
    setNotes("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>Change the status for order #{order.id}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Pending" id="pending" />
              <Label htmlFor="pending">Pending</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Paid" id="paid" />
              <Label htmlFor="paid">Paid</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Processing" id="processing" />
              <Label htmlFor="processing">Processing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Shipped" id="shipped" />
              <Label htmlFor="shipped">Shipped</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Out for Delivery" id="out-for-delivery" />
              <Label htmlFor="out-for-delivery">Out for Delivery</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Delivered" id="delivered" />
              <Label htmlFor="delivered">Delivered</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Canceled" id="canceled" />
              <Label htmlFor="canceled">Canceled</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Refunded" id="refunded" />
              <Label htmlFor="refunded">Refunded</Label>
            </div>
          </RadioGroup>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this status change"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update Status</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

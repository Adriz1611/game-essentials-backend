"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"



export default function CouponList({ coupons_data }) {
  const [coupons, setCoupons] = useState(coupons_data)

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount Value</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>User Usage</TableHead>
            <TableHead>Total Usage Limit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell>{coupon.code}</TableCell>
              <TableCell>{coupon.discountValue}</TableCell>
              <TableCell>{new Date(coupon.startDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(coupon.endDate).toLocaleDateString()}</TableCell>
              <TableCell>{coupon.userUsage ?? "Unlimited"}</TableCell>
              <TableCell>{coupon.totalUsageLimit ?? "Unlimited"}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


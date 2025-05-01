"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


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
              <TableCell>
                {coupon.discount_type == "percentage"
                  ? coupon.discount_value + "%"
                  : coupon.discount_value}
              </TableCell>
              <TableCell>
                {new Date(coupon.start_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(coupon.end_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{coupon.user_usage_limit ?? "Unlimited"}</TableCell>
              <TableCell>{coupon.total_usage_limit ?? "Unlimited"}</TableCell>
              <TableCell>
                <Badge variant={coupon.is_active ? "success" : "destructive"}>
                  {coupon.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
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
  );
}


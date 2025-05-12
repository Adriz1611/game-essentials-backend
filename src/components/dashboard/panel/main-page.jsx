"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/panel/overview-page"
import { MetricCard } from "@/components/dashboard/panel/metric-card";
import { DataTable } from "@/components/dashboard/panel/data-table";
import { topProductsColumns, topCustomersColumns, recentOrdersColumns } from "@/components/dashboard/panel/columns"
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, ShoppingBag, UserPlus } from "lucide-react"

export default function DashboardPage() {
  const [productType, setProductType] = useState("all")
  const [chartView, setChartView] = useState("orders")
  const [timeRange, setTimeRange] = useState("week")
  const [tableView, setTableView] = useState("products")

  // Mock data for metrics
  const metrics = {
    all: {
      totalCustomers: { value: "3,456", change: 12.5, trend: "up" },
      totalRevenue: { value: "$24,780.00", change: 8.2, trend: "up" },
      totalOrders: { value: "1,245", change: 5.3, trend: "up" },
      newCustomers: { value: "356", change: -2.5, trend: "down" },
    },
    digital: {
      totalCustomers: { value: "1,892", change: 15.2, trend: "up" },
      totalRevenue: { value: "$12,450.00", change: 10.5, trend: "up" },
      totalOrders: { value: "645", change: 7.8, trend: "up" },
      newCustomers: { value: "198", change: 3.2, trend: "up" },
    },
    physical: {
      totalCustomers: { value: "1,564", change: 9.8, trend: "up" },
      totalRevenue: { value: "$12,330.00", change: 5.9, trend: "up" },
      totalOrders: { value: "600", change: 2.7, trend: "up" },
      newCustomers: { value: "158", change: -8.3, trend: "down" },
    },
  }

  // Mock data for tables
  const topProducts = [
    { id: "1", name: "Wireless Earbuds Pro", category: "Electronics", price: "$129.99", orders: 245, stock: 120 },
    { id: "2", name: "Smart Watch Series 5", category: "Electronics", price: "$299.99", orders: 198, stock: 85 },
    { id: "3", name: "Premium Yoga Mat", category: "Fitness", price: "$59.99", orders: 187, stock: 210 },
    {
      id: "4",
      name: "Organic Green Tea (50 bags)",
      category: "Food & Beverage",
      price: "$18.99",
      orders: 156,
      stock: 320,
    },
    { id: "5", name: "Bluetooth Speaker", category: "Electronics", price: "$89.99", orders: 142, stock: 75 },
    { id: "6", name: "Stainless Steel Water Bottle", category: "Lifestyle", price: "$24.99", orders: 138, stock: 230 },
    { id: "7", name: "Leather Wallet", category: "Accessories", price: "$49.99", orders: 125, stock: 180 },
    { id: "8", name: "Fitness Tracker Band", category: "Electronics", price: "$79.99", orders: 119, stock: 95 },
    { id: "9", name: "Portable Power Bank", category: "Electronics", price: "$45.99", orders: 112, stock: 150 },
    { id: "10", name: "Wireless Charging Pad", category: "Electronics", price: "$29.99", orders: 108, stock: 200 },
  ]

  const topCustomers = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      totalSpent: "$2,456.78",
      orderCount: 24,
      lastOrder: "2023-04-15",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      totalSpent: "$1,987.45",
      orderCount: 18,
      lastOrder: "2023-04-12",
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "m.brown@example.com",
      totalSpent: "$1,876.23",
      orderCount: 16,
      lastOrder: "2023-04-10",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      totalSpent: "$1,654.89",
      orderCount: 15,
      lastOrder: "2023-04-08",
    },
    {
      id: "5",
      name: "Robert Wilson",
      email: "r.wilson@example.com",
      totalSpent: "$1,543.67",
      orderCount: 14,
      lastOrder: "2023-04-05",
    },
    {
      id: "6",
      name: "Jennifer Taylor",
      email: "j.taylor@example.com",
      totalSpent: "$1,432.56",
      orderCount: 13,
      lastOrder: "2023-04-03",
    },
    {
      id: "7",
      name: "David Martinez",
      email: "d.martinez@example.com",
      totalSpent: "$1,321.45",
      orderCount: 12,
      lastOrder: "2023-04-01",
    },
    {
      id: "8",
      name: "Lisa Anderson",
      email: "l.anderson@example.com",
      totalSpent: "$1,234.56",
      orderCount: 11,
      lastOrder: "2023-03-30",
    },
    {
      id: "9",
      name: "James Thomas",
      email: "j.thomas@example.com",
      totalSpent: "$1,123.45",
      orderCount: 10,
      lastOrder: "2023-03-28",
    },
    {
      id: "10",
      name: "Patricia Garcia",
      email: "p.garcia@example.com",
      totalSpent: "$1,098.76",
      orderCount: 9,
      lastOrder: "2023-03-25",
    },
  ]

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Smith",
      product: "Wireless Earbuds Pro",
      amount: "$129.99",
      status: "Delivered",
      date: "2023-04-15",
    },
    {
      id: "ORD-002",
      customer: "Sarah Johnson",
      product: "Smart Watch Series 5",
      amount: "$299.99",
      status: "Processing",
      date: "2023-04-14",
    },
    {
      id: "ORD-003",
      customer: "Michael Brown",
      product: "Premium Yoga Mat",
      amount: "$59.99",
      status: "Shipped",
      date: "2023-04-13",
    },
    {
      id: "ORD-004",
      customer: "Emily Davis",
      product: "Organic Green Tea",
      amount: "$18.99",
      status: "Delivered",
      date: "2023-04-12",
    },
    {
      id: "ORD-005",
      customer: "Robert Wilson",
      product: "Bluetooth Speaker",
      amount: "$89.99",
      status: "Processing",
      date: "2023-04-11",
    },
    {
      id: "ORD-006",
      customer: "Jennifer Taylor",
      product: "Water Bottle",
      amount: "$24.99",
      status: "Delivered",
      date: "2023-04-10",
    },
    {
      id: "ORD-007",
      customer: "David Martinez",
      product: "Leather Wallet",
      amount: "$49.99",
      status: "Shipped",
      date: "2023-04-09",
    },
    {
      id: "ORD-008",
      customer: "Lisa Anderson",
      product: "Fitness Tracker",
      amount: "$79.99",
      status: "Delivered",
      date: "2023-04-08",
    },
    {
      id: "ORD-009",
      customer: "James Thomas",
      product: "Power Bank",
      amount: "$45.99",
      status: "Processing",
      date: "2023-04-07",
    },
    {
      id: "ORD-010",
      customer: "Patricia Garcia",
      product: "Charging Pad",
      amount: "$29.99",
      status: "Shipped",
      date: "2023-04-06",
    },
  ]

  // Get current metrics based on selected product type
  const currentMetrics = metrics[productType]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Product Type Tabs */}
      <Tabs defaultValue="all" value={productType} onValueChange={setProductType}>
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="digital">Digital Products</TabsTrigger>
          <TabsTrigger value="physical">Physical Products</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Customers"
          value={currentMetrics.totalCustomers.value}
          description={
            currentMetrics.totalCustomers.trend === "up"
              ? `${currentMetrics.totalCustomers.change}% increase from last month`
              : `${Math.abs(currentMetrics.totalCustomers.change)}% decrease from last month`
          }
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          iconColor={currentMetrics.totalCustomers.trend === "up" ? "text-green-500" : "text-red-500"}
          trendIcon={
            currentMetrics.totalCustomers.trend === "up" ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )
          }
        />
        <MetricCard
          title="Total Revenue"
          value={currentMetrics.totalRevenue.value}
          description={
            currentMetrics.totalRevenue.trend === "up"
              ? `${currentMetrics.totalRevenue.change}% increase from last month`
              : `${Math.abs(currentMetrics.totalRevenue.change)}% decrease from last month`
          }
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          iconColor={currentMetrics.totalRevenue.trend === "up" ? "text-green-500" : "text-red-500"}
          trendIcon={
            currentMetrics.totalRevenue.trend === "up" ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )
          }
        />
        <MetricCard
          title="Total Orders"
          value={currentMetrics.totalOrders.value}
          description={
            currentMetrics.totalOrders.trend === "up"
              ? `${currentMetrics.totalOrders.change}% increase from last month`
              : `${Math.abs(currentMetrics.totalOrders.change)}% decrease from last month`
          }
          icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
          iconColor={currentMetrics.totalOrders.trend === "up" ? "text-green-500" : "text-red-500"}
          trendIcon={
            currentMetrics.totalOrders.trend === "up" ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )
          }
        />
        <MetricCard
          title="New Customers"
          value={currentMetrics.newCustomers.value}
          description={
            currentMetrics.newCustomers.trend === "up"
              ? `${currentMetrics.newCustomers.change}% increase from last month`
              : `${Math.abs(currentMetrics.newCustomers.change)}% decrease from last month`
          }
          icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
          iconColor={currentMetrics.newCustomers.trend === "up" ? "text-green-500" : "text-red-500"}
          trendIcon={
            currentMetrics.newCustomers.trend === "up" ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )
          }
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>
                {chartView === "orders" ? "Order history" : "Customer registration history"}
              </CardDescription>
            </div>
            <Tabs defaultValue="orders" value={chartView} onValueChange={setChartView}>
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="week" value={timeRange} onValueChange={setTimeRange}>
              <TabsList className="mb-4">
                <TabsTrigger value="week">1 Week</TabsTrigger>
                <TabsTrigger value="month">1 Month</TabsTrigger>
                <TabsTrigger value="sixMonths">6 Months</TabsTrigger>
                <TabsTrigger value="year">1 Year</TabsTrigger>
              </TabsList>
              <Overview chartType={chartView} timeRange={timeRange} />
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>
                {tableView === "products" && "Top Products"}
                {tableView === "customers" && "Top Customers"}
                {tableView === "orders" && "Recent Orders"}
              </CardTitle>
              <CardDescription>
                {tableView === "products" && "Products with the highest order volume"}
                {tableView === "customers" && "Customers with the highest order count"}
                {tableView === "orders" && "Most recent orders placed"}
              </CardDescription>
            </div>
            <Tabs defaultValue="products" value={tableView} onValueChange={setTableView}>
              <TabsList>
                <TabsTrigger value="products">Top Products</TabsTrigger>
                <TabsTrigger value="customers">Top Customers</TabsTrigger>
                <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {tableView === "products" && <DataTable columns={topProductsColumns} data={topProducts} />}
            {tableView === "customers" && <DataTable columns={topCustomersColumns} data={topCustomers} />}
            {tableView === "orders" && <DataTable columns={recentOrdersColumns} data={recentOrders} />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

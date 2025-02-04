"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, Users, Layers2, ShoppingCart, TagIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Products", href: "/dashboard/products", icon: Package },
  { title: "Categories", href: "/dashboard/categories", icon: Layers2 },
  { title: "Tags", href: "/dashboard/tags", icon: TagIcon },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { title: "Customers", href: "/dashboard/customers", icon: Users },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function SidebarLayout({ children }) {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="p-4">
          <SidebarHeader>
            <h2 className="text-xl font-bold ">Admin Panel</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <p className="text-xs text-gray-500 p-4">© 2024 Your Company</p>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center h-16 px-4 border-b bg-white">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold ml-4">Admin Dashboard</h1>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

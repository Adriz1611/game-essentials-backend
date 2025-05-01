"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ChevronRight, ChevronDown,  Package, Percent, Settings, Users, Layers2, ShoppingCart, TagIcon, Truck, RefreshCw, LucideMessageCircleQuestion } from "lucide-react";

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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Products", href: "/dashboard/products", icon: Package },
  { title: "Categories", href: "/dashboard/categories", icon: Layers2 },
  { title: "Tags", href: "/dashboard/tags", icon: TagIcon },
  { title: "Shipping", href: "/dashboard/shipping", icon: Truck },

  { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { title: "Customers", href: "/dashboard/customers", icon: Users },
  {
    title: "Selling",
    href: "#",
    icon: RefreshCw,
    submenu: [
      {
        title: "Selling Products",
        href: "/dashboard/sellings/products",
        icon: Package,
      },
      {
        title: "Selling Queries",
        href: "/dashboard/sellings/queries",
        icon: LucideMessageCircleQuestion,
      },
    ],
  },
  {
    title: "Promotions",
    href: "#",
    icon: Percent,
    submenu: [
      {
        title: "Discounts",
        href: "/dashboard/promotions/discounts",
        icon: TagIcon,
      },
      {
        title: "Coupon Codes",
        href: "/dashboard/promotions/coupons",
        icon: TagIcon,
      },
    ],
  },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function SidebarLayout({ children }) {
  const pathname = usePathname();
    const [openSubmenu, setOpenSubmenu] = useState(null);

    const toggleSubmenu = (title) => {
      setOpenSubmenu(openSubmenu === title ? null : title);
    };
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="p-4">
          <SidebarHeader>
            <h2 className="text-xl font-bold ">Admin Panel</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <>
                      <SidebarMenuButton
                        onClick={() => toggleSubmenu(item.title)}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        {openSubmenu === item.title ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </SidebarMenuButton>
                      {openSubmenu === item.title && (
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.href}
                              >
                                <Link href={subItem.href}>
                                  <subItem.icon className="mr-2 h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <p className="text-xs text-gray-500 p-4">© 2024 Your Company</p>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center h-16 px-4 border-b ">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold ml-4">Admin Dashboard</h1>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto  p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

"use client"
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";

export default function SettingsLayout({ children }) {
  const pathname = usePathname();
  const currentTab = pathname.split("/").pop() || "main";

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Store Front Settings</h1>
      <Tabs value={currentTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="main" asChild>
            <Link href="/dashboard/settings/main">Main Site</Link>
          </TabsTrigger>
          <TabsTrigger value="digital" asChild>
            <Link href="/dashboard/settings/digital">Digital Site</Link>
          </TabsTrigger>
          <TabsTrigger value="selling" asChild>
            <Link href="/dashboard/settings/selling">Selling Site</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </div>
  );
}

import SidebarLayout from "@/components/layout/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <main className="font-paragraph">
      <SidebarLayout>{children}</SidebarLayout>
    </main>
  );
}

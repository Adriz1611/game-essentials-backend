import SidebarLayout from "@/components/layout/sidebar"


export default function DashboardLayout({ children }) {
 return (
     <SidebarLayout>
        {children}
     </SidebarLayout>
 )
}
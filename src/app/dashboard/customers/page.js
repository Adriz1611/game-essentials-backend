import CustomerList from "@/components/dashboard/customer-list";
import { createClient } from "@/utils/supabase/server";

export default async function CustomersPage() {
  const data = await fetchCustomer();
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Customer List</h1>
        <p className="text-muted-foreground">
          Manage your customers and their information here.
        </p>
      </div>
      <CustomerList customers={data} />
    </div>
  );
}

async function fetchCustomer() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("customers").select("*");
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}

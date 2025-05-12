import DashboardPage from "@/components/dashboard/panel/main-page";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const topCustomer = await fetchTopCustomers();
  console.log(topCustomer[0]);
  return (
    <div className="">
      <DashboardPage />
    </div>
  );
}

async function fetchTopCustomers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("first_name, last_name, email, orders(count)");

  if (error) {
    console.error("Error fetching top customers:", error);
    return [];
  }
  return data; // Return the top customer data
}

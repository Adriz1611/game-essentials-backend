import CustomerList from "@/components/dashboard/customer-list";

export default function CustomersPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Customer List</h1>
        <p className="text-muted-foreground">
          Manage your customers and their information here.
        </p>
      </div>
      <CustomerList />
    </div>
  );
}

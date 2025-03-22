import SellingQueriesList from "@/components/dashboard/selling-queries-list";

export default function SellingQueriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Selling Product Queries</h2>
        <p className="text-muted-foreground">
          Manage and respond to customer price negotiation requests.
        </p>
      </div>
      <SellingQueriesList />
    </div>
  );
}

import StorefrontSettings from "@/components/dashboard/setting-form";


export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Storefront Settings</h1>
        <p className="text-muted-foreground">
          Manage your storefront appearance and configuration.
        </p>
      </div>
      <StorefrontSettings />
    </div>
  );
}

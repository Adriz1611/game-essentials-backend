import TagList from "@/components/pages/tag-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function TagsPage() {
  return (
    <div className="space-y-6">
      <div className="w-full flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-4">Manage Products Tags</h2>
        <div className="flex flex-row gap-5">
          <Link href={`/dashboard/tags/add`}>
            <Button variant="outline">Create tags</Button>
          </Link>
          <Link href={`/dashboard/tags/link`}>
            <Button >Link Products</Button>
          </Link>
        </div>
      </div>
      <TagList />
    </div>
  );
}

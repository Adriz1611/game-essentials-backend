import TagList from "@/components/dashboard/tag-list";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
export default async function TagsPage() {
  const data = await fetchTags();
  return (
    <div className="space-y-6">
      <div className="w-full flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-4">Manage Products Tags</h2>
        <div className="flex flex-row gap-5">
          <Link href={`/dashboard/tags/add`}>
            <Button >Create tags</Button>
          </Link>
        </div>
      </div>
      <TagList tags_data={data} />
    </div>
  );
}

async function fetchTags() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select("*");
  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return data;
}

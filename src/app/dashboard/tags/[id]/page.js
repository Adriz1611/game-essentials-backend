import TagForm from "@/components/dashboard/tags-form";
import { createClient } from "@/utils/supabase/server";

export default async function TagsPage({ params }) {
  const { id } = await params;
  const data = await fetchTag(id);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Manage Product Tags</h2>
      <TagForm tags_data={data[0]} />
    </div>
  );
}

async function fetchTag(id) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select().eq("id", id);
  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
  return data;
}

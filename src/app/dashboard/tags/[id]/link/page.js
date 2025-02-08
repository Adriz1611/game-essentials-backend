import TagProductAssociation from "@/components/pages/tags-link-product";
import { createClient } from "@/utils/supabase/server";

export default async function TagsLinkPage({ params }) {
  const { id } = await params;
  const data = await fetchTag(id);
  return (
    <div className="space-y-6">
      <TagProductAssociation />
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

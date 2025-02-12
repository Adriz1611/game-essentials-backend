import TagProductAssociation from "@/components/dashboard/tags-link-product";
import { createClient } from "@/utils/supabase/server";

export default async function TagsLinkPage({ params }) {
  const { id } = await params;
  const data = await fetchTag(id);
  const dataProducts = await fetchTagwithProducts(id);
  return (
    <div className="space-y-6">
      <TagProductAssociation
        taggedProductsData={dataProducts}
        tagId={data[0].id}
        tagName={data[0].name}
      />
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

async function fetchTagwithProducts(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_tags")
    .select(
      `
      products (
        id,
        name
      )
    `
    )
    .eq("tags_id", id);

  if (error) {
    console.error("Error fetching products for tag:", error);
    return [];
  }

  return data.map((item) => item.products);
}

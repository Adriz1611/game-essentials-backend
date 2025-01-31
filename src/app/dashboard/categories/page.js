import CategoryList from "@/components/pages/category-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CategoriesPage() {
  return (
    <div className="w-full">
         <div className="w-full flex flex-row justify-between">
             <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
             <Link href={`/dashboard/categories/add`}>
             <Button>Add Category</Button>
             </Link>
         </div>
          <CategoryList />
    </div>
  )
}

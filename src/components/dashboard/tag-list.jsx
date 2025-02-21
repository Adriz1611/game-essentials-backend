"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  ArrowUpDown,
  Copy,
  Trash,
  Pencil,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { getStatusColors } from "@/utils";
import { cn } from "@/lib/utils";

export default function TagList({ tags_data }) {
  const [tags, setTags] = useState(tags_data);
  const [sortConfig, setSortConfig] = useState(null);

  const sortTags = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    setTags(
      [...tags].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === "asc" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      })
    );
  };

  return (
    <div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sl No</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => sortTags("name")}>
                Name <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.map((tag, index) => (
            <TableRow key={tag.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{tag.name}</TableCell>
              <TableCell>{tag.description}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    getStatusColors(tag.is_active ? "Active" : "Inactive")
                  )}
                >
                  {tag.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() =>
                        navigator.clipboard.writeText(tag.id.toString())
                      }
                    >
                      <Copy /> Copy tag ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Link
                      href={`/dashboard/tags/` + tag.id.toString() + "/link"}
                    >
                      <DropdownMenuItem className="cursor-pointer">
                        <LinkIcon /> Link Products
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/dashboard/tags/` + tag.id.toString()}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Pencil /> Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="cursor-pointer ">
                      <Trash /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ReactNode } from "react";

interface SearchAndFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterContent?: ReactNode;
}

export function SearchAndFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterContent,
}: SearchAndFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          className="pl-8 w-full sm:w-[250px]"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {filterContent && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {filterContent}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function ItemsFilter({
  selectedCategory,
}: {
  selectedCategory?: string;
}) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    // Initialize params once searchParams is available
    if (searchParams) {
      setParams(new URLSearchParams(searchParams.toString()));
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    }

    fetchCategories();
  }, []);

  const handleCategorySelect = (category: string) => {
    if (!params) return;

    if (category === selectedCategory) {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const clearFilters = () => {
    if (!params) return;

    params.delete("category");
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  if (!params) {
    return <div>Loading filters...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Filters</h3>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedCategory || "Select category"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search category..." />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {categories.map((category) => (
                    <CommandItem
                      key={category}
                      value={category}
                      onSelect={() => handleCategorySelect(category)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCategory === category
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {category}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedCategory && (
        <Button variant="ghost" onClick={clearFilters} className="w-full">
          Clear filters
        </Button>
      )}
    </div>
  );
}

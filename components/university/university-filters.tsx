"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ETHIOPIAN_REGIONS } from "@/lib/utils";
import { Search } from "lucide-react";

export function UniversityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/universities?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="grid gap-4 rounded-lg border bg-card p-4 md:grid-cols-4">
      <div className="relative md:col-span-2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search universities..."
          className="pl-9"
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => {
            const value = e.target.value;
            const timeout = setTimeout(() => updateFilter("search", value), 300);
            return () => clearTimeout(timeout);
          }}
        />
      </div>
      <div>
        <Label className="sr-only">Region</Label>
        <Select
          defaultValue={searchParams.get("region") || ""}
          onValueChange={(v) => updateFilter("region", v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {ETHIOPIAN_REGIONS.map((region) => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="sr-only">Type</Label>
        <Select
          defaultValue={searchParams.get("type") || ""}
          onValueChange={(v) => updateFilter("type", v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="PUBLIC">Public</SelectItem>
            <SelectItem value="PRIVATE">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

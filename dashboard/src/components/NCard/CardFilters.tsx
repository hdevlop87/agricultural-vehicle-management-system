"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCardContext } from "./CardContext";

export function TextFilter({ name, placeholder }) {
  const { table } = useCardContext();
  const column = table.getColumn(name);

  if (!column) return null;

  return (
    <Input
      value={(column.getFilterValue() as string) ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export function SelectFilter({ name, options, placeholder }) {
  const { table } = useCardContext();
  const column = table.getColumn(name);

  if (!column) return null;

  const effectivePlaceholder = placeholder || "All";

  // Handle both string arrays and object arrays for backward compatibility
  const normalizedOptions = options.map((option) => {
    if (typeof option === 'string') {
      return { value: option, label: option };
    }
    return option; // Assume it's already an object with value and label
  });

  return (
    <Select
      value={(column.getFilterValue() as string) ?? ""}
      onValueChange={(value) => {
        if (value === "all" || value === "") {
          column.setFilterValue(undefined);
        } else {
          column.setFilterValue(value);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={effectivePlaceholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {normalizedOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CardFilters() {
  const { table, filters } = useCardContext();

  if (!filters || filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {filters.map((filter) => {
        const column = table.getColumn(filter.name);
        if (!column) return null;

        return (
          <div key={filter.name} className={`flex flex-col w-62 ${filter.className || ''}`}>
            {filter.type === "text" ? (
              <TextFilter
                name={filter.name}
                placeholder={filter.placeholder}
              />
            ) : (
              <SelectFilter
                name={filter.name}
                options={filter.options || []}
                placeholder={filter.placeholder}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
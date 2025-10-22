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
import { useTableContext } from "./TableContext";

export function TextFilter({ name, placeholder }) {
  const { table } = useTableContext();
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
  const { table } = useTableContext();
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
      <SelectTrigger className="w-full">
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

export function TableFilters() {
  const { table, filters, showColumnVisibility, showAddButton, showViewToggle } = useTableContext();

  if (!filters || filters.length === 0) {
    return null;
  }

  // Check if any controls should be shown
  const hasControls = showColumnVisibility || showAddButton || showViewToggle;

  return (
    <div className={`flex flex-wrap gap-4 ${hasControls ? 'w-full' : 'w-full'}`}>
      {filters.map((filter) => {
        const column = table.getColumn(filter.name);
        if (!column) return null;

        // Use full width for single filter when no controls, otherwise use configured width
        const defaultWidth = !hasControls && filters.length === 1 ? 'w-full' : 'w-full lg:w-62';

        return (
          <div key={filter.name} className={`flex flex-col ${filter.className || defaultWidth}`}>
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
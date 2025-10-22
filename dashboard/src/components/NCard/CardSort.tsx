"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useCardContext } from "./CardContext";

export function CardSort() {
  const { table, showSorting, columns } = useCardContext();

  if (!showSorting) return null;

  const sorting = table.getState().sorting;
  const currentSort = sorting[0];

  const sortableColumns = columns.filter(column => 
    column.accessorKey && column.header && column.enableSorting !== false
  );

  if (sortableColumns.length === 0) return null;

  const handleSortChange = (value: string) => {
    if (value === "none") {
      table.resetSorting();
      return;
    }

    const [columnId, direction] = value.split("-");
    table.setSorting([{ id: columnId, desc: direction === "desc" }]);
  };

  const currentSortValue = currentSort 
    ? `${currentSort.id}-${currentSort.desc ? "desc" : "asc"}` 
    : "none";

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={currentSortValue} onValueChange={handleSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No sorting</SelectItem>
          {sortableColumns.map((column) => (
            <React.Fragment key={column.accessorKey}>
              <SelectItem value={`${column.accessorKey}-asc`}>
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-3 w-3" />
                  {column.header} (A-Z)
                </div>
              </SelectItem>
              <SelectItem value={`${column.accessorKey}-desc`}>
                <div className="flex items-center gap-2">
                  <ArrowDown className="h-3 w-3" />
                  {column.header} (Z-A)
                </div>
              </SelectItem>
            </React.Fragment>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
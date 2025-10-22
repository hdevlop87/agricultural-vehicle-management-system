import React from 'react';
import { useCardContext } from './CardContext';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { DefaultCard } from './DefaultCard';

const CardContent = () => {
  const { 
    table, 
    isLoading, 
    noResultsText, 
    cardColumns, 
    cardRenderer,
    onRowClick,
    onView,
    onEdit,
    onDelete
  } = useCardContext();

  if (isLoading) {
    return (
      <div className={cn(
        "grid gap-4",
        `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cardColumns}`
      )}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const rows = table.getRowModel().rows;

  if (!rows.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-muted-foreground text-lg font-medium">
          {noResultsText || "No results found."}
        </div>
        <div className="text-muted-foreground/70 text-sm mt-2">
          Try adjusting your search or filter criteria.
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-4",
      `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cardColumns}`
    )}>
      {rows.map((row) => {
        const CardComponent = cardRenderer || DefaultCard;
        
        return (
          <CardComponent
            key={row.id}
            data={row.original}
            onRowClick={onRowClick}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

export default CardContent;
"use client";

import React from 'react';
import { useTableContext } from './TableContext';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, MoreHorizontal, MoreVertical } from 'lucide-react';
import { Card } from '../ui/card';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TableCards = () => {
   const { table, noResultsText, onView, onEdit, onDelete, onRowClick, isLoading, CardComponent, viewMode } = useTableContext();

   const rows = table.getRowModel().rows;

   if (isLoading) {
      const loadingContainerClass = viewMode === 'list'
         ? "flex flex-col gap-3 p-4"
         : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";

      return (
         <div className={loadingContainerClass}>
            {Array.from({ length: 8 }).map((_, i) => (
               <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="space-y-2">
                     <div className="h-3 bg-gray-200 rounded"></div>
                     <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
               </div>
            ))}
         </div>
      );
   }

   if (!rows.length) {
      return (
         <div className="text-center py-8 text-gray-500">
            {noResultsText}
         </div>
      );
   }

   const renderCardActions = (row) => {
      if (!onView && !onEdit && !onDelete) return null;

      return (
         <div className="absolute top-2 right-2">
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <div onClick={(e) => e.stopPropagation()} className="flex h-8 w-8 p-0  rounded-full cursor-pointer justify-center items-center">
                     <MoreVertical className="h-5 w-5 " />
                  </div>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-40">
                  {onView && (
                     <DropdownMenuItem
                        onClick={(e) => {
                           e.stopPropagation();
                           onView(row.original);
                        }}
                        className="cursor-pointer"
                     >
                        <Eye className="h-4 w-4 mr-2 " />
                        View
                     </DropdownMenuItem>
                  )}

                  {onEdit && (
                     <DropdownMenuItem
                        onClick={(e) => {
                           e.stopPropagation();
                           onEdit(row.original);
                        }}
                        className="cursor-pointer"
                     >
                        <Edit className="h-4 w-4 mr-2 " />
                        Edit
                     </DropdownMenuItem>
                  )}

                  {onDelete && (
                     <DropdownMenuItem
                        onClick={(e) => {
                           e.stopPropagation();
                           onDelete(row.original);
                        }}
                        className="cursor-pointer text-red-500 "
                     >
                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                        Delete
                     </DropdownMenuItem>
                  )}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      );
   };

   if (!CardComponent) {
      return (
         <div className="text-center py-8 text-gray-500">
            No CardComponent provided. Please pass a CardComponent prop to NTable.
         </div>
      );
   }

   // Determine container class based on view mode
   const containerClass = viewMode === 'list'
      ? "flex flex-col gap-3 "
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";

   return (
      <div className={containerClass}>
         {rows.map((row) => (
            <Card
               key={row.id}
               onClick={() => onRowClick && onRowClick(row.original)}
               className={`
                          relative p-4 transition-all duration-200 hover:shadow-md
                        ${onRowClick ? 'cursor-pointer hover:border-primary/50' : ''}
                    `}
            >
               {renderCardActions(row)}
               <CardComponent data={row.original} row={row} />
            </Card>
         ))}
      </div>
   );
};

export default TableCards;
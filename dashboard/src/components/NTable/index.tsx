import React, { useState } from 'react'
import TableContent from './TableContent'
import { useTable } from './useTable';
import { TablePagination } from './TablePagination';
import { cn } from '@/lib/utils';
import TableHeader from './TableHeader';
import { TableProvider } from './TableContext';
import { addActionsColumn } from './TableActionHelper';
import TableCards from './TableCards';
import { useIsMobile } from '@/hooks/useSidebarResponsive';

const NTable = ({
   showPagination = true,
   showSorting = true,
   showColumnVisibility = false,
   showAddButton = true,
   data = [],
   columns,
   className = '',
   filters = {},
   noResultsText = "No results.",
   headerClassName = "bg-primary",
   onRowClick = null,
   onAddClick = null,
   onView = null,
   onEdit = null,
   onDelete = null,
   filterPlaceholder = '',
   pageSizeOptions = [10, 20, 30, 40, 50],
   isLoading = false,
   showViewToggle = true,
   viewMode: initialViewMode = 'table',
   CardComponent = null,
   addButtonText = '',
}) => {
   const isMobile = useIsMobile();
   
   // Auto-set cards mode on mobile, otherwise use initialViewMode
   const autoViewMode = isMobile && CardComponent ? 'cards' : initialViewMode;
   const [viewMode, setViewMode] = useState(autoViewMode);
   
   const hasActions = onView || onEdit || onDelete;
   const finalColumns = hasActions ? addActionsColumn(columns) : columns;
   const { table } = useTable({ data, columns: finalColumns });

   return (
      <TableProvider
         table={table}
         data={data}
         columns={finalColumns}
         filters={filters}
         showSorting={showSorting}
         showPagination={showPagination}
         showColumnVisibility={showColumnVisibility}
         showAddButton={showAddButton}
         onAddClick={onAddClick}
         onView={onView}
         onEdit={onEdit}
         onDelete={onDelete}
         className={className}
         noResultsText={noResultsText}
         headerClassName={headerClassName}
         onRowClick={onRowClick}
         filterPlaceholder={filterPlaceholder}
         pageSizeOptions={pageSizeOptions}
         isLoading={isLoading}
         showViewToggle={showViewToggle} 
         viewMode={viewMode}        
         setViewMode={setViewMode}
         CardComponent={CardComponent}
         addButtonText={addButtonText}
      >
            <TableHeader />
         <div className={cn("flex flex-col gap-4 w-full overflow-auto", className)}>
            {viewMode === 'table' ? <TableContent /> : <TableCards />}
         </div>
            <TablePagination />
      </TableProvider>
   );
};

export default NTable
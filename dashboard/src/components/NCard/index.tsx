import React from 'react'
import CardContent from './CardContent'
import { useDataView } from './useDataView';
import { CardPagination } from './CardPagination';
import { cn } from '@/lib/utils';
import CardHeader from './CardHeader';
import { CardProvider } from './CardContext';
import { addActionsColumn } from '../NTable/TableActionHelper';

interface NCardProps {
  showPagination?: boolean;
  showSorting?: boolean;
  showAddButton?: boolean;
  data?: any[];
  columns: any[];
  className?: string;
  filters?: any[];
  noResultsText?: string;
  onRowClick?: (data: any) => void;
  onAddClick?: () => void;
  onView?: (data: any) => void;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
  filterPlaceholder?: string;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  cardColumns?: number; // Number of columns in grid (1-6)
  cardRenderer?: React.ComponentType<{
    data: any;
    onRowClick?: (data: any) => void;
    onView?: (data: any) => void;
    onEdit?: (data: any) => void;
    onDelete?: (data: any) => void;
  }>;
}

const NCard: React.FC<NCardProps> = ({
  showPagination = true,
  showSorting = true,
  showAddButton = true,
  data = [],
  columns,
  className = '',
  filters = [],
  noResultsText = "No results.",
  onRowClick = null,
  onAddClick = null,
  onView = null,
  onEdit = null,
  onDelete = null,
  filterPlaceholder = '',
  pageSizeOptions = [12, 24, 36, 48],
  isLoading = false,
  cardColumns = 3,
  cardRenderer
}) => {
  const hasActions = onView || onEdit || onDelete;
  const finalColumns = hasActions ? addActionsColumn(columns) : columns;
  const { table } = useDataView({ data, columns: finalColumns });

  return (
    <CardProvider
      table={table}
      data={data}
      columns={finalColumns}
      filters={filters}
      showSorting={showSorting}
      showPagination={showPagination}
      showAddButton={showAddButton}
      onAddClick={onAddClick}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      className={className}
      noResultsText={noResultsText}
      onRowClick={onRowClick}
      filterPlaceholder={filterPlaceholder}
      pageSizeOptions={pageSizeOptions}
      isLoading={isLoading}
      cardColumns={cardColumns}
      cardRenderer={cardRenderer}
    >
      <div className={cn("flex flex-col gap-4 w-full", className)}>
        <CardHeader />
        <CardContent />
        <CardPagination />
      </div>
    </CardProvider>
  );
};

export default NCard;
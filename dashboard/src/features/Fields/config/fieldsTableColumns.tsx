'use client'
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/useSidebarResponsive';
import { format } from 'date-fns';

export const fieldsTableColumns = (t) => {

  const isMobile = useIsMobile();
  
  const allColumns = [
    {
      accessorKey: "select",
      id: "select",
      header: ({ table }) => (
        <div className="flex h-full items-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label={t('fields.table.selectAll')}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex h-full items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t('fields.table.selectRow')}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: t('fields.table.id'),
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({ getValue }) => (
        <div className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          #{getValue()}
        </div>
      ),
      size: isMobile ? 60 : 80,
    },
    {
      accessorKey: "name",
      header: t('fields.table.name'),
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({ getValue, row }) => {
        const name = getValue();
        const description = row.original.description;
        
        return (
          <div className="font-medium">
            <div className={isMobile ? 'text-sm' : ''}>
              {name || t('common.notAvailable')}
            </div>
            {/* Show description under name on mobile since description column is hidden */}
            {isMobile && description && (
              <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">
                {description}
              </div>
            )}
          </div>
        );
      },
      size: isMobile ? 150 : 200,
    },
    {
      accessorKey: "area",
      header: t('fields.table.area'),
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({ getValue }) => {
        const area = getValue();
        if (!area) return <span className="text-gray-400">{t('common.notAvailable')}</span>;
        
        return (
          <span className={isMobile ? 'text-xs' : 'text-sm'}>
            {parseFloat(area).toFixed(2)} {isMobile ? 'ha' : t('fields.units.hectares')}
          </span>
        );
      },
      size: isMobile ? 20 : 150,
    },
    {
      accessorKey: "location",
      header: t('fields.table.location'),
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ getValue }) => {
        const location = getValue();
        if (!location || !location.lat || !location.lng) {
          return <span className="text-gray-400">{t('common.notAvailable')}</span>;
        }
        
        return (
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
            {parseFloat(location.lat).toFixed(4)}, {parseFloat(location.lng).toFixed(4)}
          </div>
        );
      },
      size: isMobile ? 100 : 150,
    },
    {
      accessorKey: "description",
      header: t('fields.table.description'),
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ getValue }) => {
        const description = getValue();
        if (!description) return <span className="text-gray-400">{t('fields.table.noDescription')}</span>;
        
        return (
          <div className="text-sm w-72 max-w-72 truncate">
            {description}
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "createdAt",
      header: isMobile ? t('fields.table.created') : t('fields.table.createdDate'),
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({ getValue }) => {
        const date = getValue();
        if (!date) return <span className="text-gray-400">{t('common.notAvailable')}</span>;
        
        try {
          return (
            <div className={isMobile ? 'text-xs' : 'text-sm'}>
              {format(new Date(date), isMobile ? 'MM/dd/yy' : 'MMM dd, yyyy')}
            </div>
          );
        } catch (error) {
          return <span className="text-gray-400">{t('common.invalidDate')}</span>;
        }
      },
      size: isMobile ? 80 : 130,
    },
    {
      accessorKey: "updatedAt",
      header: isMobile ? t('fields.table.updated') : t('fields.table.lastUpdated'),
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({ getValue }) => {
        const date = getValue();
        if (!date) return <span className="text-gray-400">{t('common.notAvailable')}</span>;
        
        try {
          return (
            <div className={isMobile ? 'text-xs' : 'text-sm'}>
              {format(new Date(date), isMobile ? 'MM/dd/yy' : 'MMM dd, yyyy')}
            </div>
          );
        } catch (error) {
          return <span className="text-gray-400">{t('common.invalidDate')}</span>;
        }
      },
      size: isMobile ? 80 : 130,
    },
  ];

  if (isMobile) {
    return allColumns.filter(column => 
      !['id','select','description', 'updatedAt','createdAt'].includes(column.accessorKey)
    );
  }

  return allColumns;
};
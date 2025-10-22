'use client'

import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import StatusBadge from '@/components/NStatusBadge';
import { AvatarCell } from '@/components/NAvatarCell';

export const operationsTableColumns = (t) => [

  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('operations.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('operations.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id",
    header: t('operations.table.id'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm text-gray-500">
        #{getValue()}
      </div>
    ),
    size: 80,
  },

  {
    accessorKey: "operationType",
    header: t('operations.table.operationType'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="font-medium">
        {getValue() || t('common.notAvailable')}
      </div>
    ),
    size: 150,
  },

  {
    id: "vehicle",
    header: t('operations.table.vehicle'),
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const operation = row.original;
      const vehicleName = operation.vehicle?.name || operation.vehicleId;
      const vehicleModel = operation.vehicle?.model;
      const vehicleBrand = operation.vehicle?.brand;

      const displayText = vehicleBrand && vehicleModel
        ? `${vehicleName} (${vehicleBrand} ${vehicleModel})`
        : vehicleName;

      return (
        <div className="text-sm">
          {displayText || t('common.notAvailable')}
        </div>
      );
    },
    size: 120,
  },

  {
    id: "operator",
    header: t('operations.table.operatorName'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const operation = row.original;
      const operatorName = operation.operator?.name || operation.operatorId;
      const operatorImage = operation.operator?.image;

      return <AvatarCell src={operatorImage} name={operatorName} />;
    },
  },

  {
    id: "field",
    header: t('operations.table.field'),
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const operation = row.original;
      const fieldName = operation.field?.name || operation.fieldId;
      const fieldArea = operation.field?.area;

      const displayText = fieldArea
        ? `${fieldName} (${fieldArea} ha)`
        : fieldName;

      return (
        <div className="text-sm">
          {displayText || t('common.notAvailable')}
        </div>
      );
    },
    size: 140,
  },

  {
    accessorKey: "date",
    header: t('operations.table.date'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const date = getValue();
      if (!date) return <span className="text-gray-400">{t('common.notAvailable')}</span>;

      try {
        return (
          <div className="text-sm">
            {format(new Date(date), 'MMM dd, yyyy')}
          </div>
        );
      } catch (error) {
        return <span className="text-gray-400">{t('common.invalidDate')}</span>;
      }
    },
    size: 120,
  },

  {
    accessorKey: "startTime",
    header: t('operations.table.startTime'),
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm">
        {getValue() || t('common.notAvailable')}
      </div>
    ),
    size: 100,
  },

  {
    accessorKey: "startHours",
    header: t('operations.table.startHours'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm">
        {getValue() ? `${getValue()}h` : t('common.notAvailable')}
      </div>
    ),
    size: 100,
  },

  {
    accessorKey: "status",
    header: t('operations.table.status'),
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const status = getValue();
      return <StatusBadge status={status} />;
    },
    size: 120,
  },

];
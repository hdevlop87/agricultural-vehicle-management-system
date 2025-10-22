'use client'

import StatusBadge from '@/components/NStatusBadge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Calendar, User, Truck, Settings, Clock, Bell,  } from 'lucide-react';

export const alertsTableColumns = (t) => [

  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('alerts.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('alerts.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id",
    header: t('alerts.table.id'),
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
    accessorKey: "title",
    header: t('alerts.table.title'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: (info) => (
      <div className="font-medium">
        {info.getValue()}
      </div>
    ),
    size: 200,
  },

  {
    accessorKey: "type",
    header: t('alerts.table.type'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <AlertTriangle className="h-3 w-3 mr-1 text-gray-400" />
        <span className="capitalize">{t(`alerts.types.${getValue()}`)}</span>
      </div>
    ),
    size: 120,
  },

  {
    accessorKey: "priority",
    header: t('alerts.table.priority'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const priority = getValue();
      const priorityColors = {
        low: 'bg-blue-100 text-blue-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800'
      };
      
      return (
        <div className="flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1 text-gray-400" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority] || 'bg-gray-100 text-gray-800'}`}>
            {t(`alerts.priorities.${priority}`)}
          </span>
        </div>
      );
    },
    size: 120,
  },

  {
    accessorKey: "status",
    header: t('alerts.table.status'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
    size: 120,
  },

  {
    accessorKey: "vehicleName",
    header: t('alerts.table.vehicle'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <Truck className="h-3 w-3 mr-1 text-gray-400" />
        <span className="text-blue-600">
          {getValue() || t('common.notAvailable')}
        </span>
      </div>
    ),
    size: 150,
  },

  {
    accessorKey: "operatorName",
    header: t('alerts.table.operator'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <User className="h-3 w-3 mr-1 text-gray-400" />
        <span>
          {getValue() || t('common.notAvailable')}
        </span>
      </div>
    ),
    size: 130,
  },

];
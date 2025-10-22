'use client'

import StatusBadge from '@/components/NStatusBadge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, DollarSign, Wrench, Clock, AlertTriangle, User, Package } from 'lucide-react';

export const maintenanceTableColumns = (t) => [

  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('maintenance.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('maintenance.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id",
    header: t('maintenance.table.id'),
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
    header: t('maintenance.table.title'),
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
    accessorKey: "vehicleName",
    header: t('maintenance.table.vehicle'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: (info) => (
      <div className="font-medium text-blue-600">
        {info.getValue()}
      </div>
    ),
    size: 150,
  },

  {
    accessorKey: "status",
    header: t('maintenance.table.status'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
    size: 120,
  },

  {
    accessorKey: "dueHours",
    header: t('maintenance.table.dueHours'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <Clock className="h-3 w-3 mr-1 text-gray-400" />
        <span>
          {getValue() ? `${getValue()}h` : t('common.notAvailable')}
        </span>
      </div>
    ),
    size: 120,
  },

  {
    accessorKey: "cost",
    header: t('maintenance.table.cost'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
        <span>
          {getValue() ? `${t('maintenance.units.currency')}${parseFloat(getValue()).toLocaleString()}` : t('common.notAvailable')}
        </span>
      </div>
    ),
    size: 120,
  },

  {
    accessorKey: "scheduledDate",
    header: t('maintenance.table.scheduledDate'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
        <span className="text-sm">
          {getValue() ? new Date(getValue()).toLocaleDateString() : t('common.notAvailable')}
        </span>
      </div>
    ),
    size: 130,
  },

  {
    accessorKey: "priority",
    header: t('maintenance.table.priority'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const priority = getValue() || 'normal';
      const colors = {
        low: 'text-green-600 bg-green-50',
        normal: 'text-blue-600 bg-blue-50',
        high: 'text-orange-600 bg-orange-50',
        critical: 'text-red-600 bg-red-50'
      };
      
      return (
        <div className="flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1 text-gray-400" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
            {t(`maintenance.priorities.${priority}`)}
          </span>
        </div>
      );
    },
    size: 120,
  },

  {
    accessorKey: "assignedTo",
    header: t('maintenance.table.assignedTo'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <User className="h-3 w-3 mr-1 text-gray-400" />
        <span className="text-sm">
          {getValue() || t('common.notAssigned')}
        </span>
      </div>
    ),
    size: 140,
  },

  {
    accessorKey: "partsUsed",
    header: t('maintenance.table.partsUsed'),
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <Package className="h-3 w-3 mr-1 text-gray-400" />
        <span className="text-sm truncate max-w-32">
          {getValue() || t('common.notSpecified')}
        </span>
      </div>
    ),
    size: 140,
  },

];
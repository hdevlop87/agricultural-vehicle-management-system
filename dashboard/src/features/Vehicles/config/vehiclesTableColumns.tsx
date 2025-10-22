'use client'

import StatusBadge from '@/components/NStatusBadge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, DollarSign, Fuel } from 'lucide-react';
import { AvatarCell } from '@/components/NAvatarCell';

export const vehiclesTableColumns = (t) => [

  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('vehicles.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('vehicles.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id",
    header: t('vehicles.table.id'),
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
    accessorKey: "name",
    header: t('vehicles.table.vehicleName'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const vehicle = row.original;
      return <AvatarCell src={vehicle.image} name={vehicle.name} />;
    },
    size: 250,
  },

  {
    accessorKey: "type",
    header: t('vehicles.table.type'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <span className="capitalize">{t(`vehicles.types.${getValue()}`)}</span>
    ),
    size: 120,
  },

  {
    accessorKey: "brand",
    header: t('vehicles.table.brand'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: (info) => (
      <div>
        {info.getValue()}
      </div>
    ),
    size: 150,
  },

  {
    accessorKey: "model",
    header: t('vehicles.table.model'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: (info) => (
      <div>
        {info.getValue()}
      </div>
    ),
    size: 150,
  },

  
  {
    accessorKey: "year",
    header: t('vehicles.table.year'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
        <span>{getValue() || t('common.notAvailable')}</span>
      </div>
    ),
    size: 100,
  },
  
  {
    accessorKey: "licensePlate",
    header: t('vehicles.table.licensePlate'),
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm font-mono">
        {getValue() || t('common.notAvailable')}
      </div>
    ),
    size: 130,
  },
  
  {
    accessorKey: "purchasePrice",
    header: t('vehicles.table.purchasePrice'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
        <span>
          {getValue() ? `${t('vehicles.units.currency')}${parseFloat(getValue()).toLocaleString()}` : t('common.notAvailable')}
        </span>
      </div>
    ),
    size: 140,
  },
  {
    accessorKey: "status",
    header: t('vehicles.table.status'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
    size: 120,
  },


];
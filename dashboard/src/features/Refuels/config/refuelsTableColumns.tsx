'use client'

import { AvatarCell } from '@/components/NAvatarCell';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

export const refuelsTableColumns = (t) => [

  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('refuels.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('refuels.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id",
    header: t('refuels.table.id'),
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
    accessorKey: "vehicleName",
    header: t('refuels.table.vehicle'),
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const vehicle = row.original.vehicle;
      return <AvatarCell src={vehicle.image} name={vehicle.name} />;

    },
    size: 150,
  },


  {
    accessorKey: "datetime",
    header: t('refuels.table.datetime'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const datetime = getValue();
      if (!datetime) return <span className="text-gray-400">{t('common.notAvailable')}</span>;

      try {
        return (
          <div className="text-sm">
            {format(new Date(datetime), 'MMM dd, yyyy HH:mm')}
          </div>
        );
      } catch (error) {
        return <span className="text-gray-400">{t('common.invalidDate')}</span>;
      }
    },
    size: 150,
  },

  {
    accessorKey: "voucherNumber",
    header: t('refuels.table.voucherNumber'),
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm font-mono">
        {getValue() || t('common.notAvailable')}
      </div>
    ),
    size: 120,
  },

  {
    accessorKey: "liters",
    header: t('refuels.table.liters'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm">
        {getValue() ? `${parseFloat(getValue()).toFixed(2)}${t('refuels.units.liters')}` : t('common.notAvailable')}
      </div>
    ),
    size: 100,
  },

  {
    accessorKey: "totalCost",
    header: t('refuels.table.totalCost'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm font-semibold">
        {getValue() ? `$${parseFloat(getValue()).toFixed(2)}` : t('common.notAvailable')}
      </div>
    ),
    size: 120,
  },

  {
    accessorKey: "hoursAtRefuel",
    header: t('refuels.table.hours'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm">
        {getValue() ? `${getValue()}${t('refuels.units.hours')}` : t('common.notAvailable')}
      </div>
    ),
    size: 100,
  },

  {
    accessorKey: "mileageAtRefuel",
    header: t('refuels.table.mileage'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm">
        {getValue() ? `${getValue()} ${t('refuels.units.kilometers')}` : t('common.notAvailable')}
      </div>
    ),
    size: 100,
  },

  {
    accessorKey: "attendant",
    header: t('refuels.table.attendant'),
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm">
        {getValue() || t('common.notAvailable')}
      </div>
    ),
    size: 120,
  },

];
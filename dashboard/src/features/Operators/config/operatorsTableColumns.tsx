'use client'

import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { DollarSign, Phone, User } from 'lucide-react';
import StatusBadge from '@/components/NStatusBadge';
import { AvatarCell } from '@/components/NAvatarCell';


export const operatorsTableColumns = (t) => [

  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('operators.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('operators.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id",
    header: t('operators.table.id'),
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
    header: t('operators.table.operatorName'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const user = row.original;
      return <AvatarCell src={user.image} name={user.name} />;
    },

  },

  {
    accessorKey: "cin",
    header: t('operators.table.cin'),
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
    accessorKey: "phone",
    header: t('operators.table.phone'),
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <Phone className="h-3 w-3 mr-1 text-gray-400" />
        <span>{getValue() || t('common.notAvailable')}</span>
      </div>
    ),
    size: 150,
  },

  {
    accessorKey: "licenseNumber",
    header: t('operators.table.licenseNumber'),
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm font-mono">
        {getValue() || t('common.notAvailable')}
      </div>
    ),
    size: 150,
  },


  {
    accessorKey: "licenseExpiry",
    header: t('operators.table.licenseExpiry'),
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
    size: 130,
  },

  {
    accessorKey: "hireDate",
    header: t('operators.table.hireDate'),
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
    size: 130,
  },

  {
    accessorKey: "hourlyRate",
    header: t('operators.table.hourlyRate'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
        <span>
          {getValue() ? `$${parseFloat(getValue()).toFixed(2)}` : t('common.notAvailable')}
        </span>
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "status",
    header: t('operators.table.status'),
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const status = getValue();
      return <StatusBadge status={status} />;
    },
    size: 120,
  },

];
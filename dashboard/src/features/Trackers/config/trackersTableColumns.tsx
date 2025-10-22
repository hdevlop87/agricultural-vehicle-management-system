'use client'

import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Monitor, Truck, Wifi, WifiOff } from 'lucide-react';
import StatusBadge from '@/components/NStatusBadge';

export const trackersTableColumns = (t) => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('trackers.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('trackers.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id",
    header: t('trackers.table.id'),
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
    accessorKey: "deviceId",
    header: t('trackers.table.deviceId'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm font-mono font-medium">
        {getValue()}
      </div>
    ),
    size: 120,
  },

  {
    accessorKey: "name",
    header: t('trackers.table.trackerName'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <Monitor className="h-4 w-4 mr-2 text-gray-400" />
        <span className="font-medium">{getValue()}</span>
      </div>
    ),
    size: 150,
  },

  {
    accessorKey: "vehicleName",
    header: t('trackers.table.vehicle'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const vehicleName = row.original.vehicleName;
      const vehicleLicensePlate = row.original.vehicleLicensePlate;
      
      return (
        <div className="flex items-center">
          <Truck className="h-4 w-4 mr-2 text-gray-400" />
          <div>
            <div className="font-medium">{vehicleName}</div>
            {vehicleLicensePlate && (
              <div className="text-xs text-gray-400">{vehicleLicensePlate}</div>
            )}
          </div>
        </div>
      );
    },
    size: 200,
  },

  {
    accessorKey: "manufacturer",
    header: t('trackers.table.manufacturer'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm">
        {getValue() || t('trackers.table.unknown')}
      </div>
    ),
    size: 120,
  },

  {
    accessorKey: "isOnline",
    header: t('trackers.table.connection'),
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const isOnline = getValue();
      return (
        <div className={`flex items-center ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
          {isOnline ? (
            <Wifi className="h-4 w-4 mr-1" />
          ) : (
            <WifiOff className="h-4 w-4 mr-1" />
          )}
          <span className="text-sm font-medium">
            {isOnline ? t('trackers.connection.online') : t('trackers.connection.offline')}
          </span>
        </div>
      );
    },
    size: 120,
  },

  {
    accessorKey: "status",
    header: t('trackers.table.status'),
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const status = getValue();
      return <StatusBadge status={status} />;
    },
    size: 100,
  },

  {
    accessorKey: "lastSeen",
    header: t('trackers.table.lastSeen'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const date = getValue();
      if (!date) return <span className="text-gray-400">{t('trackers.lastSeen.never')}</span>;

      try {
        const lastSeen:any  = new Date(date);
        const now:any = new Date();
        const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));
        
        if (diffInMinutes < 5) {
          return <span className="text-green-600 text-sm">{t('trackers.lastSeen.justNow')}</span>;
        } else if (diffInMinutes < 60) {
          return <span className="text-yellow-600 text-sm">{diffInMinutes}{t('trackers.lastSeen.minutesAgo')}</span>;
        } else if (diffInMinutes < 1440) {
          return <span className="text-orange-600 text-sm">{Math.floor(diffInMinutes / 60)}{t('trackers.lastSeen.hoursAgo')}</span>;
        } else {
          return <span className="text-red-600 text-sm">{Math.floor(diffInMinutes / 1440)}{t('trackers.lastSeen.daysAgo')}</span>;
        }
      } catch (error) {
        return <span className="text-gray-400">{t('common.invalidDate')}</span>;
      }
    },
    size: 120,
  },

  {
    accessorKey: "createdAt",
    header: t('trackers.table.created'),
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
];
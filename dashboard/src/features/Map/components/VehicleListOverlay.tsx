"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useLanguage';
import NTable from '@/components/NTable';
import { mapVehiclesTableConfig } from '../config/mapVehiclesTableConfig';
import MapVehicleCard from './MapVehicleCard';



interface VehicleListOverlayProps {
  vehicles: any[];
  onVehicleClick?: (vehicle: any) => void;
}

const VehicleListOverlay = ({ vehicles, onVehicleClick }: VehicleListOverlayProps) => {
  const { t } = useTranslation();
  const config = mapVehiclesTableConfig(t);

  const onRowClick = (vehicle: any) => {
    if (onVehicleClick) {
      onVehicleClick(vehicle);
    }
  }

  return (
    <Card className="absolute bottom-0 md:top-1/2 md:-translate-y-1/2 md:left-4 gap-0 w-full md:w-76 h-1/2 md:h-[90%] bg-background/95 backdrop-blur z-10 rounded-t-2xl rounded-b-none md:rounded-3xl border shadow-lg">

      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-lg font-semibold">Vehicle List</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{vehicles?.length || 0} vehicles</span>
        </div>
      </div>


      <div className="overflow-y-auto overflow-x-hidden h-full flex flex-col gap-4 p-2">
        <NTable
          data={vehicles || []}
          columns={config.columns}
          filters={config.filters}
          isLoading={false}
          CardComponent={MapVehicleCard}
          viewMode="list"
          showAddButton={false}
          showViewToggle={false}
          showPagination={false}
          onRowClick={onRowClick}
        />
      </div>
    </Card>
  );
};

export default VehicleListOverlay;
"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useLanguage';
import { useVehiclesLocations } from '@/features/Map/hooks';
import { VehicleListOverlay, MapLegend } from '@/features/Map/components';
import { createMapMarkers, statusColors } from '@/features/Map/utils/mapMarkers';
import NMap from '@/components/NMap';
import LoadingError from '@/components/LoadingError';

interface MapProps {
  showVehicleList?: boolean;
  className?: string;
  height?: string;
}

const Map: React.FC<MapProps> = ({
  showVehicleList = true,
  className = "",
  height = "h-screen"
}) => {
  const { t } = useTranslation();
  const { vehiclesLocations, isVehiclesLocationsLoading, vehiclesLocationsError, refetchVehiclesLocations } = useVehiclesLocations();
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [mapZoom, setMapZoom] = useState<number>(15);

  if (isVehiclesLocationsLoading || vehiclesLocationsError) {
    return (
      <LoadingError
        isLoading={isVehiclesLocationsLoading}
        error={vehiclesLocationsError}
        loadingText={t('common.loading')}
        onRetry={refetchVehiclesLocations}
        fullScreen={!className}
      />
    );
  }

  const handleVehicleClick = (vehicle: any) => {
    if (vehicle.tracker?.location) {
      setMapCenter([vehicle.tracker.location.lat, vehicle.tracker.location.lng]);
      setMapZoom(15); // Zoom in when clicking on vehicle
    }
  };

  const mapMarkers = createMapMarkers(vehiclesLocations, t);

  return (
    <div className={`${height} w-full relative overflow-hidden ${className}`}>
      <NMap
        markers={mapMarkers}
        statusColors={statusColors}
        center={mapCenter}
        zoom={mapZoom}
      />

      <MapLegend vehicleCount={vehiclesLocations.length} />

      {showVehicleList && (
        <VehicleListOverlay
          vehicles={vehiclesLocations}
          onVehicleClick={handleVehicleClick}
        />
      )}
    </div>
  );
};

export default Map;
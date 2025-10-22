import React from 'react';
import { Icon } from 'leaflet';

export const statusColors = {
  active: '#10b981',
  maintenance: '#f59e0b',
  idle: '#6b7280',
  retired: '#ef4444',
};

export const createCustomIcon = (iconPath: string, size: number = 32) => new Icon({
  iconUrl: iconPath,
  iconSize: [size, size],
  iconAnchor: [size / 2, size],
  popupAnchor: [0, -size],
});

export const createColoredIcon = (color: string, size: number = 52) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
      <path fill="${color}" stroke="#fff" stroke-width="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `)}`,
  iconSize: [size, size],
  iconAnchor: [size / 2, size],
  popupAnchor: [0, -size],
});

export const createMapMarkers = (vehiclesLocations: any[], t: (key: string) => string) => {
  return vehiclesLocations.map((vehicle) => ({
    id: vehicle.id,
    position: [vehicle.tracker.location.lat, vehicle.tracker.location.lng] as [number, number],
    status: vehicle.status,
    title: vehicle.name,
    // Create colored icon based on vehicle status
    icon: createColoredIcon(statusColors[vehicle.status] || statusColors.idle),
    content: (
      <div className="space-y-1 text-sm">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[vehicle.status] || statusColors.idle }} />
          {vehicle.tracker.isOnline && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Online" />
          )}
        </div>
        <p><strong>{t('vehicles.table.brand')}:</strong> {vehicle.brand}</p>
        <p><strong>{t('vehicles.table.model')}:</strong> {vehicle.model}</p>
        <p><strong>{t('vehicles.table.type')}:</strong> {vehicle.type}</p>
        <p><strong>{t('vehicles.table.licensePlate')}:</strong> {vehicle.licensePlate}</p>

        {vehicle.tracker && (
          <div className="pt-2 border-t">
            <p><strong>{t('tracker.source')}:</strong> {vehicle.tracker.source}</p>
            {vehicle.tracker.speed && (
              <p><strong>{t('tracker.speed')}:</strong> {vehicle.tracker.speed} km/h</p>
            )}
            {vehicle.tracker.altitude && (
              <p><strong>{t('tracker.altitude')}:</strong> {vehicle.tracker.altitude} m</p>
            )}
            {vehicle.tracker.batteryLevel && (
              <p><strong>{t('tracker.battery')}:</strong> {vehicle.tracker.batteryLevel}%</p>
            )}
            {vehicle.tracker.isMoving !== undefined && (
              <p><strong>{t('tracker.status')}:</strong> {vehicle.tracker.isMoving ? t('tracker.moving') : t('tracker.stopped')}</p>
            )}
          </div>
        )}

        <div className="pt-2 text-xs text-muted-foreground">
          <p>{t('map.coordinates')}: {vehicle.tracker.location.lat.toFixed(6)}, {vehicle.tracker.location.lng.toFixed(6)}</p>
          {vehicle.tracker.timestamp && (
            <p>{t('map.lastUpdate')}: {new Date(vehicle.tracker.timestamp).toLocaleString()}</p>
          )}
        </div>
      </div>
    )
  }));
};
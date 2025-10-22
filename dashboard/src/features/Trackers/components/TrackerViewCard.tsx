"use client";

import React from 'react';
import {
  Smartphone, Signal, Battery, MapPin, Truck, Calendar, Clock, Wifi, WifiOff,
  Activity, Navigation, TrendingUp, AlertTriangle, Zap, UserCheck,
  Eclipse,
  Factory,
  Cpu
} from 'lucide-react';
import StatusBadge from '@/components/NStatusBadge';
import StatusIndicator from '@/components/NStatusBadge';
import { useTranslation } from '@/hooks/useLanguage';
import { useTrackerById } from '../hooks/useTrackerById';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatDate, getStatusColor, cn } from '@/lib/utils';
import LoadingError from '@/components/LoadingError';
import NStatWidget from '@/components/NStatWidget';
import { NSection, NSectionInfo } from '@/components/NSectionCard';

const TrackerHeader = ({ tracker }) => {
  return (
    <Card className="flex p-5 items-center flex-col md:flex-row md:gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
        <Smartphone className="h-10 w-10 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex flex-col justify-center items-center md:items-start md:gap-0.5">
        <Label className="text-2xl font-bold">{tracker.name}</Label>
        <Label className="text-md">{tracker.deviceId}</Label>
        <div className="flex items-center gap-3 mt-1">
          {tracker.isOnline ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">Offline</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const TrackerViewCard = ({ trackerId }) => {
  const { t } = useTranslation();
  const { tracker, isTrackerLoading, trackerError, refetchTracker } = useTrackerById(trackerId);

  // ---------- Loading/Error Check ----------
  if (isTrackerLoading || trackerError || !tracker) {
    return (
      <LoadingError
        isLoading={isTrackerLoading}
        error={trackerError}
        noData={!tracker}
        loadingText={t('common.loading')}
        noDataText="Tracker not found"
        onRetry={refetchTracker}
        fullScreen={true}
      />
    );
  }

  // ---------- Destructuring ----------
  const {
    name,
    deviceId,
    status,
    isOnline,
    lastSeen,
    batteryLevel,
    manufacturer,
    mode,
    source,
    refreshInterval,
    refreshUnit,
    vehicle,
    operator,
    currentLocation,
    locationHistory = [],
    statistics = {},
    createdAt,
    updatedAt,
  } = tracker || {};

  console.log(tracker);
  

  const {
    totalLocations = 0,
    avgBatteryLevel = 0,
    totalOnlineTime = 0,
    totalOfflineTime = 0,
    lastLocationUpdate,
    movementDistance = 0,
    averageSpeed = 0,
  } = statistics;

  // ---------- Render ----------
  return (
    <div className="flex flex-col gap-4 h-full w-full overflow-auto">

      {/* Header */}
      <TrackerHeader tracker={tracker} />

      {/* Performance Stats */}
      <div className="grid grid-cols-2 gap-4">
        <NStatWidget
          icon={Battery}
          title="Battery Level"
          value={batteryLevel || 'N/A'}
          subtitle={`Avg: ${avgBatteryLevel}%`}
          unit={batteryLevel ? "%" : ""}
        />

        <NStatWidget
          icon={Signal}
          title="Refresh Rate"
          value={refreshInterval || 60}
          subtitle={`${source} tracker`}
          unit={refreshUnit || 's'}
          color="blue"
        />

        <NStatWidget
          icon={Activity}
          title="Total Locations"
          value={totalLocations}
          subtitle={`Movement: ${movementDistance}km`}
          unit="points"
          color="purple"
        />

        <NStatWidget
          icon={Navigation}
          title="Avg Speed"
          value={averageSpeed || 0}
          subtitle={`Last update: ${lastLocationUpdate ? formatDate(lastLocationUpdate, t) : 'N/A'}`}
          unit="km/h"
          color="green"
        />
      </div>

      {/* Tracker Information */}
      <NSection
        icon={Smartphone}
        title="Tracker Information"
        iconColor="text-blue-500"
        background="bg-card"
        className="border shadow-sm"
      >
        <NSectionInfo
          icon={Cpu}
          label="Device ID"
          value={deviceId}
        />
        {manufacturer && (
          <NSectionInfo
            icon={Factory}
            label="Manufacturer"
            value={manufacturer}
          />
        )}
        {source && (
          <NSectionInfo
            icon={Smartphone}
            label="Source"
            value={t(`trackers.sources.${source}`) || source}
          />
        )}
        {mode && (
          <NSectionInfo
            icon={Zap}
            label="Mode"
            value={t(`trackers.modes.${mode}`) || mode}
          />
        )}
        {refreshInterval && refreshUnit && (
          <NSectionInfo
            icon={Clock}
            label="Refresh Interval"
            value={`${refreshInterval}${refreshUnit}`}
          />
        )}
        {lastSeen && (
          <NSectionInfo
            icon={Clock}
            label="Last Seen"
            value={formatDate(lastSeen, t)}
          />
        )}

      </NSection>

      {/* Assignment Information */}
      {(vehicle || operator) && (
        <NSection
          icon={Truck}
          title="Assignment"
          iconColor="text-purple-500"
          background="bg-card"
          className="border shadow-sm"
        >
          {vehicle && (
            <>
              <NSectionInfo
                icon={Truck}
                label="Vehicle"
                value={vehicle.name}
              />
              {vehicle.licensePlate && (
                <NSectionInfo
                  label="License Plate"
                  value={vehicle.licensePlate}
                />
              )}
              {vehicle.type && (
                <NSectionInfo
                  label="Vehicle Type"
                  value={t(`vehicles.types.${vehicle.type}`) || vehicle.type}
                />
              )}
            </>
          )}

          {operator && (
            <>
              <NSectionInfo
                icon={UserCheck}
                label="Operator"
                value={operator.name}
              />
              {operator.email && (
                <NSectionInfo
                  label="Email"
                  value={operator.email}
                />
              )}
              {operator.phone && (
                <NSectionInfo
                  label="Phone"
                  value={operator.phone}
                />
              )}
            </>
          )}
        </NSection>
      )}

      {/* Current Location */}
      {currentLocation && (
        <NSection
          icon={MapPin}
          title="Current Location"
          iconColor="text-green-500"
          background="bg-card"
          className="border shadow-sm"
        >
          <NSectionInfo
            icon={MapPin}
            label="Coordinates"
            value={`${currentLocation.latitude}, ${currentLocation.longitude}`}
          />
          {currentLocation.speed && (
            <NSectionInfo
              icon={Navigation}
              label="Speed"
              value={`${currentLocation.speed} km/h`}
            />
          )}
          {currentLocation.altitude && (
            <NSectionInfo
              label="Altitude"
              value={`${currentLocation.altitude}m`}
            />
          )}
          {currentLocation.timestamp && (
            <NSectionInfo
              icon={Clock}
              label="Timestamp"
              value={formatDate(currentLocation.timestamp, t)}
            />
          )}
          {currentLocation.batteryLevel && (
            <NSectionInfo
              icon={Battery}
              label="Battery at Location"
              value={`${currentLocation.batteryLevel}%`}
            />
          )}
        </NSection>
      )}

      {/* Recent Location History */}
      {locationHistory.length > 0 && (
        <NSection
          icon={Navigation}
          title="Recent Location History"
          iconColor="text-blue-500"
          background="bg-card"
          className="border shadow-sm"
        >
          <div className="flex flex-col gap-4">
            {locationHistory.slice(0, 5).map((location, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex flex-row justify-between items-start mb-2">
                  <div className="font-medium">Location #{index + 1}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(location.timestamp, t)}
                  </div>
                </div>
                <div className="space-y-1">
                  <NSectionInfo
                    icon={MapPin}
                    label="Coordinates"
                    value={`${location.latitude}, ${location.longitude}`}
                    className="text-xs"
                  />
                  {location.speed && (
                    <NSectionInfo
                      icon={Navigation}
                      label="Speed"
                      value={`${location.speed} km/h`}
                      className="text-xs"
                    />
                  )}
                  {location.batteryLevel && (
                    <NSectionInfo
                      icon={Battery}
                      label="Battery"
                      value={`${location.batteryLevel}%`}
                      className="text-xs"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </NSection>
      )}

    </div>
  );
};

export default TrackerViewCard;
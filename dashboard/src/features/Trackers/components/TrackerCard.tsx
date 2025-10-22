"use client";

import React from 'react';
import { Smartphone, Signal, Battery, MapPin, Truck, Calendar, Clock, Wifi, WifiOff } from 'lucide-react';
import StatusIndicator from '@/components/NStatusBadge';
import { useTranslation } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import NStatWidget from '@/components/NStatWidget';
import { NSection, NSectionInfo } from '@/components/NSectionCard';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const TrackerHeader = ({ tracker }) => {
  return (
    <div className="flex flex-col items-center p-4 md:flex-row md:gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
        <Smartphone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex flex-col justify-center items-center md:items-start">
        <Label className="text-md font-bold">{tracker.name}</Label>
        <Label className="text-sm">{tracker.deviceId}</Label>
        <div className="flex items-center gap-2">
          {tracker.isOnline ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="h-3 w-3" />
              <span className="text-xs">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <WifiOff className="h-3 w-3" />
              <span className="text-xs">Offline</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TrackerCard = ({ data }) => {
  const { t } = useTranslation();
  const tracker = data;

  return (
    <div className="flex flex-col gap-4">

      <TrackerHeader tracker={tracker} />

      {/* Tracker Information */}
      <NSection
        icon={Smartphone}
        title="Tracker Information"
        iconColor="text-blue-400"
        background="bg-foreground/10"
      >
        {tracker.source && (
          <NSectionInfo
            icon={Smartphone}
            label="Source"
            value={t(`trackers.sources.${tracker.source}`) || tracker.source}
            valueColor="text-muted-foreground"
            iconColor="text-muted-foreground/60"
          />
        )}

        {tracker.mode && (
          <NSectionInfo
            icon={Signal}
            label="Mode"
            value={t(`trackers.modes.${tracker.mode}`) || tracker.mode}
            valueColor="text-muted-foreground"
            iconColor="text-muted-foreground/60"
          />
        )}

        {tracker.manufacturer && (
          <NSectionInfo
            icon={Smartphone}
            label="Manufacturer"
            value={tracker.manufacturer}
            valueColor="text-muted-foreground"
            iconColor="text-muted-foreground/60"
          />
        )}

        {tracker.lastSeen && (
          <NSectionInfo
            icon={Clock}
            label="Last Seen"
            value={formatDate(tracker.lastSeen, t)}
            valueColor="text-muted-foreground"
            iconColor="text-muted-foreground/60"
          />
        )}
      </NSection>

      {/* Vehicle Assignment */}
      {(tracker.vehicle || tracker.operator) && (
        <NSection
          icon={Truck}
          title="Assignment"
          iconColor="text-purple-400"
          background="bg-foreground/10"
        >
          {tracker.vehicle && (
            <NSectionInfo
              icon={Truck}
              label="Vehicle"
              value={tracker.vehicle.name}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {tracker.operator && (
            <NSectionInfo
              icon={MapPin}
              label="Operator"
              value={tracker.operator.name}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}
        </NSection>
      )}
    </div>
  );
};

export default TrackerCard;
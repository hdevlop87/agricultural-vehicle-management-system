"use client";

import React from 'react';
import { Hash, CreditCard, Calendar, DollarSign, Fuel, Clock, MapPin, Truck, Settings } from 'lucide-react';
import { AvatarCell } from '@/components/NAvatarCell';
import StatusIndicator from '@/components/NStatusBadge';
import { useTranslation } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import NStatWidget from '@/components/NStatWidget';
import { NSection, NSectionInfo } from '@/components/NSectionCard';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const VehicleHeader = ({ vehicle }) => {
  return (
    <div className="flex flex-col items-center p-4   md:flex-row md:gap-4">
      <AvatarCell src={vehicle.image} />
      <div className="flex flex-col justify-center items-center md:items-start">
        <Label className="text-md font-bold">{vehicle.name}</Label>
        <Label className="text-sm">{vehicle.licensePlate}</Label>
        <StatusIndicator status={vehicle.status} variant="minimal" />
      </div>
    </div>
  );
};

const VehicleCard = ({ data }) => {
  const { t } = useTranslation();
  const vehicle = data;

  return (
    <div className="flex flex-col gap-4">

      <VehicleHeader vehicle={vehicle} />

      {/* Key Metrics Grid */}
      {(vehicle.currentMileage || vehicle.currentHours) && (
        <div className="grid grid-cols-2 gap-4">
          {vehicle.currentMileage && (
            <NStatWidget
              icon={MapPin}
              title={t('vehicles.table.currentMileage')}
              value={vehicle.currentMileage}
              unit="km"
              color="blue"
              variant="compact"
            />
          )}

          {vehicle.currentHours && (
            <NStatWidget
              icon={Clock}
              title={t('vehicles.table.currentHours')}
              value={vehicle.currentHours}
              unit="hrs"
              color="green"
              variant="compact"
            />
          )}
        </div>
      )}

      {/* Vehicle Information */}
      <NSection
        icon={Truck}
        title="Vehicle Information"
        iconColor="text-blue-400"
        background="bg-foreground/10"
      >
        {vehicle.type && (
          <NSectionInfo
            icon={Truck}
            label={t('vehicles.form.vehicleType')}
            value={t(`vehicles.types.${vehicle.type}`)}
            valueColor="text-muted-foreground"
            iconColor="text-muted-foreground/60"
          />
        )}

        {vehicle.fuelType && (
          <NSectionInfo
            icon={Fuel}
            label={t('vehicles.form.fuelType')}
            value={t(`vehicles.fuelTypes.${vehicle.fuelType}`)}
            valueColor="text-muted-foreground"
            iconColor="text-muted-foreground/60"
          />
        )}

        {vehicle.purchasePrice && (
          <NSectionInfo
            icon={DollarSign}
            label={t('vehicles.form.purchasePrice')}
            value={formatCurrency(vehicle.purchasePrice)}
            valueColor="text-muted-foreground"
            iconColor="text-muted-foreground/60"
          />
        )}
      </NSection>
    </div>
  );
};

export default VehicleCard;
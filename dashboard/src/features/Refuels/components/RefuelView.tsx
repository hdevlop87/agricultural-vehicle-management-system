"use client";

import React from 'react';
import {
  Fuel, Calendar, Clock, MapPin, User, Truck, Hash,
  DollarSign, Droplets, Target, TrendingUp, Settings
} from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguage';
import { useRefuelById } from '../hooks/useRefuelById';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import LoadingError from '@/components/LoadingError';
import NStatWidget from '@/components/NStatWidget';
import { NSection, NSectionInfo } from '@/components/NSectionCard';

const RefuelHeader = ({ refuel, t }) => {
  return (
    <Card className="flex p-5 items-center flex-col md:flex-row md:gap-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
        <Fuel className="h-8 w-8 text-primary" />
      </div>
      <div className="flex flex-col justify-center items-center md:items-start md:gap-0.5">
        <Label className="text-2xl font-bold">
          {refuel.voucherNumber || `Refuel #${refuel.id}`}
        </Label>
        <Label className="text-md text-muted-foreground">
          {refuel.vehicle?.name || 'Unknown Vehicle'}
        </Label>
        <Label className="text-sm font-medium text-primary">
          {formatCurrency(refuel.totalCost || 0)}
        </Label>
        <Label className="text-xs text-muted-foreground">
          {formatDate(refuel.datetime, t)}
        </Label>
      </div>
    </Card>
  );
};

const RefuelView = ({ refuelId }) => {
  const { t } = useTranslation();
  const { refuel, isRefuelLoading, refuelError, refetchRefuel } = useRefuelById(refuelId);

    // ---------- Loading/Error Check ----------
  if (isRefuelLoading || refuelError || !refuel) {
    return (
      <LoadingError
        isLoading={isRefuelLoading}
        error={refuelError}
        noData={!refuel}
        loadingText={t('common.loading')}
        noDataText={t('refuels.errors.notFound')}
        onRetry={refetchRefuel}
        fullScreen={true}
      />
    );
  }

  // ---------- Derived Values ----------
  const costPerLiter = refuel?.liters && refuel?.totalCost
    ? (parseFloat(refuel.totalCost) / parseFloat(refuel.liters)).toFixed(2)
    : 0;

  const fuelEfficiency = refuel?.fuelLevelAfter && refuel?.liters
    ? Math.round((refuel.fuelLevelAfter / refuel.liters) * 10) / 10
    : 0;

  const efficiencyLabel = fuelEfficiency >= 8
    ? 'Excellent'
    : fuelEfficiency >= 6
      ? 'Good'
      : 'Average';

  const efficiencyColor = fuelEfficiency >= 8
    ? 'text-green-600'
    : fuelEfficiency >= 6
      ? 'text-yellow-600'
      : 'text-blue-600';



  // ---------- Render ----------
  return (
    <div className="flex flex-col gap-4 h-full w-full overflow-auto">

      {/* Header */}
      <RefuelHeader refuel={refuel} t={t} />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <NStatWidget
          icon={Fuel}
          title="Fuel Quantity"
          value={refuel.liters || 0}
          subtitle={`${costPerLiter} per liter`}
          unit="L"
          color="blue"
        />
        <NStatWidget
          icon={DollarSign}
          title="Total Cost"
          value={formatCurrency(refuel.totalCost || 0)}
          subtitle={`${refuel.fuelLevelAfter || 0}% tank level`}
          unit="USD"
          color="green"
        />
        <NStatWidget
          icon={Target}
          title="Fuel Efficiency"
          value={fuelEfficiency}
          subtitle={efficiencyLabel}
          unit="ratio"
          color="purple"
        />
        <NStatWidget
          icon={Clock}
          title="Vehicle Hours"
          value={refuel.hoursAtRefuel || 0}
          subtitle={`${refuel.mileageAtRefuel || 0} km mileage`}
          unit="hrs"
          color="yellow"
        />
      </div>

      {/* Refuel Information */}
      <NSection
        icon={Settings}
        title="Refuel Information"
        iconColor="text-blue-500"
        background="bg-card"
        className="border shadow-sm"
      >
        <NSectionInfo
          icon={Hash}
          label="Voucher Number"
          value={refuel.voucherNumber || t('common.notAvailable')}
        />
        <NSectionInfo
          icon={Calendar}
          label="Date & Time"
          value={formatDate(refuel.datetime, t)}
        />
        <NSectionInfo
          icon={Truck}
          label="Vehicle"
          value={refuel.vehicle?.name || t('common.notAvailable')}
        />
        <NSectionInfo
          icon={User}
          label="Operator"
          value={refuel.operator?.name || t('common.notAvailable')}
        />
        {refuel.attendant && (
          <NSectionInfo
            icon={User}
            label="Attendant"
            value={refuel.attendant}
          />
        )}
      </NSection>

      {/* Fuel Details */}
      <NSection
        icon={Fuel}
        title="Fuel Details"
        iconColor="text-yellow-500"
        background="bg-card"
        className="border shadow-sm"
      >
        <NSectionInfo
          icon={Droplets}
          label="Quantity"
          value={`${refuel.liters || 0} liters`}
          valueColor="font-medium"
        />
        <NSectionInfo
          icon={DollarSign}
          label="Cost per Liter"
          value={`$${costPerLiter}`}
          valueColor="font-medium"
        />
        <NSectionInfo
          icon={DollarSign}
          label="Total Cost"
          value={formatCurrency(refuel.totalCost || 0)}
          valueColor="font-medium text-green-600"
        />

        <NSectionInfo
          icon={TrendingUp}
          label="Fuel Level After"
          value={`${refuel.fuelLevelAfter}%`}
          valueColor="font-medium"
        />

        <NSectionInfo
          icon={Target}
          label="Fuel Efficiency"
          value={fuelEfficiency}
          valueColor="font-medium"
        />

        <NSectionInfo
          icon={MapPin}
          label="Mileage at Refuel"
          value={`${refuel.mileageAtRefuel} km`}
          valueColor="font-medium"
        />

      </NSection>

      {/* Vehicle Metrics */}
      <NSection
        icon={Truck}
        title="Vehicle Metrics"
        iconColor="text-purple-500"
        background="bg-card"
        className="border shadow-sm"
      >

        <NSectionInfo
          icon={Clock}
          label="Hours at Refuel"
          value={`${refuel.hoursAtRefuel} hours`}
        />


        <NSectionInfo
          icon={MapPin}
          label="Mileage at Refuel"
          value={`${refuel.mileageAtRefuel} km`}
        />

        <NSectionInfo
          icon={TrendingUp}
          label="Efficiency Rating"
          value={efficiencyLabel}
          valueColor={cn("font-medium", efficiencyColor)}
        />

        <NSectionInfo
          icon={Fuel}
          label="Vehicle Avg Consumption"
          value={`${refuel.analytics.vehicleAvgConsumption} L/100km`}
        />

        <NSectionInfo
          icon={DollarSign}
          label="Vehicle Avg Cost"
          value={formatCurrency(refuel.analytics.vehicleAvgCost)}
        />

      </NSection>

      {/* Additional Notes */}
      {refuel.notes && (
        <NSection
          icon={Settings}
          title="Additional Notes"
          iconColor="text-gray-500"
          background="bg-card"
          className="border shadow-sm"
        >
          <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
            {refuel.notes}
          </div>
        </NSection>
      )}

    </div>
  );
};

export default RefuelView;
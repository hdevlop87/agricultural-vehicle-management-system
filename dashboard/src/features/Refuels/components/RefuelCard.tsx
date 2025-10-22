"use client";

import React from 'react';
import { Calendar, DollarSign, Fuel, Clock, MapPin, User, Truck, Hash, Settings, Target } from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguage';
import NStatWidget from '@/components/NStatWidget';
import { NSection, NSectionInfo } from '@/components/NSectionCard';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatCurrency, formatDate } from '@/lib/utils';

const RefuelHeader = ({ refuel, t }) => {
  return (
    <div className="flex flex-col items-center p-4 md:flex-row md:gap-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
        <Fuel className="h-6 w-6 text-primary" />
      </div>
      <div className="flex flex-col justify-center items-center md:items-start flex-1">
        <Label className="text-md font-bold">
          {refuel.voucherNumber || `Refuel #${refuel.id}`}
        </Label>
        <Label className="text-sm text-muted-foreground">{refuel.datetime }</Label>
      </div>
    </div>
  );
};

const RefuelCard = ({ data }) => {
  const { t } = useTranslation();
  const refuel = data;

  // Safe formatters following Vehicle/Operator patterns
  const formatCurrencyValue = (amount) => {
    if (!amount) return t('common.notAvailable');
    return formatCurrency(amount);
  };

  const calculateCostPerLiter = () => {
    if (refuel.liters && refuel.totalCost) {
      const costPerLiter = parseFloat(refuel.totalCost) / parseFloat(refuel.liters);
      return `$${costPerLiter.toFixed(2)}`;
    }
    return '$0.00';
  };

  // Follow Vehicle/Operator pattern for conditional rendering
  const hasKeyMetrics = refuel.liters || refuel.totalCost;
  const hasBasicInfo = refuel.vehicle?.name || refuel.operator?.name || refuel.datetime;

  return (
    <div className="flex flex-col gap-4">
      <RefuelHeader refuel={refuel} t={t} />

      {/* Key Metrics Grid - Following VehicleCard pattern */}
      {hasKeyMetrics && (
        <div className="grid grid-cols-2 gap-3">
          {refuel.liters && (
            <NStatWidget
              icon={Fuel}
              title={t('refuels.form.liters')}
              value={refuel.liters}
              subtitle={`${calculateCostPerLiter()} ${t('refuels.analytics.perLiter')}`}
              unit="L"
              color="blue"
              variant="compact"
            />
          )}

          {refuel.totalCost && (
            <NStatWidget
              icon={DollarSign}
              title={t('refuels.table.totalCost')}
              value={formatCurrencyValue(refuel.totalCost)}
              subtitle={refuel.fuelLevelAfter ? `${refuel.fuelLevelAfter}% ${t('refuels.analytics.tankLevel')}` : t('refuels.analytics.costTotal')}
              unit="USD"
              color="green"
              variant="compact"
            />
          )}
        </div>
      )}

      {/* Refuel Information - Following OperatorCard pattern */}
      {hasBasicInfo && (
        <NSection
          icon={Settings}
          title={t('refuels.card.refuelInfo')}
          iconColor="text-blue-400"
          background="bg-foreground/10"
        >
          {refuel.vehicle?.name && (
            <NSectionInfo
              icon={Truck}
              label={t('refuels.form.vehicle')}
              value={refuel.vehicle.name}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {refuel.operator?.name && (
            <NSectionInfo
              icon={User}
              label={t('refuels.form.operator')}
              value={refuel.operator.name}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {refuel.voucherNumber && (
            <NSectionInfo
              icon={Hash}
              label={t('refuels.form.voucherNumber')}
              value={refuel.voucherNumber}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {refuel.attendant && (
            <NSectionInfo
              icon={User}
              label={t('refuels.form.attendant')}
              value={refuel.attendant}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}
        </NSection>
      )}
    </div>
  );
};

export default RefuelCard;
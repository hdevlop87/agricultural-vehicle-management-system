"use client";

import React from 'react';
import {
  MapPin, Calendar, Activity, Clock, Fuel, Truck,
  TrendingUp, Droplets, UserCheck, Settings, Ruler, Hash,
  BarChart3,
  Target
} from 'lucide-react';
import StatusBadge from '@/components/NStatusBadge';
import { useTranslation } from '@/hooks/useLanguage';
import { useFieldById } from '../hooks/useFieldById';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatDate, formatCurrency, cn, formatArea, formatCoordinates } from '@/lib/utils';
import LoadingError from '@/components/LoadingError';
import NStatWidget from '@/components/NStatWidget';
import { NSection, NSectionInfo } from '@/components/NSectionCard';

const FieldHeader = ({ field }) => {
  const formatCoordinates = (location) => {
    if (!location || !location.lat || !location.lng) {
      return 'No coordinates';
    }
    return `${parseFloat(location.lat).toFixed(4)}, ${parseFloat(location.lng).toFixed(4)}`;
  };

  const formatArea = (area) => {
    if (!area) return 'N/A';
    return `${parseFloat(area).toFixed(2)} ha`;
  };

  return (
    <Card className="flex p-5 items-center flex-col md:flex-row md:gap-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
        <MapPin className="h-8 w-8 text-primary" />
      </div>
      <div className="flex flex-col justify-center items-center md:items-start md:gap-0.5">
        <Label className="text-2xl font-bold">{field.name}</Label>
        <Label className="text-sm font-medium text-primary">{formatArea(field.area)}</Label>
        <Label className="text-xs text-muted-foreground">{formatCoordinates(field.location)}</Label>
      </div>
    </Card>
  );
};

const FieldView = ({ fieldId }) => {
  const { t } = useTranslation();
  const { field, isFieldLoading, fieldError, refetchField } = useFieldById(fieldId);

    // ---------- Loading/Error Check ----------
  if (isFieldLoading || fieldError || !field) {
    return (
      <LoadingError
        isLoading={isFieldLoading}
        error={fieldError}
        noData={!field}
        loadingText={t('common.loading')}
        noDataText={t('fields.errors.notFound')}
        onRetry={refetchField}
        fullScreen={true}
      />
    );
  }

  // ---------- Destructuring ----------
  const {
    name,
    id,
    area,
    description,
    location,
    analytics = {},
  } = field || {};

  const {
    totalOperations = 0,
    totalOperationsCompleted = 0,
    totalAreaCovered = 0,
    fieldArea = 0,
    totalFuelCost = 0,
    totalFuelLiters = 0,
    totalRefuels = 0,
    efficiency = 0,
    utilizationRate = 0,
    productivityScore = 0,
    uniqueOperationTypes = 0,
    avgAreaPerOperation = 0,
    recentOperations = [],
    recentRefuels = [],
  } = analytics;

  // ---------- Derived Values ----------
  const utilizationLabel = utilizationRate >= 80
    ? 'High'
    : utilizationRate >= 50
      ? 'Medium'
      : 'Low';

  const utilizationColor = utilizationRate >= 80
    ? 'text-green-600'
    : utilizationRate >= 50
      ? 'text-yellow-600'
      : 'text-red-600';

  const efficiencyLabel = efficiency >= 80
    ? 'Excellent'
    : efficiency >= 60
      ? 'Good'
      : 'Needs Improvement';

  const efficiencyColor = efficiency >= 80
    ? 'text-green-600'
    : efficiency >= 60
      ? 'text-yellow-600'
      : 'text-red-600';



  // ---------- Render ----------
  return (
    <div className="flex flex-col gap-4 h-full w-full overflow-auto">

      {/* Header */}
      <FieldHeader field={field} />

      {/* Performance Stats */}
      {Object.keys(analytics).length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <NStatWidget
            icon={Activity}
            title="Operations Completed"
            value={totalOperationsCompleted}
            subtitle={`${efficiency}% efficiency`}
            unit="Total"
            color="blue"
          />
          <NStatWidget
            icon={Ruler}
            title="Area Covered"
            value={totalAreaCovered}
            subtitle={`${utilizationRate}% field utilization`}
            unit="ha"
            color="green"
          />
          <NStatWidget
            icon={TrendingUp}
            title="Productivity Score"
            value={productivityScore}
            subtitle={`${uniqueOperationTypes} operation types`}
            unit="ops/ha"
            color="purple"
          />
          <NStatWidget
            icon={Fuel}
            title="Fuel Costs"
            value={formatCurrency(totalFuelCost)}
            subtitle={`${totalRefuels} refuels, ${totalFuelLiters}L total`}
            unit="USD"
            color="yellow"
          />
        </div>
      )}

      {/* Field Information */}
      <NSection
        icon={Settings}
        title={t('fields.card.fieldInfo')}
        iconColor="text-blue-400"
        background="bg-foreground/10"
      >

        <NSectionInfo
          icon={Ruler}
          label={t('fields.table.area')}
          value={`${formatArea(field.area,t)} ${t('fields.units.hectares')}`}
          valueColor="text-muted-foreground"
          iconColor="text-muted-foreground/60"
        />

        <NSectionInfo
          icon={MapPin}
          label={t('fields.table.location')}
          value={formatCoordinates(field.location,t)}
          valueColor="text-muted-foreground"
          iconColor="text-muted-foreground/60"
        />

        {/* Analytics Section */}
        {field.analytics && (
          <>
            <NSectionInfo
              icon={TrendingUp}
              label={t('fields.analytics.utilization')}
              value={`${field.analytics.utilizationRate || 0}%`}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />

            <NSectionInfo
              icon={Target}
              label={t('fields.analytics.efficiency')}
              value={`${field.analytics.efficiency || 0}%`}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />

            <NSectionInfo
              icon={BarChart3}
              label={t('fields.analytics.productivityScore')}
              value={`${field.analytics.productivityScore || 0} ${t('fields.analytics.productivity')}`}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          </>
        )}
      </NSection>

      {/* Performance Summary */}
      {Object.keys(analytics).length > 0 && (
        <NSection
          icon={TrendingUp}
          title="Performance Summary"
          iconColor="text-purple-500"
          background="bg-card"
          className="border shadow-sm"
        >
          {totalOperationsCompleted > 0 && (
            <NSectionInfo
              icon={Activity}
              label="Avg Area/Operation"
              value={`${avgAreaPerOperation} ha`}
              valueColor="font-medium"
            />
          )}
          {utilizationRate > 0 && (
            <NSectionInfo
              icon={Ruler}
              label="Field Utilization"
              value={utilizationLabel}
              valueColor={cn("font-medium", utilizationColor)}
            />
          )}
          {efficiency > 0 && (
            <NSectionInfo
              icon={TrendingUp}
              label="Efficiency Rating"
              value={efficiencyLabel}
              valueColor={cn("font-medium", efficiencyColor)}
            />
          )}
          <NSectionInfo
            icon={Settings}
            label="Operation Types"
            value={`${uniqueOperationTypes} different types`}
            valueColor="font-medium"
          />
        </NSection>
      )}

      {/* Recent Operations */}
      {recentOperations.length > 0 && (
        <NSection
          icon={Activity}
          title="Recent Operations"
          iconColor="text-blue-500"
          background="bg-card"
          className="border shadow-sm"
        >
          <div className="flex flex-col gap-4">
            {recentOperations.map((operation, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex flex-row justify-between items-start mb-2">
                  <div className="font-medium">{operation.operationType || 'Operation'}</div>
                  <StatusBadge status={operation.status} size="sm" />
                </div>
                <div className="space-y-1">
                  <NSectionInfo
                    icon={Calendar}
                    label="Date"
                    value={formatDate(operation.date, t)}
                    className="text-xs"
                  />
                  {operation.operator?.name && (
                    <NSectionInfo
                      icon={UserCheck}
                      label="Operator"
                      value={operation.operator.name}
                      className="text-xs"
                    />
                  )}
                  {operation.vehicle?.name && (
                    <NSectionInfo
                      icon={Truck}
                      label="Vehicle"
                      value={operation.vehicle.name}
                      className="text-xs"
                    />
                  )}
                  {operation.duration && (
                    <NSectionInfo
                      icon={Clock}
                      label="Duration"
                      value={`${operation.duration}h`}
                      className="text-xs"
                    />
                  )}
                  {operation.areaCovered && (
                    <NSectionInfo
                      icon={Activity}
                      label="Area Covered"
                      value={`${operation.areaCovered} ha`}
                      className="text-xs"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </NSection>
      )}

      {/* Recent Refuels */}
      {recentRefuels.length > 0 && (
        <NSection
          icon={Fuel}
          title="Recent Refuels (Field Operations)"
          iconColor="text-yellow-500"
          background="bg-card"
          className="border shadow-sm"
        >
          <div className="flex flex-col gap-4">
            {recentRefuels.map((refuel, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex flex-row justify-between items-start mb-2">
                  <div className="font-medium">{refuel.voucherNumber || `Refuel #${index + 1}`}</div>
                  <div className="text-green-600 font-medium">{formatCurrency(refuel.totalCost)}</div>
                </div>
                <div className="space-y-1">
                  <NSectionInfo
                    icon={Calendar}
                    label="Date"
                    value={formatDate(refuel.datetime, t)}
                    className="text-xs"
                  />
                  {refuel.vehicle?.name && (
                    <NSectionInfo
                      icon={Truck}
                      label="Vehicle"
                      value={refuel.vehicle.name}
                      className="text-xs"
                    />
                  )}
                  <NSectionInfo
                    icon={Droplets}
                    label="Liters"
                    value={`${refuel.liters}L`}
                    className="text-xs"
                  />
                  {refuel.operator?.name && (
                    <NSectionInfo
                      icon={UserCheck}
                      label="Operator"
                      value={refuel.operator.name}
                      className="text-xs"
                    />
                  )}
                  {refuel.attendant && (
                    <NSectionInfo
                      icon={UserCheck}
                      label="Attendant"
                      value={refuel.attendant}
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

export default FieldView;
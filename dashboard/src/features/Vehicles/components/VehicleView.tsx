"use client";

import React from 'react';
import {
  Truck, Calendar, DollarSign, Activity, Clock, Fuel, MapPin,
  AlertTriangle, Wrench, TrendingUp, Gauge, Droplets, UserCheck,
} from 'lucide-react';
import { AvatarCell } from '@/components/NAvatarCell';
import StatusBadge from '@/components/NStatusBadge';
import StatusIndicator from '@/components/NStatusBadge';
import { useTranslation } from '@/hooks/useLanguage';
import { useVehicleById } from '../hooks/useVehicleById';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatDate, formatCurrency, getPriorityColor, getStatusColor, cn } from '@/lib/utils';
import LoadingError from '@/components/LoadingError';
import NStatWidget from '@/components/NStatWidget';
import { NSection, NSectionInfo } from '@/components/NSectionCard';


const VehicleHeader = ({ vehicle }) => {
  return (
    <Card className="flex p-5 items-center flex-col md:flex-row md:gap-4">
      <AvatarCell src={vehicle.image} size='xl'  />
      <div className="flex flex-col justify-center items-center md:items-start md:gap-0.5">
        <Label className="text-2xl font-bold">{vehicle.name}</Label>
        <Label className="text-md">{vehicle.licensePlate}</Label>
        <StatusIndicator status={vehicle.status} variant="minimal" />
      </div>
    </Card>
  );
};

const VehicleView = ({ vehicleId }) => {
  const { t } = useTranslation();
  const { vehicle, isVehicleLoading, vehicleError, refetchVehicle } = useVehicleById(vehicleId);

    // ---------- Loading/Error Check ----------
  if (isVehicleLoading || vehicleError || !vehicle) {
    return (
      <LoadingError
        isLoading={isVehicleLoading}
        error={vehicleError}
        noData={!vehicle}
        loadingText={t('common.loading')}
        noDataText={t('vehicles.errors.notFound')}
        onRetry={refetchVehicle}
        fullScreen={true}
      />
    );
  }
  
  // ---------- Destructuring ----------
  const {
    name,
    id,
    brand,
    model,
    type,
    status,
    year,
    licensePlate,
    fuelType,
    currentMileage,
    initialMileage,
    purchasePrice,
    vehicleAge,
    totalMileageCalculated,
    analytics = {},
  } = vehicle || {};

  const {
    totalOperations = 0,
    totalOperationsCompleted = 0,
    totalHours = 0,
    totalMileage = 0,
    totalFuelCost = 0,
    totalFuelLiters = 0,
    totalRefuels = 0,
    totalMaintenance = 0,
    efficiency = 0,
    avgHoursPerOperation = 0,
    avgFuelCostPerRefuel = 0,
    recentRefuels = [],
    recentMaintenance = [],
    recentAlerts = [],
    recentOperations = [],
  } = analytics;

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
      <VehicleHeader vehicle={vehicle} />

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
            icon={Clock}
            title="Total Hours"
            value={totalHours}
            subtitle={`${totalOperations} total operations`}
            unit="Hours"
            color="green"
          />
          <NStatWidget
            icon={Gauge}
            title="Total Mileage"
            value={totalMileage || totalMileageCalculated}
            subtitle={`Avg ${avgHoursPerOperation}h per operation`}
            unit="km"
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
          <NStatWidget
            title="Vehicle Age"
            subtitle="Years since manufacture"
            icon={Calendar}
            value={vehicleAge}
            unit="yrs"
            color="pink"
          />
          <NStatWidget
            title="Maintenance Records"
            subtitle="Total service history"
            icon={Wrench}
            value={totalMaintenance}
            unit="records"
            color="gray"
          />
        </div>
      )}

      {/* Vehicle Information - Using NSection Component */}
      <NSection 
        icon={Truck} 
        title="Vehicle Information" 
        iconColor="text-blue-500"
        background="bg-card"
        className="border shadow-sm"
      >
        {type && (
          <NSectionInfo 
            icon={Activity} 
            label="Type" 
            value={type} 
          />
        )}
        {(brand || model) && (
          <NSectionInfo 
            icon={Truck} 
            label="Brand/Model" 
            value={`${brand || ''} ${model || ''}`.trim()} 
          />
        )}
        {fuelType && (
          <NSectionInfo 
            icon={Fuel} 
            label="Fuel Type" 
            value={fuelType} 
          />
        )}
        {year && (
          <NSectionInfo 
            icon={Calendar} 
            label="Year" 
            value={year} 
          />
        )}
        {purchasePrice && (
          <NSectionInfo 
            icon={DollarSign} 
            label="Purchase Price" 
            value={formatCurrency(purchasePrice)} 
          />
        )}
      </NSection>

      {/* Recent Alerts - Using NSection Component */}
      {recentAlerts.length > 0 && (
        <NSection 
          icon={AlertTriangle} 
          title="Recent Alerts" 
          iconColor="text-red-500"
          background="bg-card"
          className="border shadow-sm"
        >
          <div className="flex flex-col gap-4">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex flex-row justify-between items-start mb-2">
                  <div className="font-medium">{alert.title}</div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full text-white self-start",
                    getPriorityColor(alert.priority)
                  )}>
                    {alert.priority}
                  </span>
                </div>
                <div className="space-y-1">
                  <NSectionInfo 
                    label="Type" 
                    value={alert.type} 
                    valueColor="text-muted-foreground text-sm" 
                  />
                  <NSectionInfo 
                    icon={Calendar} 
                    label="Date" 
                    value={formatDate(alert.createdAt, t)} 
                    className="text-xs" 
                  />
                  <NSectionInfo 
                    label="Status" 
                    value={alert.status} 
                    valueColor={getStatusColor(alert.status)} 
                    className="text-xs" 
                  />
                </div>
              </div>
            ))}
          </div>
        </NSection>
      )}

      {/* Recent Refuels - Using NSection Component */}
      {recentRefuels.length > 0 && (
        <NSection 
          icon={Fuel} 
          title="Recent Refuels" 
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

      {/* Recent Maintenance - Using NSection Component */}
      {recentMaintenance.length > 0 && (
        <NSection 
          icon={Wrench} 
          title="Recent Maintenance" 
          iconColor="text-purple-500"
          background="bg-card"
          className="border shadow-sm"
        >
          <div className="flex flex-col gap-4">
            {recentMaintenance.map((maintenance, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex flex-row justify-between items-start mb-2">
                  <div className="font-medium">{maintenance.title}</div>
                  <StatusBadge status={maintenance.status} size="sm" />
                </div>
                {maintenance.description && (
                  <div className="text-sm text-muted-foreground mb-2">{maintenance.description}</div>
                )}
                <div className="space-y-1">
                  <NSectionInfo 
                    icon={Calendar} 
                    label="Scheduled" 
                    value={formatDate(maintenance.scheduledDate, t)} 
                    className="text-xs" 
                  />
                  {maintenance.completedDate && (
                    <NSectionInfo 
                      icon={Calendar} 
                      label="Completed" 
                      value={formatDate(maintenance.completedDate, t)} 
                      className="text-xs" 
                    />
                  )}
                  {maintenance.cost && (
                    <NSectionInfo 
                      icon={DollarSign} 
                      label="Cost" 
                      value={formatCurrency(maintenance.cost)} 
                      className="text-xs" 
                    />
                  )}
                  {maintenance.operator?.name && (
                    <NSectionInfo 
                      icon={UserCheck} 
                      label="Operator" 
                      value={maintenance.operator.name} 
                      className="text-xs" 
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </NSection>
      )}

      {/* Recent Operations - Using NSection Component */}
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

      {/* Performance Summary - Using NSection Component */}
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
              label="Avg Hours/Operation" 
              value={`${avgHoursPerOperation}h`} 
              valueColor="font-medium" 
            />
          )}
          {totalRefuels > 0 && (
            <NSectionInfo 
              label="Avg Fuel Cost/Refuel" 
              value={formatCurrency(avgFuelCostPerRefuel)} 
              valueColor="font-medium" 
            />
          )}
          {efficiency > 0 && (
            <NSectionInfo 
              label="Efficiency Rating" 
              value={efficiencyLabel} 
              valueColor={cn("font-medium", efficiencyColor)} 
            />
          )}
          <NSectionInfo 
            label="Status" 
            value={status} 
            valueColor={cn("font-medium", getStatusColor(status))} 
          />
        </NSection>
      )}

    </div>
  );
};

export default VehicleView;
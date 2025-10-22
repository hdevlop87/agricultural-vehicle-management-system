"use client";

import React from 'react';
import { Phone, Mail, Calendar, Clock, DollarSign, Shield, AlertTriangle, Fuel, MapPin, Activity, TrendingUp, Truck, Droplets, UserCheck, CreditCard } from 'lucide-react';
import { AvatarCell } from '@/components/NAvatarCell';
import StatusBadge from '@/components/NStatusBadge';
import { useTranslation } from '@/hooks/useLanguage';
import { useOperatorById } from '../hooks/useOperatorById';
import { Card } from '@/components/ui/card';
import { formatDate, formatCurrency, getPriorityColor, getStatusColor, cn } from '@/lib/utils';
import LoadingError from '@/components/LoadingError';
import NStatWidget from '@/components/NStatWidget';
import { OperationViewCard } from '@/features/Operations/components/OperationViewCard';
import { useDialogStore } from '@/stores/DialogStore';
import { NSection, NSectionInfo } from '@/components/NSectionCard';
import StatusIndicator from '@/components/NStatusBadge';
import { Label } from '@/components/ui/label';

const OperatorHeader = ({ operator }) => {
  return (
    <Card className="flex p-5 items-center flex-col md:flex-row md:gap-4">
      <AvatarCell src={operator.image} size='xl' />
      <div className="flex flex-col justify-center items-center md:items-start md:gap-0.5">
        <Label className="text-2xl font-bold ">{operator.name}</Label>
        <Label className="text-md ">{operator.cin}</Label>
        <StatusIndicator status={operator.status} variant="minimal" />
      </div>
    </Card>
  );
};

const OperatorView = ({ operatorId }) => {
  const { t } = useTranslation();
  const { operator, isOperatorLoading, operatorError, refetchOperator } = useOperatorById(operatorId);
  const { openDialog } = useDialogStore();

  // ---------- Helpers ----------

  const handleOperationClick = (operation) => {
    openDialog({
      title: `${operation.operationType || 'Operation'} Details`,
      children: <OperationViewCard operation={operation} />,
      showButtons: false,
    });
  };

  // ---------- Loading/Error Check ----------
  if (isOperatorLoading || operatorError || !operator) {
    return (
      <LoadingError
        isLoading={isOperatorLoading}
        error={operatorError}
        noData={!operator}
        loadingText={t('common.loading')}
        noDataText={t('operators.errors.notFound')}
        onRetry={refetchOperator}
        fullScreen={true}
      />
    );
  }

  // ---------- Destructuring ----------
  const {
    name,
    id,
    cin,
    image,
    status,
    email,
    phone,
    hireDate,
    licenseNumber,
    licenseExpiry,
    hourlyRate,
    analytics = {},
    todayOperations = [],
  } = operator || {};

  // ---------- Derived Values ----------
  const yearsOfService = operator?.yearsOfService || 0;

  const {
    totalOperationsCompleted = 0,
    totalHoursWorked = 0,
    totalOperations = 0,
    totalHectaresCovered = 0,
    totalFuelCost = 0,
    totalRefuels = 0,
    totalLiters = 0,
    efficiency = 0,
    avgHoursPerOperation = 0,
    avgFuelCostPerRefuel = 0,
    avgHectaresPerOperation = 0,
    recentOperations = [],
    recentAlerts = [],
    recentFuelRecords = [],
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
    <div className="flex flex-col gap-4 h-full w-full overflow-auto ">

      {/* Header */}
      <OperatorHeader operator={operator} />

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
            title="Hours Worked"
            value={totalHoursWorked}
            subtitle={`${totalOperations} total operations`}
            unit="Hours"
            color="green"
          />
          <NStatWidget
            icon={MapPin}
            title="Hectares Covered"
            value={totalHectaresCovered}
            subtitle={`${avgHectaresPerOperation} ha avg per operation`}
            unit="ha"
            color="purple"
          />
          <NStatWidget
            icon={Fuel}
            title="Fuel Costs"
            value={formatCurrency(totalFuelCost)}
            subtitle={`${totalRefuels} refuels, ${totalLiters}L total`}
            unit="USD"
            color="yellow"
          />
          <NStatWidget
            title="Years of Service"
            subtitle="Total time with company"
            icon={Calendar}
            value={yearsOfService}
            unit="yrs"
            color="pink"
          />
          <NStatWidget
            title="Hourly Rate"
            subtitle="Current pay per hour"
            icon={DollarSign}
            value={hourlyRate}
            unit="/hr"
            color="gray"
          />
        </div>
      )}

      {/* Contact Info  */}
      <NSection
        icon={Phone}
        title="Contact Information"
        iconColor="text-blue-500"
        background="bg-card"
        className="border shadow-sm"
      >
        {email && (
          <NSectionInfo
            icon={Mail}
            label="Email"
            value={email}
          />
        )}
        {phone && (
          <NSectionInfo
            icon={Phone}
            label="Phone"
            value={phone}
          />
        )}
        {hireDate && (
          <NSectionInfo
            icon={Calendar}
            label="Hired"
            value={formatDate(hireDate, t)}
          />
        )}
      </NSection>

      {/* License  */}
      {(licenseNumber || licenseExpiry) && (
        <NSection
          icon={Shield}
          title="License Details"
          iconColor="text-yellow-500"
          background="bg-card"
          className="border shadow-sm"
        >
          {licenseNumber && (
            <NSectionInfo
              icon={CreditCard}
              label="License Number"
              value={licenseNumber}
              valueColor="font-medium"
            />
          )}
          {licenseExpiry && (
            <NSectionInfo
              icon={Calendar}
              label="Expires"
              value={formatDate(licenseExpiry, t)}
              valueColor="font-medium"
            />
          )}
        </NSection>
      )}

      {/* Performance Summary  */}
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
              icon={Clock}
              label="Avg Hours/Operation"
              value={`${avgHoursPerOperation}h`}
              valueColor="font-medium"
            />
          )}
          {totalRefuels > 0 && (
            <NSectionInfo
              icon={Fuel}
              label="Avg Fuel Cost/Refuel"
              value={formatCurrency(avgFuelCostPerRefuel)}
              valueColor="font-medium"
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
            icon={UserCheck}
            label="Status"
            value={status}
            valueColor={cn("font-medium", getStatusColor(status))}
          />
        </NSection>
      )}

      {/* Today's Operations  */}
      {todayOperations.length > 0 && (
        <NSection
          icon={Activity}
          title="Today's Operations"
          iconColor="text-green-500"
          background="bg-card"
          className="border shadow-sm"
        >
          <div className="flex flex-col gap-4">
            {todayOperations.map((operation, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleOperationClick(operation)}
              >
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
                  <NSectionInfo
                    icon={Truck}
                    label="Vehicle"
                    value={operation.vehicle?.name || operation.vehicleId}
                    className="text-xs"
                  />
                  <NSectionInfo
                    icon={MapPin}
                    label="Field"
                    value={operation.field?.name || operation.fieldId}
                    className="text-xs"
                  />
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

      {/* Alerts */}
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
                  {alert.vehicleId && (
                    <NSectionInfo
                      label="Vehicle"
                      value={alert.vehicleId}
                      className="text-xs"
                    />
                  )}
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

      {/* Fuel Records */}
      {recentFuelRecords.length > 0 && (
        <NSection
          icon={Fuel}
          title="Recent Fuel Records"
          iconColor="text-yellow-500"
          background="bg-card"
          className="border shadow-sm"
        >
          <div className="flex flex-col gap-4">
            {recentFuelRecords.map((record, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex flex-row justify-between items-start mb-2">
                  <div className="font-medium">{record.voucherNumber || `Refuel #${index + 1}`}</div>
                  <div className="text-green-600 font-medium">{formatCurrency(record.totalCost)}</div>
                </div>
                <div className="space-y-1">
                  <NSectionInfo
                    icon={Calendar}
                    label="Date"
                    value={formatDate(record.datetime, t)}
                    className="text-xs"
                  />
                  <NSectionInfo
                    icon={Truck}
                    label="Vehicle"
                    value={record.vehicleName || record.vehicleId}
                    className="text-xs"
                  />
                  <NSectionInfo
                    icon={Droplets}
                    label="Liters"
                    value={`${record.liters}L`}
                    className="text-xs"
                  />
                  {record.attendant && (
                    <NSectionInfo
                      icon={UserCheck}
                      label="Attendant"
                      value={record.attendant}
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

export default OperatorView;
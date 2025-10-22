"use client";

import React from 'react';
import {
  Wrench, Calendar, Clock, DollarSign, Truck, Hash,
  Settings, FileText, AlertTriangle, CheckCircle, User
} from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguage';
import { useMaintenanceById } from '../hooks/useMaintenanceById';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import LoadingError from '@/components/LoadingError';
import { NSection, NSectionInfo } from '@/components/NSectionCard';

const MaintenanceHeader = ({ maintenance, t }) => {
  return (
    <Card className="flex p-5 items-center flex-col md:flex-row md:gap-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
        <Wrench className="h-8 w-8 text-primary" />
      </div>
      <div className="flex flex-col justify-center items-center md:items-start md:gap-0.5">
        <Label className="text-2xl font-bold">
          {maintenance.title || `Maintenance #${maintenance.id}`}
        </Label>
        <Label className="text-md text-muted-foreground">
          {maintenance.vehicleName || 'Unknown Vehicle'}
        </Label>
        <Label className="text-sm font-medium text-primary">
          {formatCurrency(maintenance.cost || 0)}
        </Label>
        <Label className="text-xs text-muted-foreground">
          {formatDate(maintenance.scheduledDate, t)}
        </Label>
      </div>
    </Card>
  );
};

const MaintenanceView = ({ maintenanceId }) => {
  const { t } = useTranslation();
  const { maintenance, isMaintenanceLoading, maintenanceError, refetchMaintenance } = useMaintenanceById(maintenanceId);

  // ---------- Loading/Error Check ----------
  if (isMaintenanceLoading || maintenanceError || !maintenance) {
    return (
      <LoadingError
        isLoading={isMaintenanceLoading}
        error={maintenanceError}
        noData={!maintenance}
        loadingText={t('common.loading')}
        noDataText={t('maintenance.errors.notFound')}
        onRetry={refetchMaintenance}
        fullScreen={true}
      />
    );
  }

  // Destructure maintenance data
  const {
    id,
    title,
    type,
    status,
    priority,
    vehicleName,
    vehicleId,
    cost,
    dueHours,
    scheduledDate,
    completedAt,
    createdAt,
    updatedAt,
    assignedTo,
    partsUsed,
    notes
  } = maintenance;

  // ---------- Derived Values ----------
  const priorityColor = priority === 'high'
    ? 'text-red-600'
    : priority === 'medium'
      ? 'text-yellow-600'
      : priority === 'critical'
        ? 'text-red-800'
        : 'text-green-600';

  const statusColor = status === 'completed'
    ? 'text-green-600'
    : status === 'in_progress'
      ? 'text-blue-600'
      : status === 'overdue'
        ? 'text-red-600'
        : 'text-yellow-600';

  // ---------- Render ----------
  return (
    <div className="flex flex-col gap-4 h-full w-full overflow-auto">

      {/* Header */}
      <MaintenanceHeader maintenance={maintenance} t={t} />

      {/* Maintenance Information */}
      <NSection
        icon={Settings}
        title="Maintenance Information"
        iconColor="text-blue-500"
        background="bg-card"
        className="border shadow-sm"
      >
        <NSectionInfo
          icon={Hash}
          label="Maintenance ID"
          value={`#${id}`}
        />
        <NSectionInfo
          icon={Wrench}
          label="Title"
          value={title}
        />
        <NSectionInfo
          icon={Wrench}
          label="Type"
          value={type}
        />
        <NSectionInfo
          icon={Truck}
          label="Vehicle"
          value={vehicleName}
        />
        <NSectionInfo
          icon={AlertTriangle}
          label="Priority"
          value={priority}
          valueColor={cn("font-medium", priorityColor)}
        />
        <NSectionInfo
          icon={CheckCircle}
          label="Status"
          value={status}
          valueColor={cn("font-medium", statusColor)}
        />
      </NSection>

      {/* Schedule & Timing */}
      <NSection
        icon={Calendar}
        title="Schedule & Timing"
        iconColor="text-purple-500"
        background="bg-card"
        className="border shadow-sm"
      >
        {scheduledDate && (
          <NSectionInfo
            icon={Calendar}
            label="Scheduled Date"
            value={formatDate(scheduledDate, t)}
            valueColor="font-medium"
          />
        )}
        {completedAt && (
          <NSectionInfo
            icon={CheckCircle}
            label="Completed At"
            value={formatDate(completedAt, t)}
            valueColor="font-medium text-green-600"
          />
        )}
        {dueHours && (
          <NSectionInfo
            icon={Clock}
            label="Due Hours"
            value={`${dueHours} hours`}
            valueColor="font-medium"
          />
        )}
        <NSectionInfo
          icon={Calendar}
          label="Created At"
          value={formatDate(createdAt, t)}
          valueColor="font-medium"
        />
      </NSection>

      {/* Cost & Resources */}
      <NSection
        icon={DollarSign}
        title="Cost & Resources"
        iconColor="text-green-500"
        background="bg-card"
        className="border shadow-sm"
      >
        {cost && (
          <NSectionInfo
            icon={DollarSign}
            label="Total Cost"
            value={formatCurrency(cost)}
            valueColor="font-medium text-green-600"
          />
        )}
        {partsUsed && (
          <NSectionInfo
            icon={Wrench}
            label="Parts Used"
            value={partsUsed}
            valueColor="font-medium"
          />
        )}
        {assignedTo && (
          <NSectionInfo
            icon={User}
            label="Assigned To"
            value={assignedTo}
            valueColor="font-medium"
          />
        )}
      </NSection>

      {/* Additional Notes */}
      {notes && (
        <NSection
          icon={FileText}
          title="Additional Notes"
          iconColor="text-gray-500"
          background="bg-card"
          className="border shadow-sm"
        >
          <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
            {notes}
          </div>
        </NSection>
      )}

    </div>
  );
};

export default MaintenanceView;
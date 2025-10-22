"use client";

import React from 'react';
import { Wrench, Truck, Clock, DollarSign, Calendar, Settings, FileText, Hash } from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguage';
import { NSection, NSectionInfo } from '@/components/NSectionCard';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatCurrency, formatDate } from '@/lib/utils';
import StatusIndicator from '@/components/NStatusBadge';

const MaintenanceHeader = ({ maintenance, t }) => {
  return (
    <div className="flex flex-col items-center p-4  md:flex-row md:gap-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
        <Wrench className="h-6 w-6 text-primary" />
      </div>
      <div className="flex flex-col justify-center items-center md:items-start flex-1">
        <span className="flex text-md font-bold max-w-44 truncate">
          {maintenance.title || `Maintenance #${maintenance.id}`}
        </span>
        <Label className="text-sm text-muted-foreground">
          <Truck className="h-3 w-3 inline mr-1" />
          {maintenance.vehicleName || t('common.notAvailable')}
        </Label>
        <StatusIndicator status={maintenance.status} variant="minimal" />
      </div>
    </div>
  );
};

const MaintenanceCard = ({ data }) => {
  const { t } = useTranslation();
  const maintenance = data;

  // Safe formatters following Vehicle/Operator patterns
  const formatCurrencyValue = (amount) => {
    if (!amount) return t('common.notAvailable');
    return formatCurrency(amount);
  };

  const formatDateValue = (dateString) => {
    if (!dateString) return t('common.notAvailable');
    return formatDate(dateString, t);
  };

  const formatNumber = (value, unit) => {
    if (!value) return t('common.notAvailable');
    return `${value} ${unit}`;
  };

  // Follow Vehicle/Operator pattern for conditional rendering
  const hasBasicInfo = maintenance.vehicleName || maintenance.type || maintenance.scheduledDate || maintenance.priority;

  return (
    <div className="flex flex-col gap-4">
      <MaintenanceHeader maintenance={maintenance} t={t} />

      {/* Maintenance Information - Following OperatorCard pattern */}
      {hasBasicInfo && (
        <NSection
          icon={Settings}
          title={t('maintenance.card.maintenanceInfo')}
          iconColor="text-blue-400"
          background="bg-foreground/10"
        >
          {maintenance.type && (
            <NSectionInfo
              icon={Wrench}
              label={t('maintenance.form.type')}
              value={t(`maintenance.types.${maintenance.type}`)}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {maintenance.vehicleName && (
            <NSectionInfo
              icon={Truck}
              label={t('maintenance.form.vehicle')}
              value={maintenance.vehicleName}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {maintenance.scheduledDate && (
            <NSectionInfo
              icon={Calendar}
              label={t('maintenance.form.scheduledDate')}
              value={formatDateValue(maintenance.scheduledDate)}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {maintenance.completedAt && (
            <NSectionInfo
              icon={Calendar}
              label={t('maintenance.table.completedAt')}
              value={formatDateValue(maintenance.completedAt)}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {maintenance.dueHours && (
            <NSectionInfo
              icon={Clock}
              label={t('maintenance.form.dueHours')}
              value={formatNumber(maintenance.dueHours, 'h')}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {maintenance.cost && (
            <NSectionInfo
              icon={DollarSign}
              label={t('maintenance.form.cost')}
              value={formatCurrencyValue(maintenance.cost)}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {maintenance.priority && (
            <NSectionInfo
              icon={Hash}
              label={t('maintenance.form.priority')}
              value={t(`maintenance.priorities.${maintenance.priority}`)}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {maintenance.assignedTo && (
            <NSectionInfo
              icon={Settings}
              label={t('maintenance.form.assignedTo')}
              value={maintenance.assignedTo}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

        </NSection>
      )}
    </div>
  );
};

export default MaintenanceCard;
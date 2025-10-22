"use client";

import React from 'react';
import { Bell, AlertTriangle, Calendar, Clock, Truck, User, Settings, MessageSquare, Hash } from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguage';
import { NSection, NSectionInfo } from '@/components/NSectionCard';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/utils';
import StatusIndicator from '@/components/NStatusBadge';

const AlertHeader = ({ alert, t }) => {
  const getTypeIcon = (type) => {
    const icons = {
      maintenance: <Settings className="h-6 w-6 text-primary" />,
      fuel: <AlertTriangle className="h-6 w-6 text-primary" />,
      security: <AlertTriangle className="h-6 w-6 text-primary" />,
      operational: <Bell className="h-6 w-6 text-primary" />,
      system: <Settings className="h-6 w-6 text-primary" />
    };
    return icons[type] || <AlertTriangle className="h-6 w-6 text-primary" />;
  };

  return (
    <div className="flex flex-col items-center p-4  md:flex-row md:gap-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
        {getTypeIcon(alert.type)}
      </div>
      <div className="flex flex-col justify-center items-center md:items-start flex-1">
        <Label className="text-md font-bold">
          {alert.title || `Alert #${alert.id}`}
        </Label>
        <Label className="text-sm text-muted-foreground">
          <MessageSquare className="h-3 w-3 inline mr-1" />
          {t(`alerts.types.${alert.type}`)}
        </Label>
        <StatusIndicator status={alert.status} variant="minimal" />
      </div>
    </div>
  );
};

const AlertCard = ({ data }) => {
  const { t } = useTranslation();
  const alert = data;

  // Safe formatters following Vehicle/Operator patterns
  const formatDateValue = (dateString) => {
    if (!dateString) return t('common.notAvailable');
    return formatDate(dateString, t);
  };

  // Follow Vehicle/Operator pattern for conditional rendering
  const hasBasicInfo = alert.vehicleName || alert.operatorName || alert.message || alert.createdAt;

  return (
    <div className="flex flex-col gap-4">
      <AlertHeader alert={alert} t={t} />

      {/* Alert Information - Following MaintenanceCard pattern */}
      {hasBasicInfo && (
        <NSection
          icon={Bell}
          title={t('alerts.card.alertInfo')}
          iconColor="text-blue-400"
          background="bg-foreground/10"
        >
          {alert.type && (
            <NSectionInfo
              icon={AlertTriangle}
              label={t('alerts.form.type')}
              value={t(`alerts.types.${alert.type}`)}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {alert.priority && (
            <NSectionInfo
              icon={AlertTriangle}
              label={t('alerts.form.priority')}
              value={t(`alerts.priorities.${alert.priority}`)}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {alert.vehicleName && (
            <NSectionInfo
              icon={Truck}
              label={t('alerts.form.vehicle')}
              value={alert.vehicleName}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {alert.operatorName && (
            <NSectionInfo
              icon={User}
              label={t('alerts.form.operator')}
              value={alert.operatorName}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {alert.createdAt && (
            <NSectionInfo
              icon={Calendar}
              label={t('alerts.table.createdAt')}
              value={formatDateValue(alert.createdAt)}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {alert.readAt && (
            <NSectionInfo
              icon={Clock}
              label={t('alerts.table.readAt')}
              value={formatDateValue(alert.readAt)}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {alert.resolvedAt && (
            <NSectionInfo
              icon={Clock}
              label={t('alerts.table.resolvedAt')}
              value={formatDateValue(alert.resolvedAt)}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

        </NSection>
      )}
    </div>
  );
};

export default AlertCard;